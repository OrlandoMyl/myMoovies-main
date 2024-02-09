const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mooviesRoutes = require("./src/routes/moovies");
const categoryRoutes = require("./src/routes/category");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

app.use("/moovies", mooviesRoutes);
app.use("/category", categoryRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
