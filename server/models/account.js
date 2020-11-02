const mongoose = require("mongoose");

const sizeValidator = [
	function (value) {
		let testVal = value.trim();
		return testVal.length > 0 && testVal.length <= 50;
	},
	"{PATH} must be between 1 and 50 characters long",
];

const passwordValidator = [
	function (value) {
		return true;
	},
];

const emailValidator = [
	function (value) {
		return true;
	},
];
const today = new Date();
const accountSchema = new mongoose.Schema({
	created: { type: Date, required: true, default: today },
	profilePicture: { type: String },
	age: { type: Number, required: true },
	username: { type: String, required: true, validate: sizeValidator },
	usage: { type: String, required: true, validate: sizeValidator },
	email: { type: String, required: true, validate: emailValidator },
	password: { type: String, required: true, validate: passwordValidator },
	isActive: { type: Boolean, required: true, default: true },
	isLoggedIn: { type: Boolean, default: false },
});

module.exports = mongoose.model("userAccount", accountSchema);
