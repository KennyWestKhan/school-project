const mongoose = require("mongoose");

const filesSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "userAccounts",
	},
	metadata: { type: Object },
	createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("userFiles", filesSchema);
