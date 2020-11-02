const express = require("express");
const router = express.Router();

require("./routes/profile")(router);
require("./routes/settings")(router);
require("./routes/docs")(router);

module.exports = router;
