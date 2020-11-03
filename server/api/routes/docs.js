const mongoose = require("mongoose");
const userDocuments = require("../../models/document");
const { userIsAuth } = require("../../shared");

module.exports = function (router) {
	router.delete("/document/:docId", function (req, res) {
		const resp = userIsAuth(req, res);
		if (!resp.auth) {
			return res.status(401).json({
				message: resp.message,
			});
		}
		const documentId = req.params.docId;
		console.log("docid ", req.params.docId);
		if (!documentId) {
			return res.status(404).json({ message: "Invalid doc id" });
		}
		const qry = {
			_id: mongoose.Types.ObjectId(documentId),
		};
		try {
			userDocuments.findOneAndRemove(
				documentId,
				{ useFindAndModify: false },
				function (err, deleteResponse) {
					if (err)
						res.status(404).json({ message: "Couldn't delete document" });
					console.log(err);
					res.status(200).json({
						message: `${deleteResponse.title.name} has been deleted`,
					});
				}
			);
		} catch (error) {
			console.log(error);
			res.status(404).json({ message: "Error deleting document" });
		}
	});
	router.get("/document/:id", function (req, res, next) {
		const resp = userIsAuth(req, res);
		if (!resp.auth) {
			return res.status(401).json({
				message: resp.message,
			});
		}
		const documentId = req.params.id;
		const qry = {
			_id: mongoose.Types.ObjectId(documentId),
		};
		userDocuments
			.findOne(qry, { userId: 0, __v: 0 })
			.exec()
			.then((userDoc) => {
				if (userDoc) {
					res
						.status(200)
						.json({ message: "User document", documentDetails: userDoc });
				} else {
					res.status(404).json({ message: "No info on document" });
				}
			})
			.catch((err) =>
				res.status(500).json({
					message: "Error finding info for document",
					error: err,
				})
			);
	});
	router.get("/documents", function (req, res, next) {
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
		console.log("userid ", userId);
		userDocuments
			.find(qry, { userId: 0, __v: 0 })
			.sort([["createdOn", -1]])
			.exec()
			.then((userDocs) => {
				if (userDocs && userDocs.length > 0) {
					res
						.status(200)
						.json({ message: "User documents", documents: userDocs });
				} else {
					res.status(404).json({ message: "No user documents" });
				}
			})
			.catch((err) =>
				res.status(500).json({
					message: "Error finding documents for user",
					error: err,
				})
			);
	});
	router.post("/document", function (req, res, next) {
		const resp = userIsAuth(req, res);
		if (!resp.auth) {
			return res.status(401).json({
				message: resp.message,
			});
		}
		const userId = resp.data._id;
		const { extractedText, caption, title, status } = req.body;

		const docsBody = {
			userId: userId,
			// fileId: "345567890",
			extractedText: extractedText,
			public: status === "Public",
			title: {
				name: title,
				caption: caption,
			},
		};
		console.log(docsBody);
		try {
			const query = { userId: userId };
			userDocuments.create(docsBody, function (err, doc) {
				// console.log(err);
				console.log(doc);
				if (err) return res.status(500).json("error");
				res.status(200).json({ message: "User documents successfully saved" });
			});
		} catch (error) {
			return res.status(400).json(error);
		}
	});
};
