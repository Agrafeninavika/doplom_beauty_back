const express = require("express");
const app = express();
const path = require("path");

const setCache = {
    setHeaders: function (res)  {
        res.set({
            'Cashe-Control' : (path.includes('index.html')) ? 'no-store' : 'public, max-age=3600'
        });
    }
}

app.use(express.static(
    path.join(_dirname,"public"), setCache)

);

app.listen(8080, () => {
    console.log("Server started at 8080");
});