const nodeMailer = require("nodemailer"),
  myEmail = "watanservices23@gmail.com",
  myPass = "fltsldgrqrzyvdpq",
  genCode = () => {
    var date = new Date(),
      random = Math.floor(Math.random() * 100 + 1).toString(),
      hours = date.getHours().toString(),
      minutes = date.getMinutes().toString(),
      seconds = date.getSeconds().toString(),
      milliSeconds = date.getMilliseconds().toString(),
      textCode = random + milliSeconds + seconds + minutes + hours,
      code = textCode.substring(1, 6);
    return code;
  },
  send = async (userEmail, subject, htmlTemplate) => {
    try {
      const transport = nodeMailer.createTransport({
          service: "gmail",
          auth: {
            user: myEmail,
            pass: myPass,
          },
        }),
        mailOptions = {
          from: myEmail,
          to: userEmail,
          subject: subject,
          html: htmlTemplate,
        },
        info = await transport.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw error;
    }
  };

// haythambadr14@gmail.com
// soranselimkurd@gmail.com
// send(
//   "alaa.kattfa2001@gmail.com",
//   "Watan",
//   `
// السلام عليكم
// أستاذ علاء
// انا تطبيق وطن أرغب بأخبارك انني اصبحت قادرا على
// أرسال الايميلات لكي أجعل المستخدمين قادرين
// على التحقق من حسابهم وضمان أمانهم
// وهذا أول أيميل أقوم بأرساله لحضرتك
// وقد تم برمجتي لفهم ردود المستخدمين
// من خلال المهندس Alaa Qutfa
// `
// );

// setInterval(() => {
//   console.log(genCode());
// }, 1000);
module.exports = { send, genCode };
