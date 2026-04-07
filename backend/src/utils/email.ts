import nodemailer from "nodemailer";

export const sendResetEmail = async (to: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_PORT === "465", 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"SIMAD University Support" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "OTP Code - SIMAD University Password Reset",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #f8fafc; border-radius: 24px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #059669; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; margin: 0; text-transform: uppercase;">SIMAD UNIVERSITY</h1>
          <p style="color: #64748b; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; margin-top: 4px; text-transform: uppercase;">Academic Hub</p>
        </div>
        
        <div style="background-color: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin-top: 0;">Verification Code</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">You requested a password reset for your SIMAD University account. Use the following 6-digit OTP code to complete the process:</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <div style="background-color: #f1f5f9; padding: 24px; border-radius: 16px; display: inline-block;">
              <span style="font-size: 36px; font-weight: 800; color: #059669; letter-spacing: 0.2em; font-family: monospace;">${otp}</span>
            </div>
            <p style="color: #94a3b8; font-size: 11px; font-weight: 700; margin-top: 16px; text-transform: uppercase;">Xeerkan wuxuu dhacayaa 10 daqiiqo</p>
          </div>
          
          <p style="color: #475569; font-size: 13px; line-height: 1.6;">Hadii aadan adigu codsan reset-kan, fadlan iska indhatir email-kan si ammaan ah.</p>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
          <p style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">© 2026 SIMAD UNIVERSITY. Safe & Secure Hub.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to: ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send OTP email");
  }
};
