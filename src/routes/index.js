const { Router } = require("express");
const { getGame } = require("../controllers/getGame");
const { getGenre } = require("../controllers/getGenre");
const { getId } = require("../controllers/getId");
const { getQuery } = require("../controllers/getQuery");
const { postGame } = require("../controllers/postGame");

// Ejemplo: const authRouter = require('./auth.js');

const router = Router();
router.get("/videogames", getGame);
router.get("/videogames/name", getQuery);
router.post("/videogames", postGame);
router.get("/videogames/:idVideogame", getId);
router.get("/genres", getGenre);
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

module.exports = router;
