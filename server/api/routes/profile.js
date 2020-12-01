const userAccount = require("../../models/account");
const userSettings = require("../../models/setting");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
	checkIfEmpty,
	handleErrorResponse,
	generateJWTToken,
	isAuthReq,
} = require("../../shared");

module.exports = function (router) {
	router.get("/verifyAuth", function (req, res, next) {
		const token = req.headers.authorization;
		if (token == null) {
			res.status(401).json({
				message: "No token supplied",
			});
		}
		try {
			const resp = isAuthReq(token);
			if (resp.authenticated) {
				const userDetails = {
					_id: resp._id,
					firstName: resp.firstName,
					lastName: resp.lastName,
					email: resp.email,
					username: resp.username,
				};
				let newToken = generateJWTToken(userDetails);
				const authenticationRes = {
					isAuthenticated: resp.authenticated,
					tokenExpiry: resp.exp,
					message: "Token verified",
					userDetails: userDetails,
					token: newToken,
				};
				res.status(200).json(authenticationRes);
			} else {
				res.status(401).json({ message: "Token expired" });
			}
		} catch (error) {
			res.status(401).json(error);
		}
	});

	router.post("/register", function (req, res, next) {
		//check if req body is empty
		const isEmpty = checkIfEmpty(
			req.body,
			res,
			next,
			"send request body to register"
		);
		if (isEmpty) {
			return;
		}
		const memberData = {
			username: req.body.username,
			age: req.body.age,
			usage: req.body.usage,
			email: req.body.email,
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
								const userId = member._id;
								const { usage, email, username } = member;
								const settingsBody = {
									userId: userId,
									userSettings: {},
								};
								try {
									let settings = new userSettings(settingsBody);
									settings.save(function (err, settings) {
										if (err) {
											return res.status(400).json(err);
										}
										const userDetails = {
											_id: userId,
											usage: usage,
											email: email,
											username: username,
										};
										let newToken = generateJWTToken(userDetails);
										res.status(200).json({
											token: newToken,
											message: `${member.username}'s account has been registered!`,
										});
									});
								} catch (error) {
									console.log(error);
								}
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
	router.post("/login", function (req, res, next) {
		//check if req body is empty
		if (!checkIfEmpty(req.body, res, next, "send request body to login")) {
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
							res.status(404).json({ message: "Incorrect credential" });
						}
					} else {
						res.status(404).json({ message: "User doesn't exist" });
					}
				})
				.catch((error) => {
					const payload = { err: error, res: res, status: 404 };
					handleErrorResponse(payload);
				});
		}
	});
};
