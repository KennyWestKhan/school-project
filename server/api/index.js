const express = require("express");
const router = express.Router();

require("./routes/profile")(router);

module.exports = router;
