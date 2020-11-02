//Load env
require("dotenv").config({ path: "config.env" });
// console.log(process.env);
const express = require("express");
const app = express();
const api = require("./api");
const logErrors = require("./shared");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

// function logErrors(err, req, res, next) {
// 	console.error(err.stack);
// 	next(err);
// }

app.use(cors());
const port = process.env.SERVER_PORT || 8085;
const dbport = process.env.DB_PORT || 27018;
const connectionPath = `${process.env.DB_HOST}:${dbport}/${process.env.DB_NAME}`;
console.info("connection path " + connectionPath);
app.set("port", port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", api);

app.use(express.static("static"));

app.use(morgan("dev"));

app.use(function (req, res, next) {
	const err = new Error("Endpoint not found");
	err.status = 404;
	res.status(404).json(err);
});

const mongoose = require("mongoose");
mongoose
	.connect(`mongodb://${connectionPath}`, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => console.log("DB Connected!"))
	.catch((err) => {
		console.log(`DB Connection Error: ${err.message}`);
	});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () {
	console.log("mongodb open");
	app.listen(port, function () {
		console.log("API SERVER LISTENING ON PORT " + app.get("port") + "!");
	});
});
