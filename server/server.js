//Load env
require("dotenv").config({ path: "config.env" });

const express = require("express");
const app = express();
const api = require("./api");
const { logErrors, getDeviceIp } = require("./shared");
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
const connectionPath = `mongodb://${process.env.DB_HOST}:${dbport}/${process.env.DB_NAME}`;
const remoteConnectionPath =
	"mongodb+srv://kenny:Pideck98@panoptes.k3xpc.mongodb.net/panoptes";
let path = connectionPath;
let host = "localhost";
if (false) {
	path = remoteConnectionPath;
	host = getDeviceIp();
}

console.info("connection path " + path);
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
	.connect(`${path}`, {
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
	const server = app.listen(port, host, function () {
		console.log("API SERVER LISTENING ON PORT " + app.get("port") + "!");
		console.log("API HOSTNAME " + server.address().address + "!");
	});
});
