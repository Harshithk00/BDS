import nodemailer from 'nodemailer';

export default async function POST(req) {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ message: 'All fields (to, subject, text) are required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error });
  }
}