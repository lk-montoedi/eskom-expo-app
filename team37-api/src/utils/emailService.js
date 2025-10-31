// server/utils/emailService.js
import nodemailer from "nodemailer";

const FRONTEND_URL = "http://localhost:5173";

// Creating transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "toptechcoders@gmail.com", // email - "toptechcoders@gmail.com" // password - "toptechcoders2024"
      pass: "heqt bbka ohtg yqje", // Google App Password
    },
  });
};

// Email functions
export const sendRegistrationSuccessEmail = async (
  recipientEmail,
  userData
) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Eskom Expo Team" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: "🎉 Welcome! Registration Successful",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Our Platform!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your registration was successful</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Registration Details:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${userData.firstName} ${userData.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${userData.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>School:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${userData.schoolName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Grade:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${userData.grade}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Province:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${userData.province}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; padding: 20px;">
          <a href="${FRONTEND_URL}/auth/sign-in" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
            Sign In Now
          </a>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Thank you for joining us! If you have any questions, feel free to contact our support team.</p>
          <p>Best regards,<br>The Eskom Expo Team</p>
        </div>
      </div>
    `,
      text: `
      Welcome to Our Eskom Expo Platform!
      
      Your registration was successful. Here are your details:
      
      Name: ${userData.firstName} ${userData.lastName}
      Email: ${userData.email}
      School: ${userData.schoolName}
      Grade: ${userData.grade}
      Province: ${userData.province}
      
      You can now sign in at: ${FRONTEND_URL}/auth/sign-in
      
      Thank you for being a part us!
      Best regards,
      The Eskom Expo Team
    `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error("Email error:", err);
    return { success: false, error: err.message };
  }
};

export const sendProjectRegistrationSuccessEmail = async (
  recipientEmail,
  projectData
) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Eskom Expo Team" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: "Project Registration Successful! - Eskom Expo",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Project Registration Successful!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your project has been successfully submitted to Eskom Expo</p>
        </div>

        <!-- Project Details -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Project Details:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Project Title:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.projectname || "UNKNOWN"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Category:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.category || "UNKNOWN"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Description:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.description || "UNKNOWN"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>School ID:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.schoolid || "UNKNOWN"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Assigned Marksheet:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.assignedmarksheettype || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Ethics Marksheet ID:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.ethicsmarksheetid || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event Name:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.name || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event Venue:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.venue || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event Region:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.region || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event Type:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.type || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event Status:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.event_status || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Registration Date:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Status:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><span style="color: #11998e; font-weight: bold;">${
                projectData.status || "N/A"
              }</span></td>
            </tr>
          </table>
        </div>

        <!-- What Happens Next -->
        <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #11998e;">
          <h3 style="color: #333; margin-top: 0; display: flex; align-items: center;">
            <span style="margin-right: 10px;">📋</span>
            What Happens Next?
          </h3>
          <ul style="color: #555; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
            <li><strong>Review Process:</strong> Your project will be reviewed by our expert panel within 5-7 business days</li>
            <li><strong>Status Updates:</strong> You'll receive email notifications about your project status</li>
            <li><strong>Documentation:</strong> Ensure all required documents are submitted before the deadline</li>
            <li><strong>Regional Fair:</strong> Successful projects will be invited to participate in regional fairs</li>
          </ul>
        </div>

        <!-- Important Reminders -->
        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-top: 0; display: flex; align-items: center;">
            <span style="margin-right: 10px;">⚠️</span>
            Important Reminders
          </h3>
          <ul style="color: #856404; line-height: 1.6; margin: 10px 0; padding-left: 20px;">
            <li>Keep your project documentation up to date</li>
            <li>Check your email regularly for updates</li>
            <li>Contact support if you need to make any changes</li>
            <li>Prepare for potential interviews with judges</li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div style="text-align: center; padding: 20px;">
          <a href="${FRONTEND_URL}/dashboard/projects" 
             style="background: #11998e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; margin-right: 10px;">
            View Project Status
          </a>
          <a href="${FRONTEND_URL}/support" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
            Get Support
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <p><strong>Good luck with your project!</strong> We're excited to see your innovative ideas.</p>
          <p>For questions or support, contact us at <a href="mailto:support@eskomexpo.co.za" style="color: #11998e;">support@eskomexpo.co.za</a></p>
          <p>Best regards,<br><strong>The Eskom Expo Team</strong></p>
        </div>
      </div>
      `,
      text: `
Project Registration Successful - Eskom Expo

Project Details:
- Project Title: ${projectData.projectname || "UNKNOWN"}
- Category: ${projectData.category || "UNKNOWN"}
- Description: ${projectData.description || "UNKNOWN"}
- School ID: ${projectData.schoolid || "UNKNOWN"}
- Assigned Marksheet: ${projectData.assignedmarksheettype || "N/A"}
- Ethics Marksheet ID: ${projectData.ethicsmarksheetid || "N/A"}
- Event Name: ${projectData.name || "N/A"}
- Event Venue: ${projectData.venue || "N/A"}
- Event Region: ${projectData.region || "N/A"}
- Event Type: ${projectData.type || "N/A"}
- Event Status: ${projectData.event_status || "N/A"}
- Registration Date: ${new Date().toLocaleDateString()}
- Status: ${projectData.status || "N/A"}

What Happens Next:
- Review Process: Your project will be reviewed by our expert panel within 5-7 business days
- Status Updates: You'll receive email notifications about your project status
- Documentation: Ensure all required documents are submitted before the deadline
- Regional Fair: Successful projects will be invited to participate in regional fairs

Important Reminders:
- Keep your project documentation up to date
- Check your email regularly for updates
- Contact support if you need to make any changes

View your project status: ${FRONTEND_URL}/dashboard/projects
Get support: ${FRONTEND_URL}/support

Good luck with your project! We're excited to see your innovative ideas.

For questions or support, contact us at support@eskomexpo.co.za

Best regards,
The Eskom Expo Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Project email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error("Project email error:", err);
    return { success: false, error: err.message };
  }
};

export const sendProjectMarkedSuccessEmail = async (
  recipientEmail,
  projectData
) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Eskom Expo Team" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: "Project has been successfully marked! - Eskom Expo",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Project Marked Successfully!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your project has been successfully marked by your judges</p>
        </div>

        <!-- Project Details -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Project Details:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Project Title:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.projectname || "UNKNOWN"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Category:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.category || "UNKNOWN"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Description:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.description || "UNKNOWN"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>School ID:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.schoolid || "UNKNOWN"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Assigned Marksheet:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.assignedmarksheettype || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Ethics Marksheet ID:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.ethicsmarksheetid || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event Name:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.name || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event Venue:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.venue || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event Region:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.region || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event Type:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.type || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event Status:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                projectData.event_status || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Registration Date:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Status:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><span style="color: #11998e; font-weight: bold;">${
                projectData.status || "N/A"
              }</span></td>
            </tr>
          </table>
        </div>

        <!-- What Happens Next -->
        <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #11998e;">
          <h3 style="color: #333; margin-top: 0; display: flex; align-items: center;">
            <span style="margin-right: 10px;">📋</span>
            What Happens Next?
          </h3>
          <ul style="color: #555; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
            <li><strong>Review Process:</strong> Your project has been reviewed by our expert judges</li>
            <li><strong>Regional Fair:</strong> Successful projects will be invited to participate in regional fairs</li>
          </ul>
        </div>

        <!-- Important Reminders -->
        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-top: 0; display: flex; align-items: center;">
            <span style="margin-right: 10px;">⚠️</span>
            Important Reminders
          </h3>
          <ul style="color: #856404; line-height: 1.6; margin: 10px 0; padding-left: 20px;">
            <li>Keep your project documentation up to date</li>
            <li>Check your email regularly for updates</li>
            <li>Contact support if you need to make any changes</li>
            <li>Prepare for further potential interviews with judges</li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div style="text-align: center; padding: 20px;">
          <a href="${FRONTEND_URL}/dashboard/projects" 
             style="background: #11998e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; margin-right: 10px;">
            View Project Status
          </a>
          <a href="${FRONTEND_URL}/support" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
            Get Support
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <p><strong>Good luck with your project!</strong> We're excited to see your innovative ideas.</p>
          <p>For questions or support, contact us at <a href="mailto:support@eskomexpo.co.za" style="color: #11998e;">support@eskomexpo.co.za</a></p>
          <p>Best regards,<br><strong>The Eskom Expo Team</strong></p>
        </div>
      </div>
      `,
      text: `
Project Marked Successfully - Eskom Expo

Project Details:
- Project Title: ${projectData.projectname || "UNKNOWN"}
- Category: ${projectData.category || "UNKNOWN"}
- Description: ${projectData.description || "UNKNOWN"}
- School ID: ${projectData.schoolid || "UNKNOWN"}
- Assigned Marksheet: ${projectData.assignedmarksheettype || "N/A"}
- Ethics Marksheet ID: ${projectData.ethicsmarksheetid || "N/A"}
- Event Name: ${projectData.name || "N/A"}
- Event Venue: ${projectData.venue || "N/A"}
- Event Region: ${projectData.region || "N/A"}
- Event Type: ${projectData.type || "N/A"}
- Event Status: ${projectData.event_status || "N/A"}
- Registration Date: ${new Date().toLocaleDateString()}
- Status: ${projectData.status || "N/A"}

Important Reminders:
- Keep your project documentation up to date
- Check your email regularly for updates
- Contact support if you need to make any changes

View your project status: ${FRONTEND_URL}/dashboard/projects
Get support: ${FRONTEND_URL}/support

Good luck with your project! We're excited to see more of your innovative ideas.

For questions or support, contact us at support@eskomexpo.co.za

Best regards,
The Eskom Expo Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Project email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error("Project email error:", err);
    return { success: false, error: err.message };
  }
};

export const sendJudgeRegistrationSuccessEmail = async (email, judgeData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Eskom Expo Team" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "🎉Welcome ! Judge Registration Successful - Eskom Expo",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8e44ad 0%, #3498db 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to the Eskom Expo Judge Panel!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your judge registration was successful</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Judge Profile Details:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                judgeData.firstName
              } ${judgeData.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                judgeData.email
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Contact:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                judgeData.contact
              }</td>
            </tr>
            ${
              judgeData.altContact
                ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Alternative Contact:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${judgeData.altContact}</td>
            </tr>
            `
                : ""
            }
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Province:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                judgeData.province
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Region:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                judgeData.region
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>School Affiliation:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                judgeData.school?.name ||
                judgeData.schoolName ||
                "Not specified"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Registration Date:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Status:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><span style="color: #8e44ad; font-weight: bold;">Pending Verification</span></td>
            </tr>
          </table>
        </div>
        
        <div style="background: #e8f4fd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #3498db;">
          <h3 style="color: #333; margin-top: 0; display: flex; align-items: center;">
            <span style="margin-right: 10px;">📋</span>
            What Happens Next?
          </h3>
          <ul style="color: #555; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
            <li><strong>Profile Review:</strong> Our team will review your judge application within 3-5 business days</li>
            <li><strong>Background Verification:</strong> We'll verify your credentials and experience</li>
            <li><strong>Training Materials:</strong> Once approved, you'll receive judge training resources</li>
            <li><strong>Event Assignment:</strong> You'll be assigned to specific events based on your expertise</li>
            <li><strong>Judge Portal Access:</strong> Full access to the judge dashboard will be granted after approval</li>
          </ul>
        </div>

        <div style="background: #f8e8ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #8e44ad;">
          <h3 style="color: #333; margin-top: 0; display: flex; align-items: center;">
            <span style="margin-right: 10px;">⚖️</span>
            Judge Responsibilities
          </h3>
          <ul style="color: #555; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
            <li><strong>Fair Evaluation:</strong> Assess projects objectively using provided criteria</li>
            <li><strong>Constructive Feedback:</strong> Provide meaningful feedback to participants</li>
            <li><strong>Professional Conduct:</strong> Maintain high standards of professionalism</li>
            <li><strong>Confidentiality:</strong> Keep all judging discussions and scores confidential</li>
            <li><strong>Punctuality:</strong> Arrive on time for all assigned judging sessions</li>
          </ul>
        </div>

        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-top: 0; display: flex; align-items: center;">
            <span style="margin-right: 10px;">⏰</span>
            Important Reminders
          </h3>
          <ul style="color: #856404; line-height: 1.6; margin: 10px 0; padding-left: 20px;">
            <li>Check your email regularly for updates and assignments</li>
            <li>Complete any required training modules promptly</li>
            <li>Update your profile if any contact details change</li>
            <li>Review judging criteria and rubrics before events</li>
            <li>Contact support immediately if you have any conflicts of interest</li>
          </ul>
        </div>
        
        <div style="text-align: center; padding: 20px;">
          <a href="${FRONTEND_URL}/judge/dashboard" 
             style="background: #8e44ad; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; margin-right: 10px;">
            Judge Dashboard
          </a>
          <a href="${FRONTEND_URL}/judge/training" 
             style="background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; margin-right: 10px;">
            Training Materials
          </a>
          <a href="${FRONTEND_URL}/support" 
             style="background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
            Get Support
          </a>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <p><strong>Thank you for volunteering as a judge!</strong> Your expertise helps inspire the next generation of innovators.</p>
          <p>For questions or support, contact us at <a href="mailto:judges@eskomexpo.co.za" style="color: #8e44ad;">judges@eskomexpo.co.za</a></p>
          <p>Best regards,<br><strong>The Eskom Expo Judging Committee</strong></p>
        </div>
      </div>
    `,
      text: `
Judge Registration Successful - Eskom Expo

Welcome to the Eskom Expo Judge Panel!

Your judge registration was successful.

Judge Profile Details:
- Name: ${judgeData.firstName} ${judgeData.lastName}
- Email: ${judgeData.email}
- Contact: ${judgeData.contact}
${judgeData.altContact ? `- Alternative Contact: ${judgeData.altContact}` : ""}
- Province: ${judgeData.province}
- Region: ${judgeData.region}
- School Affiliation: ${
        judgeData.school?.name || judgeData.schoolName || "Not specified"
      }
- Registration Date: ${new Date().toLocaleDateString()}

What Happens Next?
- Background Verification: We'll verify your credentials and experience
- Training Materials: Once approved, you'll receive judge training resources
- Event Assignment: You'll be assigned to specific events based on your expertise
- Judge Portal Access: Full access to the judge dashboard will be granted after approval

Judge Responsibilities:
- Fair Evaluation: Assess projects objectively using provided criteria
- Constructive Feedback: Provide meaningful feedback to participants
- Professional Conduct: Maintain high standards of professionalism
- Confidentiality: Keep all judging discussions and scores confidential
- Punctuality: Arrive on time for all assigned judging sessions

Important Reminders:
- Check your notifications on website regularly for updates and assignments
- Update your profile if any contact details change
- Review judging criteria and rubrics before events
- Contact support immediately if you have any conflicts of interest

Access your judge dashboard: ${FRONTEND_URL}/judge/dashboard
Training materials: ${FRONTEND_URL}/judge/training
Get support: ${FRONTEND_URL}/support

Thank you for volunteering as a judge! Your expertise helps inspire the next generation of innovators.

For questions or support, contact us at judges@eskomexpo.co.za

Best regards,
The Eskom Expo Judging Committee
    `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Judge registration email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error(" Judge email error:", err);
    return { success: false, error: err.message };
  }
};

export const sendTeacherRegistrationSuccessEmail = async (
  email,
  teacherData
) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Eskom Expo Team" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: " 🎉 Welcome ! Teacher Registration Successful - Eskom Expo",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Eskom Expo!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your teacher registration was successful</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Teacher Profile Details:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                teacherData.firstName
              } ${teacherData.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                teacherData.email
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Contact:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                teacherData.contact
              }</td>
            </tr>
            ${
              teacherData.altContact
                ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Alternative Contact:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${teacherData.altContact}</td>
            </tr>
            `
                : ""
            }
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Date of Birth:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date(
                teacherData.dob
              ).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Gender:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                teacherData.gender
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Race:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                teacherData.race
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Province:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                teacherData.province
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Region:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                teacherData.region
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>School:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                teacherData.school?.name ||
                teacherData.schoolName ||
                "Not specified"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>School Level:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                teacherData.schoolLevel
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>School Ownership:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
                teacherData.ownership
              }</td>
            </tr>
            ${
              teacherData.disability
                ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Disability/Special Needs:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${teacherData.disability}</td>
            </tr>
            `
                : ""
            }
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Registration Date:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Status:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><span style="color: #e74c3c; font-weight: bold;">Account Created</span></td>
            </tr>
          </table>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #27ae60;">
          <h3 style="color: #333; margin-top: 0; display: flex; align-items: center;">
            <span style="margin-right: 10px;">🎯</span>
            What You Can Do Next
          </h3>
          <ul style="color: #555; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
            <li><strong>Explore Resources:</strong> Access teaching materials and science fair guides</li>
            <li><strong>Student Registration:</strong> Help your students register for the expo</li>
            <li><strong>Project Support:</strong> Guide students through project development</li>
            <li><strong>Event Updates:</strong> Stay informed about expo dates and requirements</li>
            <li><strong>Training Workshops:</strong> Attend teacher development sessions</li>
          </ul>
        </div>

        <div style="background: #fff3e0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f39c12;">
          <h3 style="color: #333; margin-top: 0; display: flex; align-items: center;">
            <span style="margin-right: 10px;">👨‍🏫</span>
            Teacher Benefits & Resources
          </h3>
          <ul style="color: #555; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
            <li><strong>Teaching Materials:</strong> Access curriculum-aligned science resources</li>
            <li><strong>Project Guidelines:</strong> Step-by-step guides for student projects</li>
            <li><strong>Assessment Tools:</strong> Rubrics and evaluation criteria</li>
            <li><strong>Professional Development:</strong> Workshops and training opportunities</li>
            <li><strong>Networking:</strong> Connect with other science educators</li>
            <li><strong>Recognition:</strong> Outstanding teacher awards and certificates</li>
          </ul>
        </div>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196f3;">
          <h3 style="color: #1976d2; margin-top: 0; display: flex; align-items: center;">
            <span style="margin-right: 10px;">🔬</span>
            Getting Students Started
          </h3>
          <ul style="color: #555; line-height: 1.6; margin: 10px 0; padding-left: 20px;">
            <li>Review project categories and choose suitable topics for your students</li>
            <li>Help students understand the scientific method and project requirements</li>
            <li>Guide them through the registration process on our platform</li>
            <li>Provide ongoing mentorship throughout project development</li>
            <li>Ensure projects meet safety standards and ethical guidelines</li>
          </ul>
        </div>

        <div style="background: #fce4ec; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #e91e63;">
          <h3 style="color: #c2185b; margin-top: 0; display: flex; align-items: center;">
            <span style="margin-right: 10px;">📅</span>
            Important Dates & Deadlines
          </h3>
          <ul style="color: #c2185b; line-height: 1.6; margin: 10px 0; padding-left: 20px;">
            <li>Check the expo calendar for regional and national event dates</li>
            <li>Note student registration deadlines for your region</li>
            <li>Mark project submission dates in your calendar</li>
            <li>Plan ahead for judging day preparations</li>
            <li>Keep track of teacher workshop schedules</li>
          </ul>
        </div>
        
        <div style="text-align: center; padding: 20px;">
          <a href="${FRONTEND_URL}/teacher/dashboard" 
             style="background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; margin-right: 10px;">
            Teacher Dashboard
          </a>
          <a href="${FRONTEND_URL}/resources/teaching" 
             style="background: #f39c12; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; margin-right: 10px;">
            Teaching Resources
          </a>
          <a href="${FRONTEND_URL}/support" 
             style="background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
            Get Support
          </a>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <p><strong>Thank you for joining the Eskom Expo community!</strong> Your dedication to science education helps shape future innovators.</p>
          <p>For questions or support, contact us at <a href="mailto:teachers@eskomexpo.co.za" style="color: #e74c3c;">teachers@eskomexpo.co.za</a></p>
          <p>Best regards,<br><strong>The Eskom Expo Education Team</strong></p>
        </div>
      </div>
    `,
      text: `
Teacher Registration Successful - Eskom Expo

Welcome to Eskom Expo!

Your teacher registration was successful.

Teacher Profile Details:
- Name: ${teacherData.firstName} ${teacherData.lastName}
- Email: ${teacherData.email}
- Contact: ${teacherData.contact}
${
  teacherData.altContact
    ? `- Alternative Contact: ${teacherData.altContact}`
    : ""
}
- Date of Birth: ${new Date(teacherData.dob).toLocaleDateString()}
- Gender: ${teacherData.gender}
- Race: ${teacherData.race}
- Province: ${teacherData.province}
- Region: ${teacherData.region}
- School: ${
        teacherData.school?.name || teacherData.schoolName || "Not specified"
      }
- School Level: ${teacherData.schoolLevel}
- School Ownership: ${teacherData.ownership}
${
  teacherData.disability
    ? `- Disability/Special Needs: ${teacherData.disability}`
    : ""
}
- Registration Date: ${new Date().toLocaleDateString()}

What You Can Do Next:
- Explore Resources: Access teaching materials and science fair guides
- Student Registration: Help your students register for the expo
- Project Support: Guide students through project development
- Event Updates: Stay informed about expo dates and requirements
- Training Workshops: Attend teacher development sessions

Teacher Benefits & Resources:
- Teaching Materials: Access curriculum-aligned science resources
- Project Guidelines: Step-by-step guides for student projects
- Assessment Tools: Rubrics and evaluation criteria
- Professional Development: Workshops and training opportunities
- Networking: Connect with other science educators
- Recognition: Outstanding teacher awards and certificates

Getting Students Started:
- Review project categories and choose suitable topics for your students
- Help students understand the scientific method and project requirements
- Guide them through the registration process on our platform
- Provide ongoing mentorship throughout project development
- Ensure projects meet safety standards and ethical guidelines

Important Dates & Deadlines:
- Check the expo calendar for regional and national event dates
- Note student registration deadlines for your region
- Mark project submission dates in your calendar
- Plan ahead for judging day preparations
- Keep track of teacher workshop schedules

Access your teacher dashboard: ${FRONTEND_URL}/teacher/dashboard
Teaching resources: ${FRONTEND_URL}/resources/teaching
Get support: ${FRONTEND_URL}/support

Thank you for joining the Eskom Expo community! Your dedication to science education helps shape future innovators.

For questions or support, contact us at teachers@eskomexpo.co.za

Best regards,
The Eskom Expo Education Team
    `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(" Teacher registration email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error(" Teacher email error:", err);
    return { success: false, error: err.message };
  }
};
