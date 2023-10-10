const axios = require("axios");
const { Videogame, Genre } = require("../db");

const getGame = async (_req, res) => {
  try {
    const limit = 33;

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
        `https://api.rawg.io/api/games?key=91fecabb447e4d87bd14d72b6901ca7c&page_size=${limit}`
      ),
      axios.get(
        `https://api.rawg.io/api/games?key=91fecabb447e4d87bd14d72b6901ca7c&page=2&page_size=${limit}`
      ),
      axios.get(
        `https://api.rawg.io/api/games?key=91fecabb447e4d87bd14d72b6901ca7c&page=3&page_size=${limit}`
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
// const axios = require("axios");
// const { Videogame, Genre } = require("../db");

// const getGame = async (_req, res) => {
//   const limit = 100;

// try {
//   const [
//     videogamesDb,
//     videogamesApiPage1,
//     videogamesApiPage2,
//     videogamesApiPage3,
//   ] = await Promise.all([
//     Videogame.findAll({
//       model: Genre,
//       as: "genres",
//       attributes: ["name"],
//       through: {
//         attributes: [],
//       },
//     }),
//     axios.get(
//       `https://api.rawg.io/api/games?key=91fecabb447e4d87bd14d72b6901ca7c&page_size=${limit}`
//     ),
//     axios.get(
//       `https://api.rawg.io/api/games?key=91fecabb447e4d87bd14d72b6901ca7c&page=2&page_size=${limit}`
//     ),
//     axios.get(
//       `https://api.rawg.io/api/games?key=91fecabb447e4d87bd14d72b6901ca7c&page=3`
//     ),
//   ]);
//   const dbGenres = videogamesDb.map((game) => ({
//     ...game.toJSON(),
//     genres: game.genres.map((genre) => genre.name),
//   }));
//   console.log(dbGenres);
//   const apiPage1Data = videogamesApiPage1.data.results;
//   const apiPage2Data = videogamesApiPage2.data.results;
//   const apiPage3Data = videogamesApiPage3.data.results;

//   const allVideogames = [
//     ...dbGenres,
//     ...apiPage1Data.map((allVideogame) => ({
//       id: allVideogame.id,
//       name: allVideogame.name,
//       description: allVideogame?.description || "No description available",
//       platforms:
//         allVideogame.platforms?.map((platform) => platform.platform.name) ||
//         [],
//       background_image: allVideogame.background_image,
//       released: allVideogame.released,
//       rating: allVideogame.rating,
//       genres: allVideogame.genres?.map((genre) => genre.name) || [],
//     })),
//     ...dbGenres,
//     ...apiPage2Data.map((allVideogame) => ({
//       id: allVideogame.id,
//       name: allVideogame.name,
//       description: allVideogame?.description || "No description available",
//       platforms:
//         allVideogame.platforms?.map((platform) => platform.platform.name) ||
//         [],
//       background_image: allVideogame.background_image,
//       released: allVideogame.released,
//       rating: allVideogame.rating,
//       genres: allVideogame.genres?.map((genre) => genre.name) || [],
//     })),
//     ...dbGenres,
//     ...apiPage3Data.map((allVideogame) => ({
//       id: allVideogame.id,
//       name: allVideogame.name,
//       description: allVideogame?.description || "No description available",
//       platforms:
//         allVideogame.platforms?.map((platform) => platform.platform.name) ||
//         [],
//       background_image: allVideogame.background_image,
//       released: allVideogame.released,
//       rating: allVideogame.rating,
//       genres: allVideogame.genres?.map((genre) => genre.name) || [],
//     })),
//   ];

//   return res.send(allVideogames);
// } catch (error) {
//   res.status(400).json({ error: error.message });
// }
// };

// module.exports = {
//   getGame,
// };
