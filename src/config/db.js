const mongoose = require("mongoose"),
  db_url = "mongodb://179.61.246.120:27017";
// db_url =
//   "mongodb+srv://watan-admin:8M3GXT4SuuUNNAOi@cluster0.sxreqjn.mongodb.net/watan?retryWrites=true&w=majority";
mongoose
  .connect(db_url)
  .then(() => console.log("Db connected"))
  .catch((err) => console.log(err));
module.exports = mongoose;
// mongodb+srv://watan-admin:8M3GXT4SuuUNNAOi@cluster0.sxreqjn.mongodb.net/watan?retryWrites=true&w=majority
// password => 8M3GXT4SuuUNNAOi
// mongodb+srv://watan-admin:8M3GXT4SuuUNNAOi@cluster0.sxreqjn.mongodb.net/watan
