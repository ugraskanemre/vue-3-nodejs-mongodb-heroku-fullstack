const express = require("express");
const serveStatic = require("serve-static");
const path = require('path');
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config");
const loaders = require("./loaders");
const events = require("./scripts/events");
const { UserRoutes, TickerRoutes } = require('./routes');


config();
loaders();
events();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({
    origin: "*",
    methods: "*"
}));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    app.use('/users', UserRoutes);
    app.use('/tickers', TickerRoutes);


    if (process.env.NODE_ENV != "development") {
        app.use(express.static(__dirname + '/public/'));

        app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
    }
});