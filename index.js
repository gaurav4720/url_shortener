const express = require('express');
const connectToMongoDb = require('./connection');
const routeURL = require('./routes/url');
const URL = require('./models/url');

const app = express();
const PORT = 8000;

connectToMongoDb('mongodb://127.0.0.1:27017/short_url').then(() => { console.log("MongoDB Connected") });

app.use(express.json());

app.use("/url", routeURL);

app.use("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({ shortId }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            }
        }
    })
    res.redirect(entry.redirectUrl);
})

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})