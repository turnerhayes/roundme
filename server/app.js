const express = require("express");
const path = require("path");
// const favicon = require("static-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const hbs = require("express-hbs");

const routes = require("./routes/index");

const app = express();

const TEMPLATES_DIR = path.resolve(__dirname, "views");

const IS_DEVELOPMENT = !app.get("env") || app.get("env") === "development";

// view engine setup
app.set("views", TEMPLATES_DIR);

app.engine(
	"hbs",
	hbs.express4({
		"partialsDir": TEMPLATES_DIR,
		"layoutsDir": TEMPLATES_DIR,
	})
);

app.set("view engine", "hbs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
app.use(cookieParser());
app.use("/static/", express.static(path.join(__dirname, "..", "client")));
app.use(
	"/static/fonts/font-awesome",
	express.static(
		// Need to do this ugly resolve; using requre.resolve() doesn't seem to work,
		// possibly because the font-awesome package contains no main entry or index.js,
		// so Node treats it as not a package.
		path.resolve(__dirname, "..", "node_modules", "font-awesome", "fonts"),
		{
			"fallthrough": false
		}
	)
);

app.use("/", routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// error handlers

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render("error", {
		"message": err.message,
		"error": IS_DEVELOPMENT ? err : {}
	});
});


module.exports = app;
