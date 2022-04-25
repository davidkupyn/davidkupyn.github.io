const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: `${process.env.MAILER_USER}`,
    pass: `${process.env.MAILER_PASSWORD}`,
  },
});

const sendMail = async (userEmail, content, subject) => {
  let info = await transporter.sendMail({
    from: `"Technischools" <${process.env.MICROSOFT_USER}>`,
    to: userEmail,
    subject: subject,
    text: content,
    html: `<p>${content}</p>`,
  });

  return info;
};

const sendEmail = async (req, res) => {
  const response = {
    success: false,
  };

  const users = req.body.users;
  if (users?.length > 0 && req.body.subject && req.body.content) {
    for await (const user of users) {
      try {
        const info = await sendMail(
          user.email,
          req.body.subject,
          req.body.content
        );
        if (info?.rejected?.length == 0) response.success = true;
      } catch (error) {
        console.log(error);
      }
    }
  }

  return res.status(200).json(response);
};

module.exports = {
  sendEmail,
};
