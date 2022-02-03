const express = require("express");
const session = require("express-session");
const mustacheExpress = require("mustache-express");

const postsRouter = require("./routes/posts");
const getSecretKey = require("./util/getSecretKey");
const secretKey = getSecretKey();
const PORT = process.env.PORT || 3000;

const app = express();

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(
    session({
        secret: secretKey,
        saveUninitialized: true,
        resave: true
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));
app.use("/posts", postsRouter);

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
