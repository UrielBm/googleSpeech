const express = require("express");
const router = express.Router();
const audioController = require("../controller/audioController");
const IntanceAudioController = new audioController();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.post("/audio", (req, res, next) => {
  IntanceAudioController.GetAudio(req, res, next);
});

module.exports = router;
