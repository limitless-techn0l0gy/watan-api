const router = require("express").Router(),
  {
    serverStatus,
    privacy_policy,
    terms_conditions,
  } = require("../controller/controller"),
  path = "/app",
  admin = path + "/admin",
  pay = path + "/pay",
  mcPath = path + "/mc",
  agentsPath = path + "/agents",
  servicesPath = path + "/services",
  employeesPath = path + "/employees",
  usersPath = path + "/users",
  cashing = path + "/cashing",
  privacyPath = path + "/privacy",
  conditionsPath = path + "/conditions";

router.get("/", serverStatus);
router.get(privacyPath, privacy_policy);
router.get(conditionsPath, terms_conditions);
module.exports = {
  router,
  path,
  admin,
  agentsPath,
  employeesPath,
  servicesPath,
  usersPath,
  mcPath,
  pay,
  cashing,
};
