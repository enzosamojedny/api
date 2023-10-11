const axios = require("axios");
const { Videogame, Genre } = require("../db");

const getGame = async (_req, res) => {
  try {
    const limitFirstPage = 33;
    const limitSecondPage = 33;
    const limitThirdPage = 34;
    const [
      videogamesDb,
      videogamesApiFirstPage,
      videogamesApiSecondPage,
      videogamesApiThirdPage,
    ] = await Promise.all([
      Videogame.findAll({
        include: {
          model: Genre,
          as: "genres",
          attributes: ["name"],
          through: {
            attributes: [],
          },
          order: [["ASC"]],
        },
      }),
      axios.get(
        `https://api.rawg.io/api/games?key=91fecabb447e4d87bd14d72b6901ca7c&page_size=${limitFirstPage}`
      ),
      axios.get(
        `https://api.rawg.io/api/games?key=91fecabb447e4d87bd14d72b6901ca7c&page=2&page_size=${limitSecondPage}`
      ),
      axios.get(
        `https://api.rawg.io/api/games?key=91fecabb447e4d87bd14d72b6901ca7c&page=3&page_size=${limitThirdPage}`
      ),
    ]);
    const dbGenres = videogamesDb.map((game) => ({
      ...game.toJSON(),
      genres: game.genres.map((genre) => genre.name),
    }));
    const apiGamesToObjects = (apiGames) => {
      return apiGames.map((allVideogame) => ({
        id: allVideogame.id,
        name: allVideogame.name,
        description: allVideogame?.description || "No description available",
        platforms:
          allVideogame.platforms?.map((platform) => platform.platform.name) ||
          [],
        background_image: allVideogame.background_image,
        released: allVideogame.released,
        rating: allVideogame.rating,
        genres: allVideogame.genres?.map((genre) => genre.name) || [],
      }));
    };
    const allVideogames = [
      ...dbGenres,
      ...apiGamesToObjects(videogamesApiFirstPage.data.results),
      ...apiGamesToObjects(videogamesApiSecondPage.data.results),
      ...apiGamesToObjects(videogamesApiThirdPage.data.results),
    ];
    const uniqueGames = allVideogames.reduce((acc, game) => {
      if (!acc.find((g) => g.id === game.id)) {
        acc.push(game);
      }
      return acc;
    }, []);
    return res.send(uniqueGames);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getGame,
};
