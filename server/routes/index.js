const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.render(
		"index",
		{
			"title": "RoundMe"
		}
	);
});

router.get("*", (req, res, next) => {
	if (req.accepts(["html", "json"]) === "html") {
		res.redirect("/");
		return;
	}
	
	next();
});

module.exports = router;
