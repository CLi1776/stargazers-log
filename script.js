const repositoryList = document.querySelector("#repository-list");
const listStatus = document.querySelector("#list-status");

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

  for (const repository of repositories) {
    const item = document.createElement("li");
    item.className = "repository-card";

    const heading = document.createElement("h3");
    const link = document.createElement("a");
    const repositoryUrl = new URL(repository.url);

    if (repositoryUrl.protocol !== "https:" && repositoryUrl.protocol !== "http:") {
      throw new Error(`Unsupported URL protocol for ${repository.name}`);
    }

    link.href = repositoryUrl.href;
    link.textContent = repository.name;
    heading.append(link);

    const description = document.createElement("p");
    description.textContent = repository.description;

    const starredAt = document.createElement("time");
    starredAt.dateTime = repository.starredAt;
    starredAt.textContent = `Starred on ${repository.starredAt}`;

    item.append(heading, description, starredAt);
    repositoryList.append(item);
  }

  listStatus.textContent = repositories.length
    ? `${repositories.length} starred ${repositories.length === 1 ? "repository" : "repositories"}`
    : "No starred repositories yet.";
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Could not load events.json (${response.status})`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("events.json must contain a list of repositories");
    }

    renderRepositories(repositories);
  } catch (error) {
    console.error("Failed to load starred repositories:", error);
    listStatus.textContent = "Could not load starred repositories. Please try again later.";
  }
}

loadRepositories();
