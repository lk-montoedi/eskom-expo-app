import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  ScrollView,
  StatusBar, // Added StatusBar for consistency
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import bgImage from "../../assets/images/webbg.png"; // Import the background image
import { API_URL } from "../constants/api";
import { useMarksheets } from "../contexts/MarksheetContext";
import { useTimer } from "../contexts/TimerContext";

const { width } = Dimensions.get("window");

const MARKSHEET_TYPES = [
  {
    type: "engineering",
    criteriaOrder: [
      "introduction_background",
      "introduction_problem",
      "introduction_goals",
      "method_criteria",
      "method_procedure",
      "method_prototype",
      "method_testing",
      "results_accuracy",
      "results_works",
      "discussion_feasibility",
      "discussion_linked",
      "discussion_significance",
      "conclusion_limitations",
      "conclusion_achieved",
      "originality_ethics",
      "originality_knowledge",
      "originality_contribution",
      "written_references",
      "written_documents",
      "poster_understanding",
      "poster_explanation",
      "poster_answers",
      "poster_limitations",
      "poster_summary",
      "poster_journal"
    ],
    sections: [
      {
        title: "INTRODUCTION (12 marks)",
        description: "Background, problem identification, and engineering goals",
        fields: [
          {
            key: "introduction_background",
            label: "1. Key concepts are introduced, providing a good background to topic. Relevant literature are reviewed (0-4)"
          },
          {
            key: "introduction_problem",
            label: "2. Problem / issue / phenomena identified. Purpose / aim is clear. Research Question stated (0-4)"
          },
          {
            key: "introduction_goals",
            label: "3. Engineering Goals or Design Goals correct, achievable, and measurable (0-4)"
          }
        ]
      },
      {
        title: "METHOD (16 marks)",
        description: "Design criteria, procedures, prototypes, and testing methodology",
        fields: [
          {
            key: "method_criteria",
            label: "4. Design criteria of prototype(s) / processes / program(s) or codes/platforms are clear & align to the goal (0-4)"
          },
          {
            key: "method_procedure",
            label: "5. Procedure includes types of material, measurements, and units. Understands different coding, interfaces and platforms (0-4)"
          },
          {
            key: "method_prototype",
            label: "6. Prototype(s) / Solutions are illustrated/explained with diagrams, plans and/or flow charts. Evidence of design-test-redesign-retest using different approaches/materials/processes/methods (0-4)"
          },
          {
            key: "method_testing",
            label: "7. Number of trials/testing of prototypes / codes/platforms are adequate and accurate (0-4)"
          }
        ]
      },
      {
        title: "RESULTS, DISCUSSION, CONCLUSION (28 marks)",
        description: "Results presentation, analysis, feasibility, and conclusions",
        fields: [
          {
            key: "results_accuracy",
            label: "8. Accurate results presented using circuits/ diagrams/ graphs/ tables/ descriptions. Patterns / correlations / outliers in the results are identified and discussed (0-4)"
          },
          {
            key: "results_works",
            label: "9. Final prototype/ process/ code/ platform works and is aligned with the goal (0-4)"
          },
          {
            key: "discussion_feasibility",
            label: "10. Feasibility of final prototype/ process/ code/ platform discussed e.g. financial, time, labour, scale (0-4)"
          },
          {
            key: "discussion_linked",
            label: "11. Discussion linked to the goals. Solution(s) addressing the problem/ issue are discussed. Discussion cites relevant literature and compares prototype(s) or solution(s) to other studies (0-4)"
          },
          {
            key: "discussion_significance",
            label: "12. Significance/ value/ benefits of the prototype(s) or solution(s) are explained (0-4)"
          },
          {
            key: "conclusion_limitations",
            label: "13. Limitations and errors are stated. Further improvements / extensions / recommendations are suggested (0-4)"
          },
          {
            key: "conclusion_achieved",
            label: "14. States whether the goal was achieved or not. Conclusion is correct (0-4)"
          }
        ]
      },
      {
        title: "ORIGINALITY, CREATIVITY AND VALUE (12 marks)",
        description: "Ethics, knowledge depth, and original contribution",
        fields: [
          {
            key: "originality_ethics",
            label: "15. No ethics violations. No evidence of plagiarism of ideas, text, images or any part of the research (0-4)"
          },
          {
            key: "originality_knowledge",
            label: "16. Knowledgeable about the field of study beyond the scope of the school curriculum (0-4)"
          },
          {
            key: "originality_contribution",
            label: "17. Study that finds a new or improved solution or method or contributes to new knowledge (0-4)"
          }
        ]
      },
      {
        title: "WRITTEN PRESENTATION (8 marks)",
        description: "References and document quality",
        fields: [
          {
            key: "written_references",
            label: "18. References are correct in the text and in the References section (0-4)"
          },
          {
            key: "written_documents",
            label: "19. Research Plan, Project Report, and Abstract are well written, clear and logical (0-4)"
          }
        ]
      },
      {
        title: "POSTER/INTERVIEW ASSESSMENT (24 marks)",
        description: "Understanding, presentation skills, and research journey",
        fields: [
          {
            key: "poster_understanding",
            label: "20. Understands the concepts, theories and principles related to the study/project (0-4)"
          },
          {
            key: "poster_explanation",
            label: "21. Learner(s) can use the Poster to explain and discuss the findings / prototype / model / computer program (0-4)"
          },
          {
            key: "poster_answers",
            label: "22. Answers judges questions on the project content. Shows authenticity i.e. it is the learner(s) own work (0-4)"
          },
          {
            key: "poster_limitations",
            label: "23. Learner(s) can discuss limitations and explain importance of research in detail (0-4)"
          },
          {
            key: "poster_summary",
            label: "24. The Poster is a clear, logical summary of the research (0-4)"
          },
          {
            key: "poster_journal",
            label: "25. Journal shows the progression of the research journey (0-4)"
          }
        ]
      }
    ]
  },
  {
    type: "mathematics",
    criteriaOrder: [
      "introduction_background",
      "introduction_problem",
      "introduction_hypothesis",
      "method_data_collection",
      "method_variables",
      "method_concepts",
      "method_units_proof",
      "results_data_presentation",
      "results_data_analysis",
      "results_assumptions",
      "results_patterns",
      "results_significance",
      "conclusion_limitations",
      "conclusion_hypothesis",
      "originality_ethics",
      "originality_knowledge",
      "originality_contribution",
      "written_references",
      "written_documents",
      "poster_understanding",
      "poster_explanation",
      "poster_answers",
      "poster_limitations",
      "poster_summary",
      "poster_journal"
    ],
    sections: [
      {
        title: "INTRODUCTION (12 marks)",
        description: "Background, problem identification, and hypothesis formulation",
        fields: [
          {
            key: "introduction_background",
            label: "1. Key concepts are introduced, providing a good background to topic. Relevant literature are reviewed (0-4)"
          },
          {
            key: "introduction_problem",
            label: "2. Problem / issue / phenomena identified. Purpose / aim is clear (0-4)"
          },
          {
            key: "introduction_hypothesis",
            label: "3. Research Question stated. Hypothesis (if applicable) is testable/falsifiable and includes variables (0-4)"
          }
        ]
      },
      {
        title: "METHOD (16 marks)",
        description: "Data collection methods, variables, and mathematical techniques",
        fields: [
          {
            key: "method_data_collection",
            label: "4. Data collection method(s) are correct and appropriate for the study (0-4)"
          },
          {
            key: "method_variables",
            label: "5. Variables / functions / mathematical relationships are identified (0-4)"
          },
          {
            key: "method_concepts",
            label: "6. Mathematical and/or theoretical concepts/techniques/principles/tools are used correctly (0-4)"
          },
          {
            key: "method_units_proof",
            label: "7. Correct units / proof / factors / vectors used. Arguments are strong and logical (0-4)"
          }
        ]
      },
      {
        title: "RESULTS, DISCUSSION, CONCLUSION (28 marks)",
        description: "Data analysis, patterns identification, and conclusions",
        fields: [
          {
            key: "results_data_presentation",
            label: "8. Data presented appropriately and accurately (0-4)"
          },
          {
            key: "results_data_analysis",
            label: "9. Describes how the data was analysed. Describes any data transformations/numerical techniques used (0-4)"
          },
          {
            key: "results_assumptions",
            label: "10. Assumptions justified with theorems/ equations/ vectors/ arguments (0-4)"
          },
          {
            key: "results_patterns",
            label: "11. Patterns/trends/outliers are identified, interpreted and explained (0-4)"
          },
          {
            key: "results_significance",
            label: "12. Significance/value of the results explained (0-4)"
          },
          {
            key: "conclusion_limitations",
            label: "13. Limitations and errors are stated. Further improvements / extensions / recommendations are suggested (0-4)"
          },
          {
            key: "conclusion_hypothesis",
            label: "14. Hypothesis accepted or rejected. Conclusion is correct (0-4)"
          }
        ]
      },
      {
        title: "ORIGINALITY, CREATIVITY AND VALUE (12 marks)",
        description: "Ethics, knowledge depth, and original contribution",
        fields: [
          {
            key: "originality_ethics",
            label: "15. No ethics violations. No evidence of plagiarism of ideas, text, images or any part of the research (0-4)"
          },
          {
            key: "originality_knowledge",
            label: "16. Knowledgeable about the field of study beyond the scope of the school curriculum (0-4)"
          },
          {
            key: "originality_contribution",
            label: "17. Study that finds a new or improved solution or method or contributes to new knowledge (0-4)"
          }
        ]
      },
      {
        title: "WRITTEN PRESENTATION (8 marks)",
        description: "References and document quality",
        fields: [
          {
            key: "written_references",
            label: "18. References are correct in the text and in the References section (0-4)"
          },
          {
            key: "written_documents",
            label: "19. Research Plan, Project Report, and Abstract are well written, clear and logical (0-4)"
          }
        ]
      },
      {
        title: "POSTER/INTERVIEW ASSESSMENT (24 marks)",
        description: "Understanding, presentation skills, and research journey",
        fields: [
          {
            key: "poster_understanding",
            label: "20. Understands the concepts, theories and principles related to the study/project (0-4)"
          },
          {
            key: "poster_explanation",
            label: "21. Learner(s) can use the Poster to explain and discuss the findings (0-4)"
          },
          {
            key: "poster_answers",
            label: "22. Answers judges questions on the project content. Shows authenticity i.e. it is the learner(s) own work (0-4)"
          },
          {
            key: "poster_limitations",
            label: "23. Learner(s) can discuss limitations and explain importance of research in detail (0-4)"
          },
          {
            key: "poster_summary",
            label: "24. The Poster is a clear, logical summary of the research (0-4)"
          },
          {
            key: "poster_journal",
            label: "25. Journal clearly shows the research journey (0-4)"
          }
        ]
      }
    ]
  },
  {
    type: "scientific-investigations",
    criteriaOrder: [
      "introduction_background",
      "introduction_problem",
      "introduction_hypothesis",
      "method_variables",
      "method_materials",
      "method_procedure",
      "method_trials",
      "results_data_representation",
      "results_data_analysis",
      "results_variables_discussion",
      "results_discussion_aligned",
      "results_literature_comparison",
      "conclusion_limitations",
      "conclusion_hypothesis",
      "originality_ethics",
      "originality_knowledge",
      "originality_contribution",
      "written_references",
      "written_documents",
      "poster_understanding",
      "poster_explanation",
      "poster_answers",
      "poster_limitations",
      "poster_summary",
      "poster_journal"
    ],
    sections: [
      {
        title: "INTRODUCTION (12 marks)",
        description: "Background, problem identification, and hypothesis formulation",
        fields: [
          {
            key: "introduction_background",
            label: "1. Key concepts are introduced, providing a good background to topic. Relevant literature are reviewed (0-4)"
          },
          {
            key: "introduction_problem",
            label: "2. Problem / issue / phenomena identified. Purpose / aim is clear. Research Question stated (0-4)"
          },
          {
            key: "introduction_hypothesis",
            label: "3. Hypothesis is testable/falsifiable and includes variables (0-4)"
          }
        ]
      },
      {
        title: "METHOD (16 marks)",
        description: "Variables, materials, procedures, and experimental design",
        fields: [
          {
            key: "method_variables",
            label: "4. Treatments / variables measured (independent, dependent, control/fixed) are correctly stated (0-4)"
          },
          {
            key: "method_materials",
            label: "5. Materials / apparatus are listed or are evident in the method section (0-4)"
          },
          {
            key: "method_procedure",
            label: "6. Procedure: clearly indicates how data was collected. Correct units / measures / factors / description e.g. of organisms, are evident (0-4)"
          },
          {
            key: "method_trials",
            label: "7. Number of trials / tests / replications adequate (0-4)"
          }
        ]
      },
      {
        title: "RESULTS, DISCUSSION, CONCLUSION (28 marks)",
        description: "Data presentation, analysis, discussion, and conclusions",
        fields: [
          {
            key: "results_data_representation",
            label: "8. Accurate data represented appropriately in tables / graphs / diagrams / descriptions / lists (0-4)"
          },
          {
            key: "results_data_analysis",
            label: "9. Data analysed correctly (0-4)"
          },
          {
            key: "results_variables_discussion",
            label: "10. Variables measured are discussed. Patterns / correlations / outliers in the results are identified and discussed (0-4)"
          },
          {
            key: "results_discussion_aligned",
            label: "11. Discussion aligned with aim / purpose. Significance/value of the results explained (0-4)"
          },
          {
            key: "results_literature_comparison",
            label: "12. Cites literature and compares findings to other studies (0-4)"
          },
          {
            key: "conclusion_limitations",
            label: "13. Limitations and errors are stated. Further improvements / extensions / recommendations are suggested (0-4)"
          },
          {
            key: "conclusion_hypothesis",
            label: "14. Hypothesis accepted or rejected. Conclusion is correct (0-4)"
          }
        ]
      },
      {
        title: "ORIGINALITY, CREATIVITY AND VALUE (12 marks)",
        description: "Ethics, knowledge depth, and original contribution",
        fields: [
          {
            key: "originality_ethics",
            label: "15. No ethics violations. No evidence of plagiarism of ideas, text, images or any part of the research (0-4)"
          },
          {
            key: "originality_knowledge",
            label: "16. Knowledgeable about the field of study beyond the scope of the school curriculum (0-4)"
          },
          {
            key: "originality_contribution",
            label: "17. Study that finds a new or improved solution or method or contributes to new knowledge (0-4)"
          }
        ]
      },
      {
        title: "WRITTEN PRESENTATION (8 marks)",
        description: "References and document quality",
        fields: [
          {
            key: "written_references",
            label: "18. References are correct in the text and in the References section (0-4)"
          },
          {
            key: "written_documents",
            label: "19. Research Plan, Project Report, and Abstract are well written, clear and logical (0-4)"
          }
        ]
      },
      {
        title: "POSTER/INTERVIEW ASSESSMENT (24 marks)",
        description: "Understanding, presentation skills, and research journey",
        fields: [
          {
            key: "poster_understanding",
            label: "20. Understands the concepts, theories and principles related to the study/project (0-4)"
          },
          {
            key: "poster_explanation",
            label: "21. Learner(s) can use the Poster to explain and discuss the findings (0-4)"
          },
          {
            key: "poster_answers",
            label: "22. Answers judges questions on the project content. Shows authenticity i.e. it is the learner(s) own work (0-4)"
          },
          {
            key: "poster_limitations",
            label: "23. Learner(s) can discuss limitations and explain importance of research in detail (0-4)"
          },
          {
            key: "poster_summary",
            label: "24. The Poster is a clear, logical summary of the research (0-4)"
          },
          {
            key: "poster_journal",
            label: "25. Journal shows the progression of the research journey (0-4)"
          }
        ]
      }
    ]
  },
  {
    type: "social-science",
    criteriaOrder: [
      "introduction_background",
      "introduction_problem",
      "introduction_hypothesis",
      "method_methodology",
      "method_sample_size",
      "method_data_collection",
      "method_ethics",
      "results_data_representation",
      "results_data_analysis",
      "results_patterns",
      "results_discussion_aligned",
      "results_literature_comparison",
      "conclusion_limitations",
      "conclusion_research_question",
      "originality_ethics",
      "originality_knowledge",
      "originality_contribution",
      "written_references",
      "written_documents",
      "poster_understanding",
      "poster_explanation",
      "poster_answers",
      "poster_limitations",
      "poster_summary",
      "poster_journal"
    ],
    sections: [
      {
        title: "INTRODUCTION (12 marks)",
        description: "Background, problem identification, and research question",
        fields: [
          {
            key: "introduction_background",
            label: "1. Key concepts are introduced, providing a good background to topic. Relevant literature are reviewed (0-4)"
          },
          {
            key: "introduction_problem",
            label: "2. Problem / issue / phenomena identified. Purpose / aim is clear (0-4)"
          },
          {
            key: "introduction_hypothesis",
            label: "3. Research Question stated. Hypothesis (if applicable) is testable/falsifiable and includes variables (0-4)"
          }
        ]
      },
      {
        title: "METHOD (16 marks)",
        description: "Research methodology, sampling, data collection, and ethics",
        fields: [
          {
            key: "method_methodology",
            label: "4. Correct Methodology: Quantitative (experiments, tests) and/or Qualitative (interviews, surveys). Items/questions in data collection instruments/procedures are correct & relevant (0-4)"
          },
          {
            key: "method_sample_size",
            label: "5. Sample size is appropriate and adequate for the study (0-4)"
          },
          {
            key: "method_data_collection",
            label: "6. Data collection instruments/sources/procedures are appropriate and justified: observations/interviews/questionnaires/pre-tests & post-tests/psychometric tests/ use of existing data (0-4)"
          },
          {
            key: "method_ethics",
            label: "7. Ethics: Informed Consent from participants; permission from principal/ parents/ guardians obtained. Confidentiality: Identities of participants: names, photographs & personal details are obscured & not revealed (0-4)"
          }
        ]
      },
      {
        title: "RESULTS, DISCUSSION, CONCLUSION (28 marks)",
        description: "Data presentation, analysis, discussion, and conclusions",
        fields: [
          {
            key: "results_data_representation",
            label: "8. Data from Questionnaires/Survey/Interviews/Tests represented appropriately & captured accurately (0-4)"
          },
          {
            key: "results_data_analysis",
            label: "9. Data analysis, including any statistical analysis are correct and accurate (0-4)"
          },
          {
            key: "results_patterns",
            label: "10. Patterns / correlations / outliers in the results are identified and discussed (0-4)"
          },
          {
            key: "results_discussion_aligned",
            label: "11. Discussion aligned with aim / purpose. Discussion of results is substantial and logical. Significance/value of the results explained (0-4)"
          },
          {
            key: "results_literature_comparison",
            label: "12. Cites literature and compares findings to other studies (0-4)"
          },
          {
            key: "conclusion_limitations",
            label: "13. Limitations and errors are stated. Further improvements / extensions / recommendations are suggested (0-4)"
          },
          {
            key: "conclusion_research_question",
            label: "14. Research Question answered/Hypothesis accepted or rejected. Conclusion is correct (0-4)"
          }
        ]
      },
      {
        title: "ORIGINALITY, CREATIVITY AND VALUE (12 marks)",
        description: "Ethics, knowledge depth, and original contribution",
        fields: [
          {
            key: "originality_ethics",
            label: "15. No ethics violations. No evidence of plagiarism of ideas, text, images or any part of the research (0-4)"
          },
          {
            key: "originality_knowledge",
            label: "16. Knowledgeable about the field of study beyond the scope of the school curriculum (0-4)"
          },
          {
            key: "originality_contribution",
            label: "17. Study that finds a new or improved solution or method or contributes to new knowledge (0-4)"
          }
        ]
      },
      {
        title: "WRITTEN PRESENTATION (8 marks)",
        description: "References and document quality",
        fields: [
          {
            key: "written_references",
            label: "18. References are correct in the text and in the References section (0-4)"
          },
          {
            key: "written_documents",
            label: "19. Research Plan, Project Report, and Abstract are well written, clear and logical (0-4)"
          }
        ]
      },
      {
        title: "POSTER/INTERVIEW ASSESSMENT (24 marks)",
        description: "Understanding, presentation skills, and research journey",
        fields: [
          {
            key: "poster_understanding",
            label: "20. Understands the concepts, theories and principles related to the study/project (0-4)"
          },
          {
            key: "poster_explanation",
            label: "21. Learner(s) can use the Poster to explain and discuss the findings (0-4)"
          },
          {
            key: "poster_answers",
            label: "22. Answers judges questions on the project content. Shows authenticity i.e. it is the learner(s) own work (0-4)"
          },
          {
            key: "poster_limitations",
            label: "23. Learner(s) can discuss limitations and explain importance of research in detail (0-4)"
          },
          {
            key: "poster_summary",
            label: "24. The Poster is a clear, logical summary of the research (0-4)"
          },
          {
            key: "poster_journal",
            label: "25. Journal shows the progresssion of the research journey (0-4)"
          }
        ]
      }
    ]
  }
];

function getMarksheetType(type) {
  return MARKSHEET_TYPES.find((t) => t.type === type) || MARKSHEET_TYPES[0];
}

const formatTime = (seconds) => { 
  // Ensure the timer doesn't go below zero
  const clampedSeconds = Math.max(0, seconds);
  const mins = Math.floor(clampedSeconds / 60);
  const secs = clampedSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const MarkingScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const projectId = params.projectId;
  const marksheetTypeParam = params.type;
  const judgeId = params.judgeId;
  const marksheetId = params.marksheetId;
  const isNavigatingToEthics = useRef(false);

  const [marks, setMarks] = useState({});
  const [ethicsMarksheetId, setEthicsMarksheetId] = useState(null);
  const [judged, setJudged] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);
  const [learnerDetails, setLearnerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  const { fetchMarksheets } = useMarksheets();
  const {
    timeLeft,
    setTimeLeft,
    timeControlButtonClicks,
    setTimeControlButtonClicks,
    timerActive,
    setTimerActive,
  } = useTimer();

  useFocusEffect(
    useCallback(() => {
      setTimerActive(true);
      isNavigatingToEthics.current = false;
      return () => {
        if (!isNavigatingToEthics.current) {
          setTimerActive(false);
        }
      };
    }, [])
  );

  // Animation values for floating circles
  const pulseAnim1 = useState(new Animated.Value(1))[0];
  const pulseAnim2 = useState(new Animated.Value(1))[0];
  const pulseAnim3 = useState(new Animated.Value(1))[0];
  const bounceAnim1 = useState(new Animated.Value(0))[0];
  const bounceAnim2 = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Reset timer when project changes
    setTimeLeft(15 * 60);
    setTimeControlButtonClicks(0);

    async function fetchProjectAndLearner() {
      if (!projectId) {
        Alert.alert("Error", "Project ID is missing.");
        setLoading(false);
        return;
      }
      try {
        await AsyncStorage.setItem("currentProjectId", projectId);
        // Fetch project details
        const projectRes = await axios.get(`${API_URL}/projects/${projectId}`);
        const projectData = projectRes.data;

        setProjectDetails(projectData);
        setEthicsMarksheetId(params.ethicsMarksheetId || projectData.ethicsmarksheetid || null );

        // Fetch learner details (assuming endpoint exists)
        if (projectData.learnerid) {
          const learnerRes = await axios.get(
            `${API_URL}/learners/${projectData.learnerid}`
          );
          setLearnerDetails(learnerRes.data);
        }
        const marksheetRes = await axios.get(
          `${API_URL}/marksheets/${marksheetId}`
        );

        const marksheetData = marksheetRes.data; // <-- define marksheetData first

        const type =
          projectData?.assignedmarksheettype ||
          marksheetTypeParam;
        const marksheetConfig = getMarksheetType(type);
        console.log("Using marksheet type:", type, marksheetConfig);

        marksheetData.type = type;
       
       // const marksheetData = marksheetRes.data;
        if (marksheetData && marksheetData.ethicsmarksheetid) {
          setEthicsMarksheetId(marksheetData.ethicsmarksheetid);
        }
       

        // Pre-fill marks if marksheet has a total score > 0
        if (marksheetData && marksheetData.totalscore > 0) {
          setJudged(true);
          const newMarks = {};
          marksheetConfig.criteriaOrder.forEach((key, index) => {
            const sectionKey = `section${index + 1}`;
            const value = marksheetData[sectionKey];
            if (value !== null && value !== undefined) {
              newMarks[key] = String(value);
            }
          });
          setMarks(newMarks);
        } else {
          setJudged(false);
          // If total score is 0, ensure the fields are empty
          setMarks({});
        }
      } catch (error) {
        console.error("Error loading project/learner details:", error);
        Alert.alert(
          "Error",
          error.message || "Failed to load project/learner details."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProjectAndLearner();
  }, [projectId]);

  // UseEffect for the bouncing circles animation
  useEffect(() => {
    const bounce = (animValue) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    const pulse = (animValue) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 0.4,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    bounce(bounceAnim1);
    bounce(bounceAnim2);
    pulse(pulseAnim1);
    pulse(pulseAnim2);
    pulse(pulseAnim3);
  }, []);

  const handleInputChange = (field, value) => {
    // Ensure input is a single digit from 0 to 4
    const numericValue = value.replace(/[^0-4]/g, "");
    setMarks((prev) => ({ ...prev, [field]: numericValue }));
  };

  const calculateTotalScore = () => {
    return Object.values(marks)
      .map((val) => parseInt(val || "0"))
      .reduce((a, b) => a + b, 0);
  };

  // Map marks to section1-section25 (always 25 sections)
  const mapCriteriaToSections = () => {
    const sections = {};
    const marksheetConfig = getMarksheetType(marksheetType);

    if (!marksheetConfig) {
      // Return 25 empty sections if config is missing
      for (let i = 1; i <= 25; i++) {
        sections[`section${i}`] = "0";
      }
      return sections;
    }

    const criteria = marksheetConfig.criteriaOrder;

    // Map each criteria to its corresponding section
    for (let i = 0; i < 25; i++) {
      const criteriaKey = criteria[i];
      if (criteriaKey && marks[criteriaKey] != null) {
        sections[`section${i + 1}`] = String(marks[criteriaKey]);
      } else {
        sections[`section${i + 1}`] = "0";
      }
    }

    console.log("Mapped sections:", sections);
    return sections;
  };

  const handleNextToEthics = () => {
    if (!ethicsMarksheetId) {
      Alert.alert("Error", "Ethics Marksheet ID is missing.");
      return;
    }

    isNavigatingToEthics.current = true;
    const sectionsData = mapCriteriaToSections();
    const regularMarksheet = {
      projectId,
      judgeId,
      ethicsMarksheetId,
      totalScore: calculateTotalScore(),
      marksheetType: marksheetType,
      ...mapCriteriaToSections(),
    };

    router.push({
      pathname: "/ethics-marksheet",
      params: {
        projectId,
        learnerName: learnerDetails?.name || "N/A",
        learnerGrade: learnerDetails?.grade || "N/A",
        projectTitle: projectDetails?.projectname || "N/A",
        projectNumber: projectDetails?.standnumber || "N/A",
        ethicsMarksheetId: ethicsMarksheetId,
        marksheetData: JSON.stringify(regularMarksheet),
        marksheetId: marksheetId,
      },
    });
  };

  // Toggle section collapse state
  const toggleSection = (title) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleTimeControlClick = () => {
    const newClickCount = timeControlButtonClicks + 1;
    setTimeControlButtonClicks(newClickCount);
    if (newClickCount === 1) {
      setTimeLeft(5 * 60 + 10);
    } else if (newClickCount === 2) {
      setTimeLeft(1 * 60 + 10);
    } else if (newClickCount === 3) {
      setTimeLeft(10);
    }
  };

  const renderInputField = (field) => {
    return (
      <View key={field.key} style={styles.inputGroup}>
        <Text style={styles.criteria}>{field.label}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={1}
          value={marks[field.key] || ""}
          onChangeText={(value) => handleInputChange(field.key, value)}
          placeholder="0-4"
          placeholderTextColor="#6C7A89"
        />
      </View>
    );
  };

  // Function to render the floating circles
  const FloatingCircles = () => (
    <View style={styles.floatingContainer} pointerEvents="none">
      <Animated.View
        style={[styles.circle, styles.circle1, { opacity: pulseAnim1 }]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle2,
          { transform: [{ translateY: bounceAnim1 }] },
        ]}
      />
      <Animated.View
        style={[styles.circle, styles.circle3, { opacity: pulseAnim2 }]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle4,
          { transform: [{ translateY: bounceAnim2 }] },
        ]}
      />
      <Animated.View
        style={[styles.circle, styles.circle5, { opacity: pulseAnim3 }]}
      />
    </View>
  );

  const formatTime = (seconds) => {
    const clampedSeconds = Math.max(0, seconds);
    const mins = Math.floor(clampedSeconds / 60);
    const secs = clampedSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Use assigned marksheet type from project details if available
  const marksheetType =
    marksheetTypeParam ||
    projectDetails?.assignedmarksheettype ||
    "engineering";
  const marksheetConfig = getMarksheetType(marksheetType);

  if (loading) {
    return (
      <ImageBackground source={bgImage} style={styles.backgroundImage} resizeMode="cover">
        <StatusBar barStyle="light-content" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading project and learner details...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage} resizeMode="cover">
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <LinearGradient
            colors={["#E3F2FD", "#E8EAF6"]}
            style={styles.cardHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.screenTitle}>Marking Sheet</Text>
            
            {/* Timer Container in Header */}
            <View style={styles.timerHeaderContainer}>
              <View style={styles.timerDisplay}>
                <Ionicons name="time-outline" size={16} color="#4F46E5" />
                <Text style={styles.timerLabel}>Time Left:</Text>
                <Text style={[styles.timerText, { color: timeLeft < 0 ? "#EF4444" : "#10B981" }]}>
                  {formatTime(timeLeft)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.timeControlButton}
                onPress={handleTimeControlClick}
              >
                <Text style={styles.timeControlButtonText}>Adjust Time</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.cardBody}>
            {/* Project Information Card */}
            <View style={styles.projectInfoCard}>
              <Text style={styles.infoTitle}>Project Information</Text>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={16} color="#4F46E5" />
                <Text style={styles.infoText}>
                  Learner: {learnerDetails?.name || "N/A"} {learnerDetails?.surname || ""}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="school-outline" size={16} color="#9CA3AF" />
                <Text style={styles.infoText}>
                  School: {learnerDetails?.schoolname || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="library-outline" size={16} color="#9CA3AF" />
                <Text style={styles.infoText}>
                  Grade: {learnerDetails?.grade || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="bulb-outline" size={16} color="#4F46E5" />
                <Text style={styles.infoText}>
                  Project: {projectDetails?.projectname || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="barcode-outline" size={16} color="#9CA3AF" />
                <Text style={styles.infoText}>
                  Stand: {projectDetails?.standnumber || "N/A"}
                </Text>
              </View>
            </View>

            {/* Marking Sections */}
            {marksheetConfig?.sections?.map((section, sectionIndex) => (
              <View key={section.title} style={[
                styles.sectionContainer,
                sectionIndex % 2 === 0 ? styles.sectionEven : styles.sectionOdd
              ]}>
                <TouchableOpacity
                  onPress={() => toggleSection(section.title)}
                  style={styles.collapsibleHeader}
                >
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    {section.description && (
                      <Text style={styles.sectionDescription}>{section.description}</Text>
                    )}
                  </View>
                  <Ionicons
                    name={
                      collapsedSections[section.title]
                        ? "chevron-down-outline"
                        : "chevron-up-outline"
                    }
                    size={20}
                    color="#4F46E5"
                  />
                </TouchableOpacity>
                
                {!collapsedSections[section.title] && (
                  <View style={styles.sectionContent}>
                    {section.fields.map((field) => renderInputField(field))}
                  </View>
                )}
              </View>
            ))}

            {/* Total Score Display */}
            <View style={styles.totalScoreCard}>
              <View style={styles.totalScoreRow}>
                <Ionicons name="calculator-outline" size={24} color="#4F46E5" />
                <Text style={styles.totalScoreLabel}>Total Score:</Text>
                <Text style={styles.totalScoreValue}>{calculateTotalScore()}</Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleNextToEthics}
              disabled={submitting}
            >
              {submitting ? (
                <View style={styles.buttonLoadingContent}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.buttonText}>Submitting...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Proceed to Ethics</Text>
                  <Ionicons name="arrow-forward-outline" size={20} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <TouchableOpacity
        style={styles.floatingBackButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      {/*
      <TouchableOpacity
        style={styles.floatingLocationButton}
        onPress={() => router.push({ pathname: '/location', params: { projectId } })}
      >
        <Ionicons name="location-outline" size={24} color="white" />
      </TouchableOpacity>*/}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 100,
  },
  cardHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 16,
    textAlign: "center",
  },
  timerHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#A3B3C8",
  },
  timerDisplay: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  timerLabel: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 4,
    marginRight: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeControlButton: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  timeControlButtonText: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "600",
  },
  cardBody: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 16,
  },
  projectInfoCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionEven: {
    backgroundColor: "#F9FAFB",
  },
  sectionOdd: {
    backgroundColor: "#FFFFFF",
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
  },
  sectionTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  criteria: {
    fontSize: 14,
    flex: 1,
    marginRight: 12,
    color: "#374151",
    fontWeight: "500",
  },
  input: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
    fontWeight: "600",
  },
  totalScoreCard: {
    backgroundColor: "#EBF5FF",
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4F46E5",
  },
  totalScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  totalScoreLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
    marginRight: 12,
  },
  totalScoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F46E5",
  },
  submitButton: {
    backgroundColor: "#4F46E5",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLoadingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  floatingBackButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingLocationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4F46E5",
    textAlign: "center",
  },
  // Floating circles styles
  floatingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  circle: { 
    position: "absolute", 
    borderRadius: 999,
    backgroundColor: "#6bb5ffff",
  },
  circle1: {
    top: 80,
    left: 40,
    width: 80,
    height: 80,
  },
  circle2: {
    top: 160,
    right: 80,
    width: 64,
    height: 64,
    opacity: 0.25,
  },
  circle3: {
    bottom: 160,
    left: 80,
    width: 48,
    height: 48,
  },
  circle4: {
    top: 240,
    left: width / 3,
    width: 32,
    height: 32,
    opacity: 0.3,
  },
  circle5: {
    bottom: 80,
    right: width / 3,
    width: 56,
    height: 56,
  },
});

export default MarkingScreen;