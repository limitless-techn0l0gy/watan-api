const serverStatus = async (req, res) => {
    res.send("The server is runing.....");
  },
  privacy_policy = async (req, res) => {
    res.render("privacy_policy");
  },
  terms_conditions = async (req, res) => {
    res.render("terms_conditions");
  };
module.exports = {  serverStatus, privacy_policy, terms_conditions };
