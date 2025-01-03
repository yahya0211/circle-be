import * as nodemailer from "nodemailer";

const sendEmail = async (option: any) => {
  if (!option.message || typeof option.message !== "string") {
    throw new Error("The message must be a string");
  }


  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT as string),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "CircleApp <circleapp@demomailtrap.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
