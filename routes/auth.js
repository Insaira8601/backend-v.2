const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
	try {
		//generate new password
		console.log(req.body)
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		const emailLowerCase = await req.body.email.toLowerCase();

		//create new user
		const newUser = new User({
			username: req.body.username,
			email: emailLowerCase,
			password: hashedPassword,
		});

		//save user and respond
		const user = await newUser.save();

		res.status(200).json({
			...user,
			code: 'OK'
		});
	} catch (err) {
		res.status(500).json({
			...err,
			code: 'error'
		});
	}
});

//LOGIN
router.post("/login", async (req, res) => {
	try {
		console.log(req.body);
		const user = await User.findOne({email: req.body.email.toLowerCase(),
		});

		if (!user) {
			res.status(404).json({
				code: "error",
				error: "user not found"
			});
		} else {
			const validPassword = await bcrypt.compare(
				req.body.password,
				user.password
			);
			if (!validPassword) {
				res.status(400).json({
					code: 'error',
					error: "wrong password"
				});
			} else {
				res.status(200).json({
					...user,
					code: 'OK'
				});
			}
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
