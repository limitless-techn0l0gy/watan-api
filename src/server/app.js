require("dotenv").config();
const express = require("express"),
  body_parser = require("body-parser"),
  cors = require("cors"),
  passport = require("passport"),
  cookieSession = require("cookie-session"),
  passportSetup = require("../passport/setup"),
  app = express(),
  connect = require("../config/db"),
  router = require("../router/users.router"),
  membershipcodesRouter = require("../router/membershipcodes.router"),
  agentrouter = require("../router/agents.router"),
  servicerouter = require("../router/services.router"),
  employeesRouter = require("../router/employees.router"),
  userModel = require("../model/users.model"),
  agentModel = require("../model/agents.model"),
  serviceModel = require("../model/services.model"),
  employeesModel = require("../model/employees.model"),
  membershipcodesModel = require("../model/membershipcodes.model");
app.use(
  cookieSession({
    name: "session",
    keys: ["watan"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: "https://watan.pro",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false, limit: "50mb" }));
app.use("/users", router);
app.use("/MC", membershipcodesRouter);
app.use("/agents", agentrouter);
app.use("/employees", employeesRouter);
app.use("/services", servicerouter);
module.exports = app;
// https://www.youtube.com/watch?v=pdd04JzJrDw