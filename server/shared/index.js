const isEmpty = require("lodash.isempty");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const processEmptyRequest = (req, res, msg) => {
	if (isEmpty(req.body)) {
		msg = msg || "Payload can't be empty";
		console.log(msg);
		res.status(204).json({
			message: msg,
		});
	}
};

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
exports.isAuthReq = isAuthReq;
exports.verifyToken = verifyToken;
exports.generateJWTToken = generateJWTToken;
exports.processEmptyReq = processEmptyRequest;
exports.handleErrorResponse = handleErrorResponse;
