const { Videogame, Genre } = require("../db");
const axios = require("axios");

const stripHtmlTags = (str) => {
  if (str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/<[^>]*>/g, "");
};

const getId = async (req, res) => {
  try {
    const { idVideogame } = req.params;

    let idType = "number";

    if (isNaN(idVideogame)) {
      idType = "uuid";
    }

    if (idType === "number") {
      try {
        const url = `https://api.rawg.io/api/games/${idVideogame}?key=91fecabb447e4d87bd14d72b6901ca7c`;
        const { data } = await axios(`${url}`);
        if (!data.name) {
          return res
            .status(404)
            .send(`No video game with ID: ${idVideogame} was found in the API`);
        }

        const players = {
          id: data.id,
          name: data.name,
          description: stripHtmlTags(data.description),
          platforms: data.platforms.map((plat) => plat.platform.name),
          background_image: data.background_image,
          released: data.released,
          rating: data.rating,
          ratings_count: data.ratings_count,
          genres: data.genres.map((genr) => genr.name),
        };

        return res.status(200).json(players);
      } catch (error) {
        return res.status(500).json({
          error: "Videogame was not found. Try requesting a valid id",
        });
      }
    } else {
      try {
        const gameFromDb = await Videogame.findByPk(idVideogame, {
          include: {
            model: Genre,
            as: "genres",
            attributes: ["id", "name"],
            through: {
              attributes: [],
            },
            order: [["ASC"]],
          },
        });
        if (gameFromDb) {
          const genres = gameFromDb.genres.map((gen) => {
            return gen.name;
          });

          const gameData = {
            id: gameFromDb.id,
            name: gameFromDb.name,
            description: gameFromDb.description,
            platforms: gameFromDb.platforms,
            background_image: gameFromDb.background_image,
            released: gameFromDb.released,
            rating: gameFromDb.rating,
            genres: genres,
          };

          return res.status(200).json(gameData);
        }
        if (!gameFromDb) {
          return res
            .status(404)
            .send(
              `No video game with ID: ${idVideogame} was found in the database`
            );
        }

        return res.status(200).json(gameFromDb);
      } catch (error) {
        return res
          .status(500)
          .send(
            `Error fetching game from database. Error: ${error.name}: ${error.message}`
          );
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: `A server error occurred. Error: ${error.name}: ${error.message}`,
    });
  }
};

module.exports = {
  getId,
};
