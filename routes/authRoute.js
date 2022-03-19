const router = require('express').Router();
const UserController = require("../controllers/user.controller");

const User = new UserController();

router.post('/', User.auth);
router.post('/reg', User.create);

module.exports = router;