require("./config/db");
require("dotenv").config();
const express = require("express"),
  body_parser = require("body-parser"),
  cors = require("cors"),
  app = express(),
  router = require("./router/users.router"),
  membershipcodesRouter = require("./router/membershipcodes.router"),
  agentrouter = require("./router/agents.router"),
  servicerouter = require("./router/services.router"),
  employeesRouter = require("./router/employees.router");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false, limit: "50mb" }));
app.use("/users", router);
app.use("/MC", membershipcodesRouter);
app.use("/agents", agentrouter);
app.use("/employees", employeesRouter);
app.use("/services", servicerouter);
module.exports = app;
