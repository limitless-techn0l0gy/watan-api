require("dotenv").config();
const app = require("./src/server");
app.listen(process.env.SERVER_PORT, () => console.log(`The server is runing`));