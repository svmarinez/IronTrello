const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

app.use("/api/list", require("../api/list"));
app.use("/api/card", require("../api/card"));

module.exports = router;
