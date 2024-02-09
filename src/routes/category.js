const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");

router.get("/", CategoryController.findAll);
router.get("/:id", CategoryController.find);
router.post("/", CategoryController.create);
router.put("/", CategoryController.update);
router.delete("/:id", CategoryController.delete);

module.exports = router;
