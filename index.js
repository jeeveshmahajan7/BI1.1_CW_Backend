const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const { initializeDatabase } = require("./db/db.connect");
const Movie = require("./models/movie.models");

app.use(express.json());
app.use(cors(corsOptions));

initializeDatabase();

// updating an existing movie in the database
const updateMovie = async (movieId, dataToUpdate) => {
  try {
    const updateMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {
      new: true,
    });
    return updateMovie;
  } catch (error) {
    console.log("Error updating movie by Id:", error);
  }
};

app.post("/movies/:movieId", async (req, res) => {
  try {
    const updatedMovie = await updateMovie(req.params.movieId, req.body);
    if (updatedMovie) {
      res.status(200).json({
        message: "Updated movie successfully.",
        updatedMovie: updatedMovie,
      });
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating movie." });
  }
});

// creating a new movie into the database by using post method
const createMovie = async (newMovie) => {
  try {
    const movie = new Movie(newMovie);
    const saveMovie = await movie.save();
    return saveMovie;
  } catch (error) {
    console.log("Error creating movie:", error);
  }
};

app.post("/movies", async (req, res) => {
  try {
    const savedMovie = await createMovie(req.body);
    res
      .status(201)
      .json({ message: "Movie added successfully.", movie: savedMovie });
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie." });
  }
});

// find a movie with a particular title
async function readMovieByTitle(movieTitle) {
  try {
    const movie = await Movie.findOne({ title: movieTitle });
    return movie;
  } catch (error) {
    throw error;
  }
}

app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await readMovieByTitle(req.params.title);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie." });
  }
});

// to get all the movies in the database
async function readAllMovies() {
  try {
    const allMovies = await Movie.find();
    return allMovies;
  } catch (error) {
    console.log(error);
  }
}

app.get("/movies", async (req, res) => {
  try {
    const movies = await readAllMovies();
    console.log(movies);
    if (movies.length !== 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

// const get movies by director name

const getMovieByDirector = async (directorName) => {
  try {
    const moviesByDirector = await Movie.find({ director: directorName });
    return moviesByDirector;
  } catch (error) {
    console.log(error);
  }
};

app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const allMoviesByDirector = await getMovieByDirector(
      req.params.directorName
    );

    if (allMoviesByDirector.length !== 0) {
      res.json(allMoviesByDirector);
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching movies by director." });
  }
});

const readMovieByGenre = async (genreName) => {
  try {
    const movieByGenre = await Movie.find({ genre: genreName });
    return movieByGenre;
  } catch (error) {
    console.log(error);
  }
};

app.get("/movies/genre/:genreName", async (req, res) => {
  try {
    const movies = await readMovieByGenre(req.params.genreName);
    if (movies.length !== 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "No movies found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching movies by genre." });
  }
});

//deleting a movie from the database

const deleteMovie = async (movieId) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    return deleteMovie;
  } catch (error) {
    console.log("Error deleting movie:", error);
  }
};
app.delete("/movie/:movieId", async (req, res) => {
  try {
    const deletedMovie = await deleteMovie(req.params.movieId);
    if (deletedMovie) {
      res.status(200).json({ message: "Movie deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running at PORT", PORT);
});
