const express = require("express");
const router = express.Router();
const livroController = require("../controllers/livroController");

router.get("/", livroController.getLivros);
router.post("/", livroController.postLivro);
router.delete("/:id", livroController.deleteLivro);
router.put("/:id", livroController.updateLivro);

module.exports = router;
