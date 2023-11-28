require("./config/db");
require("dotenv").config();
const express = require("express"),
  body_parser = require("body-parser"),
  cors = require("cors"),
  app = express(),
  membershipcodesRouter = require("./router/membershipcodes.router"),
  agentRouter = require("./router/agents.router"),
  serviceRouter = require("./router/services.router"),
  employeesRouter = require("./router/employees.router"),
  usersRouter = require("./router/users.router"),
  zaincashRouter = require("./utils/zaincash"),
  {
    router,
    agentsPath,
    employeesPath,
    servicesPath,
    usersPath,
    mcPath,
    pay,
  } = require("./router/router");
// Middleware :
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/img", express.static(__dirname + "/public/img"));
app.use("/image", express.static(__dirname + "/storages/images"));
app.set("views", "./src/public/views");
app.set("view engine", "ejs");
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false, limit: "100mb" }));
app.use(process.env.STATIC_ROUTE, router);
app.use(usersPath, usersRouter);
app.use(mcPath, membershipcodesRouter);
app.use(agentsPath, agentRouter);
app.use(employeesPath, employeesRouter);
app.use(servicesPath, serviceRouter);
app.use(pay,zaincashRouter);
app.use((req, res) => {
  res.status(404).render("404");
});
module.exports = app;
