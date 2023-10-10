const { Genre } = require("../db");
const axios = require("axios");

const getGenre = async (req, res) => {
  try {
    let genreDb = await Genre.findAll();
    if (!genreDb.length) {
      const apiResult = await axios(
        "https://api.rawg.io/api/genres?key=91fecabb447e4d87bd14d72b6901ca7c"
      );
      genreDb = await Genre.bulkCreate(apiResult.data.results);
    }
    res.status(200).send(genreDb);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getGenre };
