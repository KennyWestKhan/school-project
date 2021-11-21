const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "userAccounts",
	},
	fileId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "userFiles",
	},
	extractedText: { type: String, required: true },
	public: { type: Boolean, default: false },
	title: {
		name: { type: String },
		caption: { type: String },
	},
	deleted: { type: Boolean, default: false },
	modified: { type: Boolean, default: false },
	createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("documents", documentSchema);
