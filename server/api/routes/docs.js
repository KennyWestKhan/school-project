const mongoose = require("mongoose");
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = multer({ storage: storage })

const userDocuments = require("../../models/document");
const fileDocuments = require("../../models/file");
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
			.populate('fileId')
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
	router.get("/search/:query", function (req, res) {
		const resp = userIsAuth(req, res);
		if (!resp.auth) {
			return res.status(401).json({
				message: resp.message,
			});
		}
		const searchQuery = req.params.query;
		userDocuments
			.find({ userId: mongoose.Types.ObjectId(userId), $text: { $search: searchQuery } }, { userId: 0, __v: 0 })
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
		userDocuments
			.find(qry, { userId: 0, __v: 0 })
			.populate('fileId')
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
	router.post("/document", upload.single("file") , async function (req, res, next) {

		const resp = userIsAuth(req, res);
		if (!resp.auth) {
			return res.status(401).json({
				message: resp.message,
			});
		}

		try {
			const userId = resp.data._id;

			const fileInfo = await fileDocuments.create({userId, metadata: req.file });

			if(fileInfo){
				console.log({fileInfo})
				const { documentData } = req.body;
				const { extractedText, caption, title, status } = JSON.parse(documentData)

				const docsBody = {
					userId,
					fileId: fileInfo._id,
					extractedText,
					public: status === "Public",
					title: {
						name: title,
						caption: caption,
					},
				};
				await userDocuments.create(docsBody, function (err, userDocument) {
					console.log({err});
					if (err) return res.status(500).json("error saving document");
					res.status(200).json({ message: "User documents successfully saved" });
				});
			}else {
				return res.status(500).json("error saving file");
			}
			
		} catch (error) {
			console.log({error})
			return res.status(400).json(error);
		}
	});
};
