const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateReposId(request, response, next) {
  const { id } = request.params;

  if (id && !isUuid(id)) {
    return response.status(400).send();
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title || !url || !techs) {
    return response.status(400).json({
      error: "Fill in all fields",
    });
  }

  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepo);

  return response.json(newRepo);
});

app.put("/repositories/:id", validateReposId, (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex === -1) {
    return response
      .status(400)
      .json({ error: "This repository does not exist" });
  }

  const repoUpdated = {
    ...repositories[repoIndex],
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  };

  repositories[repoIndex] = repoUpdated;

  return response.json(repoUpdated);
});

app.delete("/repositories/:id", validateReposId, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex === -1) {
    return response
      .status(400)
      .json({ error: "This repository does not exist" });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateReposId, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex === -1) {
    return response
      .status(400)
      .json({ error: "This repository does not exist" });
  }

  const repoLikeit = {
    ...repositories[repoIndex],
    likes: repositories[repoIndex].likes + 1,
  };

  repositories[repoIndex] = repoLikeit;

  return response.json(repoLikeit);
});

module.exports = app;
