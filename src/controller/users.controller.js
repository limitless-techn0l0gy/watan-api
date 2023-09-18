const userModel = require("../model/users.model"),
  validationResult = require("express-validator").validationResult,
  bcrypt = require("bcrypt"),
  { sendverifyEmail, genCode } = require("../mail/verify.email"),
  signup = async (req, res) => {
    try {
      var {
          firstName,
          lastName,
          email,
          phone,
          password,
          vpassword,
          date,
          gender,
          country,
          governorate,
        } = req.body,
        errorValidate = validationResult(req).array(),
        emailCheck = await userModel.findOne({ email: email });
      console.log(emailCheck);
      if (errorValidate.length > 0) {
        res.json(errorValidate);
      } else {
        if (emailCheck == null) {
          if (password == vpassword) {
            var code = genCode(),
              subject = "Confirm your email",
              htmlTemplate = `Hello <h2>${firstName} ${lastName}</h2>,
          This is your verification code: 
          <p style="font-weight:800;">${code}</p>`,
              send = sendverifyEmail(email, subject, htmlTemplate),
              msgStatus = (await send).response.includes("OK"),
              resBody = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                password: password,
                date: date,
                gender: gender,
                country: country,
                governorate: governorate,
                code: code,
                msgStatus: msgStatus,
              };

            res.json(resBody);
          }
        } else {
          res.json({ type: "Email already exists" });
        }
      }
    } catch (error) {
      return res.json({ type: error });
    }
  },
  verify = async (req, res) => {
    try {
      var {
        firstName,
        lastName,
        email,
        phone,
        password,
        date,
        gender,
        country,
        governorate,
        code,
        vcode,
      } = req.body;
      if (code === vcode) {
        var salt = await bcrypt.genSalt(10),
          hashpass = await bcrypt.hash(password, salt),
          errorValidate = validationResult(req).array();
        if (errorValidate.length > 0) {
          res.json(errorValidate);
        } else {
          var points = "0";
          password = hashpass;
          const newUser = await userModel.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            date,
            gender,
            country,
            governorate,
            points,
          });

          res.json(newUser);
        }
      }
    } catch (error) {
      return res.json({ type: error });
    }
  },
  sendMsg = async (req, res) => {
    try {
      var { email } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        console.log("error");
        res.json(errorValidate);
      } else {
        var emailCheck = await userModel.findOne({ email: email });
        if (emailCheck) {
          var code = genCode(),
            subject = "Confirm your email",
            htmlTemplate = `This is your verification code:
            <p style="font-weight:800;">${code}</p>`,
            send = (await sendverifyEmail(email, subject, htmlTemplate))
              .response,
            msgStatus = send.includes("OK"),
            resBody = {
              id: emailCheck["_id"],
              firstName: emailCheck["firstName"],
              lastName: emailCheck["lastName"],
              email: email,
              msgStatus: msgStatus,
              code: code,
            };
          console.log(resBody);
          res.json(resBody);
        } else {
          res.json({ type: "email not found" });
        }
      }
    } catch (error) {
      return res.json({ type: error });
    }
  },
  updatepass = async (req, res) => {
    try {
      var { id, password, vpassword } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        console.log("error");
        res.json(errorValidate);
      } else {
        if (password == vpassword) {
          var checkoldpass = await userModel.findById({ _id: id }),
            isMatch = await bcrypt.compare(password, checkoldpass.password);
          if (!isMatch) {
            var salt = await bcrypt.genSalt(10),
              hashpass = await bcrypt.hash(password, salt),
              password = hashpass,
              update = await userModel.findByIdAndUpdate(
                { _id: id },
                {
                  password,
                },
                { new: true }
              );
            res.json(update);
          } else {
            res.json({ type: "please enter a new password" });
          }
        } else {
          return res.json({ type: "Passwords not equal" });
        }
      }
    } catch (error) {
      return res.json({ type: error });
    }
  },
  logIn = async (req, res) => {
    try {
      const { email, password } = req.body,
        userData = await userModel.findOne({ email: email });
      if (userData != null) {
        const isMatch = await bcrypt.compare(password, userData.password);
        if (isMatch) {
          res.json(userData);
        } else {
          res.json({ type: "password not correct" });
        }
      } else {
        res.json({ type: "Email not found" });
      }
    } catch (error) {
      return res.json({ type: error });
    }
  },
  deleteUser = async (req, res) => {
    const { id } = req.body;
    errorValidate = validationResult(req).array();
    if (errorValidate.length > 0) {
      res.json(errorValidate);
    } else {
      const deletedUser = await userModel.findByIdAndRemove(
        { _id: id },
        { new: true }
      );
      if (deleteUser) {
        res.json(deletedUser);
      } else {
        res.json({ type: "account not exist" });
      }
    }
  };

module.exports = {
  signup,
  verify,
  sendMsg,
  updatepass,
  logIn,
  deleteUser,
};
