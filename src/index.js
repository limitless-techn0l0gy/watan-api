const app = require("./server/app"),
  port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`The server is runing on http://127.0.0.1:${port}`)
);
