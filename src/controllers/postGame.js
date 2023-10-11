const { Videogame, Genre } = require("../db");

const postGame = async (req, res) => {
  try {
    const {
      name,
      description,
      platforms,
      background_image,
      released,
      rating,
      genres,
    } = req.body;
    const genresFromDB = await Genre.findAll({ where: { name: genres } });

    const createVideogame = await Videogame.create({
      name,
      description,
      platforms,
      background_image,
      released,
      rating,
    });
    await createVideogame.addGenres(genresFromDB);

    res.status(201).json(createVideogame);
  } catch (error) {
    res.status(404).json({ error: "Data missing to create a new videogame" });
  }
};

module.exports = { postGame };
