import { sql } from "../config/db.js";
import { supabase } from "../config/supabaseClient.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.time("login");

    // Fetch the user by email
    const result = await sql`
            SELECT userId, name, surname, email, password, role
             FROM users WHERE email = ${email}
        `;
    console.timeLog("login", "fetched user from DB");

    if (result.length === 0) {
      console.timeEnd("login");
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];

    // Verify the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.timeEnd("login");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return the user data (excluding the password for security)
    const { password: _, ...userWithoutPassword } = user;

    // STEP 5: Add signed URLs for judges
    if (user.role.toLowerCase() === "judge") {
      const judgeResult = await sql`
                SELECT identityDocument, proofCertificate FROM judges WHERE userId = ${user.userid}
            `;

      if (judgeResult.length > 0) {
        const judge = judgeResult[0];

        if (judge.identitydocument) {
          const { data } = await supabase.storage
            .from("documents")
            .createSignedUrl(judge.identitydocument, 60 * 60); // valid for 1 hour

          userWithoutPassword.identityDocumentUrl = data?.signedUrl || null;
        }

        if (judge.proofcertificate) {
          const { data } = await supabase.storage
            .from("documents")
            .createSignedUrl(judge.proofcertificate, 60 * 60);

          userWithoutPassword.proofCertificateUrl = data?.signedUrl || null;
        }
      }
    }

    console.timeEnd("login");
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.timeEnd("login");
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    console.time("get-user-profile");
    // Fetch all user details by joining the relevant tables
    const result = await sql`
      SELECT
        u.name,
        u.surname,
        u.email,
        u.firstContact,
        u.secondContact,
        u.profilePicture,
        u.province,
        u.region,
        u.race,
        u.gender,
        u.birthDate AS dateOfBirth,
        u.Role AS role,
        l.grade,
        l.disability,
        l.disabilityInfo,
        s.schoolName,
        s.district
      FROM users AS u
      LEFT JOIN learners AS l ON u.userId = l.userId
      LEFT JOIN schools AS s ON l.schoolId = s.schoolId
      WHERE u.userId = ${userId}
    `;

    console.timeLog("get-user-profile", "fetched user profile from DB");

    if (result.length === 0) {
      console.timeEnd("get-user-profile");
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0]; // Get the user data
    console.timeEnd("get-user-profile");
    res
      .status(200)
      .json({ message: "Profile fetched successfully", profile: user });
  } catch (error) {
    console.timeEnd("get-user-profile");
    console.error("Get User Profile Error:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

export const getJudgeDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await sql`
      SELECT yearsJudged, firstCategory, secondCategory, numEventsJudged
      FROM judges 
      WHERE userId = ${userId}
    `;

    if (response.length === 0) {
      return res.status(404).json({ message: "Judge is not found." });
    }

    res.status(200).json({
      message: "Judge successfully found !!",
      judgeDetails: response[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Judge details" });
  }
};

// The function updates the user's profile information in the database
export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const {
    name,
    surname,
    email,
    firstContact,
    secondContact,
    province,
    region,
  } = req.body;
  try {
    console.time("update-user-profile");

    // Update the user's basic information in the users table
    await sql`
      UPDATE users SET
        name = COALESCE(${name}, name),
        surname = COALESCE(${surname}, surname),      
        email = COALESCE(${email}, email),
        firstContact = COALESCE(${firstContact}, firstContact),
        secondContact = COALESCE(${secondContact}, secondContact), 
        province = COALESCE(${province}, province),
        region = COALESCE(${region}, region)   
      WHERE userId = ${userId}              
    `;
    console.timeEnd("update-user-profile");
    res.status(200).json({ message: "User profile updated successfully" }); // Return success message
  } catch (error) {
    console.error("Error updating user profile:", error); // Log any error during update
    res.status(500).json({ message: "Error updating user profile" }); // Return server error
  }
};

// The function updatedets the user's password.
export const updateUserPassword = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;
  try {
    console.time("update-user-password");
    // Fetch the user by userId
    const result = await sql` 
      SELECT userId, password FROM users WHERE userId = ${userId}
    `;
    console.timeLog("update-user-password", "fetched user from DB");
    if (result.length === 0) {
      console.timeEnd("update-user-password");
      return res.status(404).json({ message: "User not found" });
    }
    const user = result[0];
    // Verify the current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      console.timeEnd("update-user-password");
      return res.status(401).json({ message: "Invalid current password" });
    }
    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    console.timeLog("update-user-password", "hashed new password");

    // Update the user's password in the database
    await sql`
      UPDATE users SET  
        password = ${hashedNewPassword}
      WHERE userId = ${userId}
    `;
    console.timeEnd("update-user-password");
    res.status(200).json({ message: "Password updated successfully" }); // Return success message
  } catch (error) {
    console.timeEnd("update-user-password");
    console.error("Error updating user password:", error); // Log any error during update
    res.status(500).json({ message: "Error updating user password" }); // Return server error
  }
};

const teacherLearnerRegistration = async (req, res) => {
  console.time("learner-registration");

  const {
    firstName,
    lastName,
    email,
    contact,
    altContact,
    dob,
    gender,
    race,
    disabilityType = "None",
    password = "None",
    photo,
    province,
    region,
    schoolName,
    schoolLevel,
    ownership,
    grade,
    disabilityDescription = "None",
    Role = "learner",
  } = req.body;

  try {
    console.time("hash-password");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.timeEnd("hash-password");

    let photoUrl = null;
    if (photo) {
      console.time("upload-photo");
      photoUrl = photo || null;
      console.timeEnd("upload-photo");
    }

    console.time("begin-transaction");
    await sql`BEGIN`;
    console.timeEnd("begin-transaction");

    console.time("school-check-insert");
    let schoolResult = await sql`
            SELECT schoolId FROM schools WHERE schoolName = ${schoolName}
        `;
    let schoolId;
    if (schoolResult.length === 0) {
      const insertSchool = await sql`
                INSERT INTO schools (schoolName, schoolLevel, ownership)
                VALUES (${schoolName}, ${schoolLevel}, ${ownership})
                RETURNING schoolId
            `;
      schoolId = insertSchool[0].schoolid;
    } else {
      schoolId = schoolResult[0].schoolid;
    }
    console.timeEnd("school-check-insert");

    console.time("insert-user");
    const userResult = await sql`
            INSERT INTO users (
                name, surname, email,
                firstContact, secondContact, birthDate,
                gender, race, profilePicture, password,
                province, region, Role
            ) VALUES (
                ${firstName}, ${lastName}, ${email},
                ${contact}, ${altContact}, ${dob},
                ${gender}, ${race}, ${photoUrl}, ${hashedPassword},
                ${province}, ${region}, 'learner'
            )
            RETURNING userId
        `;
    const userId = userResult[0].userid;
    console.timeEnd("insert-user");

    console.time("insert-learner");
    await sql`
            INSERT INTO learners (
                userId, grade, disability, disabilityInfo, schoolId
            ) VALUES (
                ${userId}, ${grade}, ${disabilityType}, ${disabilityDescription}, ${schoolId}
            )
        `;
    console.timeEnd("insert-learner");

    console.time("commit-transaction");
    await sql`COMMIT`;
    console.timeEnd("commit-transaction");

    console.timeEnd("learner-registration");

    res.status(201).json({
      message: "Learner registered successfully",
      result: { userId, schoolId },
    });
  } catch (error) {
    console.error("Learner Registration Error:", error);

    await sql`ROLLBACK`;
    console.timeEnd("learner-registration");

    res
      .status(500)
      .json({ message: "Server error during learner registration", error });
  }
};

// LEARNER REGISTRATION
const learnerRegistration = async (req, res) => {
  console.time("learner-registration");

  const {
    firstName,
    lastName,
    email,
    contact,
    altContact,
    dob,
    gender,
    race,
    disabilityType,
    password,
    photo,
    province,
    region,
    schoolName,
    schoolLevel,
    ownership,
    grade,
    disabilityDescription,
    Role,
  } = req.body;

  try {
    console.time("hash-password");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.timeEnd("hash-password");

    let photoUrl = null;
    if (photo) {
      console.time("upload-photo");
      photoUrl = photo || null;
      console.timeEnd("upload-photo");
    }

    console.time("begin-transaction");
    await sql`BEGIN`;
    console.timeEnd("begin-transaction");

    console.time("school-check-insert");
    let schoolResult = await sql`
            SELECT schoolId FROM schools WHERE schoolName = ${schoolName}
        `;

    let schoolId;
    if (schoolResult.length === 0) {
      const insertSchool = await sql`
                INSERT INTO schools (schoolName, schoolLevel, ownership)
                VALUES (${schoolName}, ${schoolLevel}, ${ownership})
                RETURNING schoolId
            `;
      schoolId = insertSchool[0].schoolid;
    } else {
      schoolId = schoolResult[0].schoolid;
    }
    console.timeEnd("school-check-insert");

    console.time("insert-user");
    const userResult = await sql`
            INSERT INTO users (
                name, surname, email,
                firstContact, secondContact, birthDate,
                gender, race, profilePicture, password,
                province, region, Role
            ) VALUES (
                ${firstName}, ${lastName}, ${email},
                ${contact}, ${altContact}, ${dob},
                ${gender}, ${race}, ${photoUrl}, ${hashedPassword},
                ${province}, ${region}, 'learner'
            )
            RETURNING userId
        `;
    const userId = userResult[0].userid;
    console.timeEnd("insert-user");

    console.time("insert-learner");
    await sql`
            INSERT INTO learners (
                userId, grade, disability, disabilityInfo, schoolId
            ) VALUES (
                ${userId}, ${grade}, ${disabilityType}, ${disabilityDescription}, ${schoolId}
            )
        `;
    console.timeEnd("insert-learner");

    console.time("commit-transaction");
    await sql`COMMIT`;
    console.timeEnd("commit-transaction");

    console.timeEnd("learner-registration");

    res.status(201).json({
      message: "Learner registered successfully",
      result: { userId, schoolId },
    });
  } catch (error) {
    console.error("Learner Registration Error:", error);

    await sql`ROLLBACK`;
    console.timeEnd("learner-registration");

    res
      .status(500)
      .json({ message: "Server error during learner registration", error });
  }
};

// TEACHER REGISTRATION
const teacherRegistration = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    contact,
    altContact,
    dob,
    gender,
    race,
    password,
    photo, // uploaded in frontend
    disability,
    province,
    region,
    school,
    schooLevel,
    ownership,
    Role,
  } = req.body;

  const schoolName = typeof school === "string" ? school : school?.schoolname;
  try {
    console.time("teacher-registration");
    const hashedPassword = await bcrypt.hash(password, 10);
    const photoUrl = photo || null;

    await sql`BEGIN`;

    let schoolResult = await sql`
      SELECT schoolId FROM schools WHERE schoolName = ${schoolName}
    `;

    let schoolId;
    if (schoolResult.length === 0) {
      schoolResult = await sql`
        INSERT INTO schools (schoolName, schooLevel, ownership)
        VALUES (${schoolName}, ${schooLevel}, ${ownership})
        RETURNING schoolId
      `;
      schoolId = schoolResult[0].schoolid;
    } else {
      schoolId = schoolResult[0].schoolid;
    }

    const userResult = await sql`
      INSERT INTO users (
        name, surname, email,
        firstContact, secondContact, birthDate,
        gender, race, profilePicture, password,
        province, region, Role
      ) VALUES (
        ${firstName}, ${lastName}, ${email},
        ${contact}, ${altContact}, ${dob},
        ${gender}, ${race}, ${photoUrl}, ${hashedPassword},
        ${province}, ${region}, 'teacher'
      )
      RETURNING userId
    `;

    const userId = userResult[0]?.userid;

    await sql`
      INSERT INTO teachers (
        userId, disability, schoolId
      ) VALUES (
        ${userId}, ${disability}, ${schoolId}
      )
    `;

    await sql`COMMIT`;

    console.timeEnd("teacher-registration");

    res.status(201).json({
      message: "Teacher registered successfully",
      result: { userId, schoolId },
    });
  } catch (error) {
    console.error("Teacher Registration Error:", error);
    await sql`ROLLBACK`;
    res
      .status(500)
      .json({ message: "Server error during teacher registration", error });
  }
};

//Get all users
export const getAllUsersInfo = async (req, res) => {
  try {
    console.time("get-all-users-info");

    // Fetch all users
    const usersResult = await sql`
      SELECT
        userId,
        name,
        surname,
        email,
        firstContact,
        secondContact,
        profilePicture,
        birthDate,
        gender,
        race,
        province,
        region,
        role
      FROM users
    `;

    if (usersResult.length === 0) {
      console.timeEnd("get-all-users-info");
      return res.status(404).json({ message: "No users found" });
    }

    /* const users = [];

    for (const user of usersResult) {
      const role = user.role?.toLowerCase();
      let roleDetails = {};

      if (role === "learner") {
        const learnerResult = await sql`
          SELECT grade, disability, disabilityInfo, schoolId
          FROM learners
          WHERE userId = ${user.userId}
        `;
        if (learnerResult.length > 0) {
          roleDetails = learnerResult[0];
        }
      } else if (role === "teacher") {
        const teacherResult = await sql`
          SELECT disability, schoolId
          FROM teachers
          WHERE userId = ${user.userId}
        `;
        if (teacherResult.length > 0) {
          roleDetails = teacherResult[0];
        }
      } else if (role === "judge") {
        const judgeResult = await sql`
          SELECT institution, qualification, proofCertificate, identityDocument
          FROM judges
          WHERE userId = ${user.userId}
        `;
        if (judgeResult.length > 0) {
          const judge = judgeResult[0];
          const signedUrls = {};

          if (judge.proofcertificate) {
            const { data } = await supabase.storage
              .from("documents")
              .createSignedUrl(judge.proofcertificate, 60 * 60);
            signedUrls.proofCertificateUrl = data?.signedUrl || null;
          }

          if (judge.identitydocument) {
            const { data } = await supabase.storage
              .from("documents")
              .createSignedUrl(judge.identitydocument, 60 * 60);
            signedUrls.identityDocumentUrl = data?.signedUrl || null;
          }

          roleDetails = { ...judge, ...signedUrls };
        }
      }

      users.push({ ...user, ...roleDetails });
    } */

    console.timeEnd("get-all-users-info");

    return res.status(200).json({
      message: "All users info fetched successfully",
      users: usersResult,
    });
  } catch (error) {
    console.error("Get All Users Info Error:", error);
    res.status(500).json({ message: "Error fetching users information" });
  }
};

// JUDGE REGISTRATION
const judgeRegistration = async (req, res) => {
  const {
    title,
    firstName,
    lastName,
    email,
    password,
    contact,
    altContact,
    dob,
    gender,
    race,
    photo, // already uploaded
    institution,
    qualification,
    certificate, // already uploaded
    idDoc, // already uploaded
    province,
    region,
    years,
    expoForums,
    judgeExperience,
    categories,
    Role,
  } = req.body;

  try {
    console.time("judge-registration");

    const hashedPassword = await bcrypt.hash(password, 10);

    const photoUrl = photo || null;
    const certificateUrl = certificate || null;
    const idDocumentUrl = idDoc || null;

    await sql`BEGIN`;

    const userResult = await sql`
      INSERT INTO users (
        name, surname, email,
        firstContact, secondContact, birthDate,
        gender, race, profilePicture, password,
        province, region, Role
      ) VALUES (
        ${firstName}, ${lastName}, ${email},
        ${contact}, ${altContact}, ${dob},
        ${gender}, ${race}, ${photoUrl}, ${hashedPassword},
        ${province}, ${region}, ${Role || "judge"}
      )
      RETURNING userId
    `;

    const userId = userResult[0]?.userid;
    if (!userId) {
      return res.status(500).json({ message: "User ID not returned" });
    }

    await sql`
      INSERT INTO judges (
        userId, title, institution, qualification,
        proofCertificate, identityDocument,
        yearsJudged, expoForum, expoExperience,
        firstCategory, secondCategory, points, rating
      ) VALUES (
        ${userId}, ${title}, ${institution}, ${qualification},
        ${certificateUrl}, ${idDocumentUrl},
        ${years}, ${
          expoForums.regional
            ? "regional"
            : expoForums.district
              ? "district"
              : "international"
        },
        ${judgeExperience},
        ${categories[0]}, ${categories[1]}, 0, 0
      )
    `;

    await sql`COMMIT`;

    console.timeEnd("judge-registration");

    res
      .status(201)
      .json({ message: "Judge registered successfully", result: { userId } });
  } catch (error) {
    console.error("Judge Registration Error:", error);
    await sql`ROLLBACK`;
    res
      .status(500)
      .json({ message: "Server error during judge registration", error });
  }
};

// getJudgeProfile - Fetches the profile details of a specific judge
const getJudgeProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // Select basic user information for the judge
    const userResult = await sql`
      SELECT
        userId AS "userId",
        name,
        surname,
        email,
        firstContact AS "firstContact",
        secondContact AS "secondContact",
        profilePicture AS "profilePicture"
      FROM users
      WHERE userId = ${userId} AND role = 'judge'
    `;

    if (userResult.length === 0) {
      return res.status(404).json({ message: "Judge not found" }); // Return 404 if no judge found with the given ID
    }

    const user = userResult[0]; // Get the user data

    // Select judge-specific information
    const judgeResult = await sql`
      SELECT
        institution,
        qualification,
        proofCertificate,
        identityDocument,
        rating,
        points
      FROM judges
      WHERE userId = ${userId}
    `;

    const judge = judgeResult[0] || {}; // Get judge data, or an empty object if not found
    const signedUrls = {}; // Object to store signed URLs for documents

    // Generate a signed URL for the proof of certificate if it exists
    if (judge.proofcertificate) {
      const { data } = await supabase.storage
        .from("documents")
        .createSignedUrl(judge.proofcertificate, 60 * 60); // URL expires in 1 hour
      signedUrls.proofCertificateUrl = data?.signedUrl || null;
    }

    // Generate a signed URL for the identity document if it exists
    if (judge.identitydocument) {
      const { data } = await supabase.storage
        .from("documents")
        .createSignedUrl(judge.identitydocument, 60 * 60); // URL expires in 1 hour
      signedUrls.identityDocumentUrl = data?.signedUrl || null;
    }

    // Return a success response with the judge's profile information and signed URLs
    res.status(200).json({
      message: "Profile fetched successfully",
      profile: {
        ...user,
        ...judge,
        ...signedUrls,
      },
    });
  } catch (error) {
    console.error("Get Judge Profile Error:", error); // Log any error during profile fetching
    res.status(500).json({ message: "Error fetching judge profile" }); // Return 500 for server error
  }
};

// updateJudgeProfile - Updates the profile information of a judge
const updateJudgeProfile = async (req, res) => {
  const { userId } = req.params;
  const {
    name,
    surname,
    email,
    firstContact,
    secondContact,
    institution,
    qualification,
    profilePicture,
  } = req.body;

  try {
    console.log("Incoming update for user:", userId); // Log the incoming update request

    // Support fallback casing for contact fields (in case frontend sends with different casing)
    const contact1 = firstContact || req.body.firstcontact;
    const contact2 = secondContact || req.body.secondcontact;

    let profilePictureUrl = null;

    // Check if a new profile picture is being uploaded (base64 format)
    if (profilePicture && profilePicture.startsWith("data:image/")) {
      console.log("Base64 profile picture detected");

      // Extract content type and base64 data using regex
      const matches = profilePicture.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!matches) throw new Error("Invalid base64 format for image");

      const [, contentType, base64Data] = matches;

      // Convert base64 string to buffer
      const buffer = Buffer.from(base64Data, "base64");

      // Extract file extension
      const fileExt = contentType.split("/")[1];

      // Create a unique file path for the image in Supabase storage
      const filePath = `user-photos/${uuidv4()}.${fileExt}`;

      // Upload the image to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("user-photos")
        .upload(filePath, buffer, {
          contentType,
          upsert: true, // Overwrite the existing file if it exists
        });

      if (uploadError) {
        console.error("Supabase upload failed:", uploadError.message);
        throw uploadError;
      }

      // Get the public URL of the uploaded image
      const { data: publicData, error: urlError } = supabase.storage
        .from("user-photos")
        .getPublicUrl(filePath);

      if (urlError || !publicData?.publicUrl) {
        console.error("Failed to get public URL:", urlError);
        throw new Error("Could not get public URL for uploaded image");
      }

      profilePictureUrl = publicData.publicUrl; // Set the profilePictureUrl to the newly uploaded image URL
      console.log("Profile picture uploaded at:", profilePictureUrl);
    }

    // Update the user's basic information in the users table
    await sql`
      UPDATE users SET
        name = COALESCE(${name}, name), -- Update name if provided, otherwise keep the existing value
        surname = COALESCE(${surname}, surname),
        email = COALESCE(${email}, email),
        firstContact = COALESCE(${contact1}, firstContact),
        secondContact = COALESCE(${contact2}, secondContact),
        profilePicture = COALESCE(${profilePictureUrl}, profilePicture) -- Update profile picture if a new URL is available
      WHERE userId = ${userId}
    `;

    // Update the judge's specific information in the judges table
    await sql`
      UPDATE judges SET
        institution = COALESCE(${institution}, institution),
        qualification = COALESCE(${qualification}, qualification)
      WHERE userId = ${userId}
    `;
    console.log("Judge profile updated successfully"); // Log successful update
    res.status(200).json({ message: "Judge profile updated successfully" }); // Return success message
  } catch (error) {
    console.error("Error updating judge profile:", error); // Log any error during update
    res.status(500).json({ message: "Error updating judge profile" }); // Return server error
  }
};

// removeJudgeProfilePicture - Removes the profile picture of a judge by setting the profilePicture field to NULL
const removeJudgeProfilePicture = async (req, res) => {
  const { userId } = req.params;

  try {
    await sql`
      UPDATE users
      SET
        profilePicture = NULL
      WHERE userId = ${userId}
    `;

    res.status(200).json({ message: "Profile picture removed successfully" }); // Return success message
  } catch (error) {
    console.error("Remove Judge Profile Picture Error:", error); // Log any error during removal
    res.status(500).json({ message: "Error removing judge profile picture" }); // Return server error
  }
};

export const getTeacherSchool = async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Join teachers -> schools on schoolId, filter by teacher userId
    const result = await sql`
      SELECT
        s.schoolName,
        s.province,
        s.region,
        s.schoolLevel,
        s.ownership
      FROM teachers t
      JOIN schools s ON t.schoolId = s.schoolId
      WHERE t.userId = ${teacherId}
      LIMIT 1
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Teacher or school not found" });
    }

    // result is an array of rows, take first
    const schoolInfo = result[0];

    return res.status(200).json(schoolInfo);
  } catch (error) {
    console.error("Error fetching teacher school info:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  login,
  learnerRegistration,
  teacherRegistration,
  judgeRegistration,
  getJudgeProfile,
  updateJudgeProfile,
  removeJudgeProfilePicture,
  getUserProfile,
  teacherLearnerRegistration,
};
