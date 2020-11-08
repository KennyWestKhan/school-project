const userSettings = require("../../models/setting");
const mongoose = require("mongoose");
const { userIsAuth } = require("../../shared");

module.exports = function (router) {
	router.get("/userSettings", function (req, res, next) {
		const resp = userIsAuth(req, res);
		if (!resp.auth) {
			return res.status(401).json({
				message: resp.message,
			});
		}
		const userId = resp.data._id;

		const qry = {
			userId: mongoose.Types.ObjectId(userId),
		};
		userSettings
			.findOne(qry, { _id: 0, __v: 0 })
			.exec()
			.then((uSettings) => {
				if (uSettings) {
					res
						.status(200)
						.json({ message: "User settings", settings: uSettings });
				} else {
					res.status(404).json({ message: "No user settings" });
				}
			})
			.catch((err) =>
				res.status(500).json({
					message: "Error finding settings for user",
					error: err,
				})
			);
	});

	router.post("/userSettings/", async function (req, res) {
		const resp = userIsAuth(req, res);
		if (!resp.auth) {
			return res.status(401).json({
				message: resp.message,
			});
		}
		const userId = resp.data._id;
		console.log("userId", userId);
		const {
			volume,
			rate,
			pitch,
			voice,
			pushNotifications,
			extractingLang,
		} = req.body;
		console.log(req.body);
		console.log(volume, rate, pitch, voice, pushNotifications);
		// console.log(req.body);
		const settingsBody = {
			userId: userId,
			userSettings: {
				extractingLang: extractingLang,
				speech: {
					rate: rate,
					volume: volume,
					pitch: pitch,
					voice: voice,
				},
				notifications: {
					pushNotifications: pushNotifications,
				},
			},
		};
		try {
			const query = { userId: userId };
			userSettings.findOneAndUpdate(
				query,
				settingsBody,
				{ upsert: true, useFindAndModify: false },
				function (err, doc) {
					console.log(doc);
					if (err) return res.status(500).json("error");

					res.status(200).json({ message: "User settings successfully saved" });
				}
			);
		} catch (error) {
			return res.status(400).json(error);
		}
	});
};
