const userAccount = require("../../models/account");
const bcrypt = require("bcrypt");
const {
	processEmptyReq,
	handleErrorResponse,
	generateJWTToken,
	isAuthReq,
} = require("../../shared");

module.exports = function (router) {
	router.get("/verifyAuth", function (req, res) {
		const token = req.headers.authorization;
		if (token == null) {
			res.status(401).json({
				message: "No token supplied",
			});
		}
		try {
			const resp = isAuthReq(token);
			const authenticationRes = {
				isAuthenticated: resp.authenticated,
				tokenExpiry: resp.exp,
				message: "Token verified",
				userDetails: {
					id: resp._id,
					firstName: resp.firstName,
					lastName: resp.lastName,
					email: resp.email,
					username: resp.username,
				},
				token: token,
			};
			console.log("verifyAuth");
			if (resp.authenticated) {
				res.status(200).json(authenticationRes);
			} else {
				res.status(401).json(resp);
			}
		} catch (error) {
			res.status(401).json(error);
		}
	});

	router.post("/register", function (req, res) {
		//check if req body is empty
		processEmptyReq(req, res, "send request body to register");
		const memberData = {
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			profilePicture: req.body.profilePicture,
			password: req.body.password,
		};
		userAccount
			.findOne({
				username: req.body.username,
			})
			.then((userDB) => {
				if (!userDB) {
					bcrypt.hash(req.body.password, 10, (err, hash) => {
						memberData.password = hash;
						userAccount
							.create(memberData)
							.then((member) => {
								res.status(200).json({
									message: `${member.username}'s account has been registered!`,
								});
							})
							.catch((error) => {
								const payload = { err: error, res: res, status: 504 };
								handleErrorResponse(payload);
							});
					});
				} else {
					const payload = {
						res: res,
						status: 409,
						msg: `${memberData.username}'s account already exists!`,
					};
					handleErrorResponse(payload);
				}
			})
			.catch((error) => {
				const payload = { err: error, res: res, status: 409 };
				handleErrorResponse(payload);
			});
	});
	router.post("/login", function (req, res) {
		//check if req body is empty
		processEmptyReq(req, res, "send request body to login");
		console.log("username " + req.body.username);
		userAccount
			.findOne(
				{
					username: req.body.username,
				},
				{ isLoggedIn: 0, created: 0 }
			)
			.then((userDB) => {
				console.log(userDB);
				if (userDB) {
					if (bcrypt.compareSync(req.body.password, userDB.password)) {
						const payload = {
							_id: userDB._id,
							firstName: userDB.firstName,
							lastName: userDB.lastName,
							email: userDB.email,
							username: userDB.username,
						};
						let token = generateJWTToken(payload);
						const status = 200;
						res.status(status).json({
							status: status,
							message: "Login successful",
							token: token,
						});
					} else {
						res.status(404).json({ message: "Incorrect password" });
					}
				} else {
					res.status(404).json({ message: "User doesn't exist" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	});
};
