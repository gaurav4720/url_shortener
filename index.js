const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectToMongoDb = require('./connection');

const routeURL = require('./routes/url');
const userRoute = require('./routes/user');
const staticRouter = require('./routes/staticRouter');

const URL = require('./models/url');

const { restrictToLoggedInUserOnly, checkAuth } = require('./middlewares/auth');

const app = express();
const PORT = 8000;

connectToMongoDb('mongodb://127.0.0.1:27017/short_url').then(() => { console.log("MongoDB Connected") });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggedInUserOnly, routeURL);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRouter);

app.use("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({ shortId }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            }
        }
    })
    if(entry)
        res.redirect(entry.redirectUrl);
})

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})