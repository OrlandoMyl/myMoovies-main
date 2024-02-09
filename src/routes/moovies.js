const express = require('express');
const router = express.Router();
const MooviesController = require("../controllers/MooviesController");

router.get("/", MooviesController.findAll);
router.get("/:id", MooviesController.find);
router.post("/", MooviesController.create);
router.put("/", MooviesController.update);
router.delete("/:id", MooviesController.delete);


module.exports = router;
