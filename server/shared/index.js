const isEmpty = require("lodash.isempty");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { networkInterfaces } = require("os");

function getDeviceIp() {
	const nets = networkInterfaces();
	const results = Object.create(null); // or just '{}', an empty object

	for (const name of Object.keys(nets)) {
		for (const net of nets[name]) {
			// skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
			if (net.family === "IPv4" && !net.internal) {
				if (!results[name]) {
					results[name] = [];
				}

				results[name].push(net.address);
			}
		}
	}
	return results.en0[0];
}

const checkIfEmpty = (body, res, next, msg) => {
	if (isEmpty(body)) {
		msg = msg || "Payload can't be empty";
		next(msg);
		return true;
	} else {
		return false;
	}
};

function logErrors(err, req, res, next) {
	console.error(err.stack);
	next(err);
}

const handleErrorResponse = (params) => {
	let { err, res, msg, status } = params;
	msg = msg || "An error occurred";
	status = status || 500;
	err = err || false;
	res.status(status).json({
		message: msg,
		error: err,
	});
};

const getHashedPassword = (password) => {
	const sha256 = crypto.createHash("sha256");
	const hash = sha256.update(password).digest("base64");
	return hash;
};

const generateJWTToken = (userData) => {
	return jwt.sign(userData, process.env.JWT_SECRET_KEY, { expiresIn: "1800s" });
};
const verifyToken = (jwtToken) => {
	try {
		const res = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
		res.authenticated = true;
		return res;
	} catch (error) {
		error.authenticated = false;
		return error;
	}
};

const isAuthReq = (sessionID) => {
	if (sessionID) {
		return verifyToken(sessionID);
	} else {
		return false;
	}
};

function userIsAuth(req, res) {
	const token = req.headers.authorization;
	let auth = false;
	// console.info("token " + token);
	if (token == null) {
		return {
			auth: auth,
			message: "No token supplied",
		};
	}
	const resp = isAuthReq(token);
	if (!resp.authenticated) {
		return {
			auth: auth,
			message: "Token expired",
		};
	}

	return {
		auth: true,
		data: resp,
	};
}
const retrieveToken = (request) => {
	if (request) {
		return request.headers.authorization;
	}
	return "No token supplied";
};

function handleCors(req, res, callback) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE,OPTIONS"
	);
	res.setHeader("Access-Control-Allow-Headers", "Authorization");

	// CORS OPTIONS request, simply return 200
	if (req.method == "OPTIONS") {
		res.statusCode = 200;
		res.end();
		callback.onOptions();
		return;
	}
}
exports.isAuthReq = isAuthReq;
exports.verifyToken = verifyToken;
exports.generateJWTToken = generateJWTToken;
exports.checkIfEmpty = checkIfEmpty;
exports.handleErrorResponse = handleErrorResponse;
exports.retrieveToken = retrieveToken;
exports.logErrors = logErrors;
exports.userIsAuth = userIsAuth;
exports.handleCors = handleCors;
exports.getDeviceIp = getDeviceIp;
