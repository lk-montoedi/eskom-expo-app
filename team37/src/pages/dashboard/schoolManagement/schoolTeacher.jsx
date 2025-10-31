import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Input,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function SchoolTeacher() {
    const [learners, setLearners] = useState([]);
    const [filteredLearners, setFilteredLearners] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedLearner, setSelectedLearner] = useState(null);
    const [teacherSchool, setTeacherSchool] = useState("");
    const navigate = useNavigate();

    // Fetch learners on component mount
    useEffect(() => {
        fetchLearners();
       
    },[]);

    // Filter learners based on search term
    useEffect(() => {
        if (searchTerm === "") {
            setFilteredLearners(learners);
        } else {
            const filtered = learners.filter(learner => 
                learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                learner.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                learner.userid.toString().includes(searchTerm) ||
                learner.grade.toString().includes(searchTerm)
            );
            setFilteredLearners(filtered);
        }
    }, [searchTerm, learners]);

    const fetchLearners = async () => {
        const userId = localStorage.getItem("userId");
        try {
            setLoading(true);
            const response = await fetch(`/api/learners/getLearnersFromSchool/${userId}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setLearners(data.learners || []);
                setFilteredLearners(data.learners || []);
                setTeacherSchool(data.schoolName || "Your School");
            } else {
                const errorData = await response.json();
                console.log("teacher",userId);
                console.error("Failed to fetch learners:", errorData);
            }
        } catch (error) {
            console.error("Error fetching learners:", error);
        } finally {
            setLoading(false);
        }
    };
 
        
    const handleAddLearner = () => {
        navigate('/teacher/learner/register');       
    };

    const handleLearnerClick = (learner) => {
        localStorage.setItem("learnerId", learner.userid);
        navigate("/teacher/learner/view", { state: { learner } });
    }; 

    const displayedLearners = showAll ? filteredLearners : filteredLearners.slice(0, 10);

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card className="bg-white/80 backdrop-blur-sm border border-indigo-200/40 rounded-2xl shadow-xl shadow-indigo-100/30">
                <CardHeader className="mb-0 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl shadow-md">
                    <div className="flex flex-row items-center gap-8">
                        <div className="flex-grow">
                            <Typography variant="h6" className="mb-1 text-white font-bold flex items-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                </svg>
                                Learners in {teacherSchool}
                            </Typography>
                            <Typography variant="small" className="font-normal text-blue-100">
                                View all learners in your school
                            </Typography>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="flex-grow max-w-md">
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <Input
                                    type="text"
                                    placeholder="Search by Name, Learner ID, or Grade..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 bg-white border-indigo-200 focus:border-indigo-400 rounded-xl shadow-sm text-gray-700"
                                    color="indigo"
                                />
                            </div>
                        </div>
                        
                        <Button
                            onClick={handleAddLearner}
                            className="ml-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white rounded-xl font-semibold shadow-xs shadow-green-300 transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Learner
                        </Button>
                    </div>
                </CardHeader>

                <CardBody className="overflow-x-auto px-0 pt-0 pb-8 bg-white rounded-b-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-500 mb-6"></div>
                            <Typography className="text-indigo-600 text-lg font-semibold">
                                Loading learners...
                            </Typography>
                        </div>
                    ) : (
                        <>
                            <div className="w-full min-w-[350px] md:min-w-[700px]">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-indigo-100">
                                            {["Learner ID", "First Name", "Last Name", "Grade", "Gender", "Actions"].map((el) => (
                                                <th
                                                    key={el}
                                                    className="py-6 px-6 text-left text-indigo-700 text-sm font-bold uppercase tracking-wide"
                                                >
                                                    {el}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedLearners.length > 0 ? (
                                            displayedLearners.map((learner, index) => (
                                                <tr
                                                    key={learner.userid}
                                                    className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 cursor-pointer transition-all duration-200 border-b border-indigo-50 ${
                                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                                    }`}
                                                    onClick={() => handleLearnerClick(learner)}
                                                >
                                                    <td className="py-6 px-6">
                                                        <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                                                            {learner.userid}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 px-6">
                                                        <Typography className="text-gray-700 font-semibold">
                                                            {learner.name}
                                                        </Typography>
                                                    </td>
                                                    <td className="py-6 px-6">
                                                        <Typography className="text-gray-700 font-semibold">
                                                            {learner.surname}
                                                        </Typography>
                                                    </td>
                                                    <td className="py-6 px-6">
                                                        <Typography className="text-gray-600 font-medium">
                                                            Grade {learner.grade || "N/A"}
                                                        </Typography>
                                                    </td>
                                                  {/*  <td className="py-3 px-5 border-b border-blue-200">
                                                        <Typography className="text-xs font-normal text-gray-600">
                                                            {learner.age || "N/A"}
                                                        </Typography>
                                                    </td>*/}
                                                    <td className="py-6 px-6">
                                                        <Typography className="text-gray-600 font-medium">
                                                            {learner.gender || "N/A"}
                                                        </Typography>
                                                    </td>
                                                    <td className="py-6 px-6">
                                                        <Button
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleLearnerClick(learner);
                                                            }}
                                                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4 py-2"
                                                        >
                                                            View
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-20">
                                                    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-8 rounded-3xl max-w-md mx-auto">
                                                        <svg className="w-16 h-16 text-indigo-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                        </svg>
                                                        <Typography className="text-indigo-600 text-lg font-semibold">
                                                            No learners found
                                                        </Typography>
                                                        <Typography className="text-indigo-500 text-sm mt-2">
                                                            Try adjusting your search criteria
                                                        </Typography>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* View All Button */}
                            {filteredLearners.length > 10 && (
                                <div className="flex justify-center mt-8 px-8">
                                    <Button
                                        onClick={() => setShowAll(!showAll)}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        {showAll ? "Show Less" : `View All (${filteredLearners.length} learners)`}
                                    </Button>
                                </div>
                            )}

                            {/* Summary Stats */}
                            {learners.length > 0 && (
                                <div className="mt-8 mx-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-indigo-200/40">
                                            <Typography variant="h4" className="font-bold text-indigo-600">
                                                {learners.length}
                                            </Typography>
                                            <Typography variant="small" className="font-medium text-gray-600 mt-1">
                                                Total Learners
                                            </Typography>
                                        </div>
                                        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-indigo-200/40">
                                            <Typography variant="h4" className="font-bold text-indigo-600">
                                                {[...new Set(learners.map(l => l.grade))].length}
                                            </Typography>
                                            <Typography variant="small" className="font-medium text-gray-600 mt-1">
                                                Total Grade Levels
                                            </Typography>
                                        </div>
                                        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-indigo-200/40">
                                            <Typography variant="h4" className="font-bold text-indigo-600">
                                                {filteredLearners.length}
                                            </Typography>
                                            <Typography variant="small" className="font-medium text-gray-600 mt-1">
                                                Filtered Results
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardBody>
            </Card>

            {/* Learner Details Modal */}
            {selectedLearner && (
                <Dialog 
                    open={!!selectedLearner} 
                    handler={() => setSelectedLearner(null)} 
                    className="bg-white/90 backdrop-blur-sm border border-indigo-200/40 rounded-2xl shadow-2xl shadow-indigo-100/40"
                >
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl border-b border-indigo-200">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Learner Details
                        </div>
                    </DialogHeader>
                    <DialogBody className="bg-white text-gray-700 p-6">
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
                                <Typography variant="small" className="text-indigo-700 font-bold mb-1">Learner ID:</Typography>
                                <Typography className="text-gray-700 font-semibold text-lg">{selectedLearner.learnerid}</Typography>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                                    <Typography variant="small" className="text-blue-700 font-bold mb-1">First Name:</Typography>
                                    <Typography className="text-gray-700 font-medium">{selectedLearner.name}</Typography>
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
                                    <Typography variant="small" className="text-indigo-700 font-bold mb-1">Last Name:</Typography>
                                    <Typography className="text-gray-700 font-medium">{selectedLearner.surname}</Typography>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border-l-4 border-blue-400">
                                    <Typography variant="small" className="text-blue-700 font-bold mb-1">Grade:</Typography>
                                    <Typography className="text-gray-700 font-medium">Grade {selectedLearner.grade || "N/A"}</Typography>
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-indigo-400">
                                    <Typography variant="small" className="text-indigo-700 font-bold mb-1">Age:</Typography>
                                    <Typography className="text-gray-700 font-medium">{selectedLearner.age || "N/A"}</Typography>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
                                <Typography variant="small" className="text-indigo-700 font-bold mb-1">Gender:</Typography>
                                <Typography className="text-gray-700 font-medium">{selectedLearner.gender || "N/A"}</Typography>
                            </div>
                            {selectedLearner.dateofbirth && (
                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                                    <Typography variant="small" className="text-blue-700 font-bold mb-1">Date of Birth:</Typography>
                                    <Typography className="text-gray-700 font-medium">
                                        {new Date(selectedLearner.dateofbirth).toLocaleDateString()}
                                    </Typography>
                                </div>
                            )}
                            {selectedLearner.email && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
                                    <Typography variant="small" className="text-indigo-700 font-bold mb-1">Email:</Typography>
                                    <Typography className="text-gray-700 font-medium">{selectedLearner.email}</Typography>
                                </div>
                            )}
                        </div>
                    </DialogBody>
                    <DialogFooter className="bg-gradient-to-r from-gray-50 to-indigo-50 border-t border-indigo-200 rounded-b-2xl">
                        <Button
                            variant="text"
                            onClick={() => setSelectedLearner(null)}
                            className="mr-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-xl transition-colors duration-200"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}
        </div>
    );
}

export default SchoolTeacher;