const en = {
  server: "The server is working...",
  language: "English",
  ea: "Authentication failed. Please login with valid credentials.",
  ce: "Please check your information and try again",
  exist: "Already exists",
  exist_number: "Check phone numbers",
  unknown_error: "Something unexpected happened",
  employees_maximum: "The number of employees is maximum",
  images_maximum: "The number of images is maximum",
  image_type_error: "The image you entered is invalid",
  used_password: "Please enter a password that you have not used before",
  updated: "updated successfully",
  not_found: "Not found",
  password_not_correct:
    "Authentication failed. Please login with valid credentials.",
  mc_check: "Check the membership code",
  register_msgSubject: "Create new account",
  forgot_msgSubject: "Password reset request",
  msgDesc: "- Here is your verification code :",
  msgNote: "Please make sure you never share this code with anyone.",
  privacy: "Privacy policy",
  conditions: `Terms &amp; Conditions`,
  mc_msgSubject: "Request a membership code",
  mc_msgDesc: "- Here is your membership code :",
  mc_change_msg:
    "You have a membership code for this email. If you want to change it, you must first delete the previous code and then create a new code.",
  deleted: "Deleted successfully",
  empty_services: "Sorry, this service is not available yet",
  saleMsg: "Successfully sold, awaiting verification",
  buyMsg: "Purchase completed successfully, awaiting verification",
  tryagain: "try again",
  bill_amount_error:
    "The bill amount you entered is incorrect. Please enter the correct number to avoid blocking your account and losing your points.",
};
module.exports = en;

/*
module.exports = {
  AUTHENTICATION_FAILED: {
    code: 400,
    message: "Authentication failed. Please login with valid credentials.",
    success: false,
  },
  SUCCESSFUL_LOGIN: {
    code: 200,
    message: "Successfully logged in",
    success: true,
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: "Something unexpected happened",
    success: false,
  },
  UNAUTHORIZED: {
    code: 401,
    message: "Your session has expired. Please login again",
    success: false,
  },
  SUCCESSFUL_DELETE: {
    code: 200,
    message: "Successfully deleted",
    success: true,
  },
  SUCCESSFUL_UPDATE: {
    code: 200,
    message: "Updated successfully",
    success: true,
  },
  SUCCESSFUL: {
    code: 200,
    success: true,
    message: "Successfully completed",
  },
  NOT_FOUND: {
    code: 404,
    success: true,
    message: "Requested API not found",
  },
  ALREADY_EXIST: {
    code: 200,
    success: true,
    message: "Already exists",
  },
  FORBIDDEN: {
    code: 403,
    message: "You are not authorized to complete this action",
    success: false,
  },
  BAD_REQUEST: {
    code: 400,
    message: "Bad request. Please try again with valid parameters",
    success: false,
  },
  IN_COMPLETE_REQUEST: {
    code: 422,
    message: "Required parameter missing",
    success: false,
  },
};
*/
