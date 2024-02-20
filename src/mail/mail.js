require("dotenv").config();
const nodeMailer = require("nodemailer"),
  myEmail = "watanservices23@gmail.com",
  myPass = "fltsldgrqrzyvdpq",
  genTemplate = (subject, img, p, code, note, privacy, conditions, lang) => {
    var dir;
    if (lang.language == "العربية") {
      dir = "rtl";
    } else {
      dir = "ltr";
    }
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
          <style>
            * {
              padding: 0;
              margin: 0;
              box-sizing: border-box;
              color: #333333;
            }
            body {
              width: 100%;
              background-color: #f0f0f0;
            }
            img {
              width: 100px;
              object-fit: contain;
              margin: 5px;
            }
            #msg-body-code {
              padding: 25px;
              margin: 5px;
              background-color: #f4f5ff;
              color: #303f6a;
              font-size: 1.5em;
              font-weight: 800;
            }
          </style>
        </head>
        <body dir="${dir}">
          <div id="msg">
            <img src="cid:${img}" width="100" alt="watan Logo" />
            <div id="msg-body">
              <h3>${p}</h3>
              <p id="msg-body-code">${code}</p>
              <p>${note}</p>
              <a href="${process.env.PRIVACY}">${privacy}</a>
              <br />
              <a href="${process.env.CONDITIONS}">${conditions}</a>
              <p> © watan 2024-2023</p>
            </div>
          </div>
        </body>
      </html>  
    `;
  },
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
  send = async (userEmail, subject, code, lang, type) => {
    try {
      var img;
      if (type == "a") {
        img = [
          {
            filename: "logo.png",
            path: "./src/mail/logo.png",
            cid: "unique@cid",
          },
        ];
      } else {
        img = [
          {
            filename: "u-logo.png",
            path: "./src/mail/u-logo.png",
            cid: "unique@cid",
          },
        ];
      }
      var htmlTemplate = genTemplate(
        subject,
        img[0].cid,
        lang.msgDesc,
        code,
        lang.msgNote,
        lang.privacy,
        lang.conditions,
        lang
      );
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
          attachments: img,
        },
        info = await transport.sendMail(mailOptions);
      return info;
    } catch (error) {
      return error;
    }
  },
  mcSend = async (userEmail, mc, lang) => {
    try {
      var subject = lang.mc_msgSubject,
        htmlTemplate = genTemplate(
          subject,
          "unique@cid",
          lang.mc_msgDesc,
          mc,
          lang.msgNote,
          lang.privacy,
          lang.conditions,
          lang
        );
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
          attachments: [
            {
              filename: "logo.png",
              path: "./src/mail/logo.png",
              cid: "unique@cid",
            },
          ],
        },
        info = await transport.sendMail(mailOptions);
      return info;
    } catch (error) {
      return error;
    }
  };
module.exports = { mcSend, send, genCode };
