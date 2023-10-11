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
    const existingVideogame = await Videogame.findOne({ where: { name } });

    if (existingVideogame) {
      const existingGenres = await Genre.findAll({ where: { name: genres } });

      await existingVideogame.setGenres(existingGenres);

      return res.status(200).json(existingVideogame);
    }

    const createdVideogame = await Videogame.create({
      name,
      description,
      platforms,
      background_image,
      released,
      rating,
    });

    const existingGenres = await Genre.findAll({ where: { name: genres } });

    await createdVideogame.addGenres(existingGenres);

    return res.status(201).json(createdVideogame);
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Missing data to create a new videogame" });
  }
};

module.exports = {
  postGame,
};
