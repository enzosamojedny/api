const axios = require("axios");
const { Videogame, Genre } = require("../db");

const getQuery = async (req, res) => {
  try {
    const { name } = req.query;
    const limit = 15;
    const videogamesDb = await Videogame.findAll({
      where: { name },
      include: Genre,
    });
    if (videogamesDb.length) {
      res.send(videogamesDb);
      return;
    }
    const videogamesApi = await axios.get(
      `https://api.rawg.io/api/games?search=${name}&key=91fecabb447e4d87bd14d72b6901ca7c&page_size=${limit}`,
      {
        params: {
          search: name,
        },
      }
    );
    const allVideogames = [...videogamesDb, ...videogamesApi.data.results].map(
      (allVideogame) => {
        return {
          id: allVideogame.id,
          name: allVideogame.name,
          description: allVideogame?.description,
          platforms: allVideogame.platforms.map((plat) => plat.platform.name),
          background_image: allVideogame.background_image,
          released: allVideogame.released,
          rating: allVideogame.rating,
          genres: allVideogame.genres.map((genr) => genr.name),
        };
      }
    );

    if (videogamesApi.data.results.length === 0) {
      throw new Error("No videogame found");
    } else {
      res.status(200).send(allVideogames);
      return;
    }
  } catch (error) {
    res.status(403).json({ error: "The name you entered is not available" });
  }
};

module.exports = {
  getQuery,
};
