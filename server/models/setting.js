const mongoose = require("mongoose");

const sizeValidator = [
	function (value) {
		let testVal = value.trim();
		return testVal.length > 0 && testVal.length <= 50;
	},
	"{PATH} must be between 1 and 50 characters long",
];

const requiredStringValidator = [
	function (value) {
		let testVal = val.trim();
		return testVal.length > 0;
	},
	//custom error message
	"Please supply a value for {PATH}",
];
const settingsSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "userAccounts",
	},
	userSettings: {
		extractingLang: { type: String, default: "eng" },
		speech: {
			rate: { type: Number, default: 1 },
			volume: { type: Number, default: 10 },
			pitch: { type: Number, default: 1 },
			voice: { type: Number, default: 0 },
		},
		notifications: {
			pushNotifications: { type: Boolean, default: false },
		},
	},

	createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("userSettings", settingsSchema);
