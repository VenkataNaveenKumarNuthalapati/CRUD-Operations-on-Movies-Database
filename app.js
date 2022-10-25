const express = require("express");
const app = express();
app.use(express.json());

const sqlite = require("sqlite");
let { open } = sqlite;
const sqlite3 = require("sqlite3");
const path = require("path");
const dbpath = path.join(__dirname, "moviesData.db");
let DB;
let initializerDBServer = async () => {
  try {
    DB = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://locolhost:3000/");
    });
  } catch (error) {
    console.log(`DB error ${error.message}`);
    process.exit(1);
  }
};

initializerDBServer();

app.get("/movies/", async (request, response) => {
  let getBooksQuery = `SELECT movie_name as movieName FROM movie;`;
  let booksNames = await DB.all(getBooksQuery);
  response.send(booksNames);
});

app.post("/movies/", async (request, response) => {
  let movieDetails = request.body;
  let { directorId, movieName, leadActor } = movieDetails;
  const postQuery = `INSERT INTO
                     movie (director_id,movie_name,lead_actor)
                     VALUES
                        (${directorId},
                        '${movieName}',
                        '${leadActor}');`;
  let result = await DB.run(postQuery);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
                        SELECT

                            movie_id AS movieId, director_id AS directorId, movie_name AS movieName, lead_actor AS leadActor

                        FROM
                            movie
                        WHERE
                            movie_id = ${movieId};`;
  const movieDetails = await DB.get(getMovieQuery);
  console.log(movieDetails);

  response.send(movieDetails);
});

// PUT Method
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  let updateMovieDetails = request.body;
  let { directorId, movieName, leadActor } = updateMovieDetails;
  const getMovieQuery = `
                        UPDATE movie
                        SET
                            director_id = ${directorId},
                            movie_name = '${movieName}',
                            lead_actor = '${leadActor}'
                        WHERE
                            movie_id = ${movieId};`;

  const movieDetails = await DB.run(getMovieQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const getMovieQuery = `
                        DELETE FROM movie
                        WHERE
                            movie_id = ${movieId};`;

  const movieDetails = await DB.run(getMovieQuery);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  let getQuery = `SELECT
                          director_id as directorId,
                          director_name as directorName
                    FROM director;`;
  let directorsList = await DB.all(getQuery);
  response.send(directorsList);
});
// get

app.get("/directors/:directorId/movies/", async (request, response) => {
  let { directorId } = request.params;
  console.log(directorId);
  let getQuery = `SELECT movie_name as movieName FROM movie WHERE director_id = ${directorId};`;
  let direcMovies = await DB.all(getQuery);
  response.send(direcMovies);
});

module.exports = app;
