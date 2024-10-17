const { getUser, userEntry, logOut} = require("../controllers/user.controllers.js");
const { Router } = require("express");

const router = Router();


router.route("/user-entry").post( userEntry);

//secure
router.route("/getUser").post(getUser);
router.route("/logout").post(logOut)

module.exports = router;

