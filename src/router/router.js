const router = require("express").Router(),
  {
    serverStatus,
    privacy_policy,
    terms_conditions,
  } = require("../controller/controller"),
  path = "/app",
  pay = path + "/pay",
  mcPath = path + "/mc",
  agentsPath = path + "/agents",
  servicesPath = path + "/services",
  employeesPath = path + "/employees",
  usersPath = path + "/users",
  privacyPath = path + "/privacy",
  conditionsPath = path + "/conditions";

router.get(path, serverStatus);
router.get(privacyPath, privacy_policy);
router.get(conditionsPath, terms_conditions);
module.exports = {
  router,
  path,
  agentsPath,
  employeesPath,
  servicesPath,
  usersPath,
  mcPath,
  pay,
};
