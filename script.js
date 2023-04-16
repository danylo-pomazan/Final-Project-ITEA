// script.js
document.addEventListener("DOMContentLoaded", function () {
  const charactersList = document.getElementById("characters-list");
  const pagination = document.getElementById("pagination");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const prevCollectionBtn = document.getElementById("prev-collection-btn");
  const nextCollectionBtn = document.getElementById("next-collection-btn");
  const characterDetailsContainer = document.getElementById(
    "character-details-container"
  );
  const charName = document.getElementById("char-name");
  const charBirthYear = document.getElementById("char-birth-year");
  const charGender = document.getElementById("char-gender");
  const charFilms = document.getElementById("char-films");
  const charHomeworld = document.getElementById("char-homeworld");
  const charSpecies = document.getElementById("char-species");
  const backBtn = document.getElementById("back-btn");
  const paginationBtns = document.getElementById("pagination-btns");

  let characters = [];
  let currentCharacterIndex = 0;
  let currentPage = 1;

  // Fetch characters from API
  function fetchCharacters(page) {
    fetch(`https://swapi.dev/api/people/?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        characters = data.results;
        renderCharacters();
        renderPagination();
      })
      .catch((error) => console.error("Error fetching characters:", error));
  }

  // Render characters list
  function renderCharacters() {
    charactersList.innerHTML = "";
    for (let i = 0; i < characters.length; i++) {
      const character = characters[i];
      const characterCard = document.createElement("div");
      characterCard.className = "character-card";
      characterCard.textContent = character.name;
      characterCard.addEventListener("click", () => {
        showCharacterDetails(i);
      });
      charactersList.appendChild(characterCard);
    }
    paginationBtns.style.display = "flex";
  }

  // Render pagination buttons
  function renderPagination() {
    if (characters.length > 10) {
      pagination.style.display = "flex";
      pagination.style.display = "flex";
    } else {
    }
  }

  // Show character details
  async function showCharacterDetails(index) {
    const character = characters[index];
    charName.textContent = character.name;
    charBirthYear.textContent = character.birth_year;
    charGender.textContent = character.gender;
    charFilms.textContent = await fetchFilmsFromLinks(character.films);
    Homeworld = await fetchHomeworldFromLink(character.homeworld);
    charHomeworld.textContent = Homeworld.name;
    if (character.species.length !== 0) {
      Species = await fetchHomeworldFromLink(character.species);
      charSpecies.textContent = Species.name;
    } else {
      charSpecies.textContent = "none";
    }
    characterDetailsContainer.classList.remove("hidden");
    charactersList.classList.add("hidden");
    currentCharacterIndex = index;
    paginationBtns.style.display = "none";
  }
  //Get Films List From Links
  async function fetchFilmsFromLinks(links) {
    try {
      if (!Array.isArray(links)) {
        throw new Error("Links is not an array.");
      }

      if (links.length === 0) {
        throw new Error("Links array is empty.");
      }

      if (links.length === 1) {
        const response = await fetch(links[0]);
        if (!response.ok) {
          throw new Error(`Failed to fetch film: ${response.url}`);
        }
        const film = await response.json();
        return film.title;
      } else {
        const filmResponses = await Promise.all(
          links.map((link) => fetch(link))
        );

        const films = [];
        for (const response of filmResponses) {
          if (!response.ok) {
            throw new Error(`Failed to fetch film: ${response.url}`);
          }
          const film = await response.json();
          films.push(film);
        }

        const filmTitles = films.map((film) => film.title);
        const filmTitlesString = filmTitles.join(", ");
        return filmTitlesString;
      }
    } catch (error) {
      console.error("Error fetching films from links:", error);
      throw error;
    }
  }
  //Get Homeland from link
  async function fetchHomeworldFromLink(link) {
    try {
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error(`Failed to fetch homeworld: ${response.url}`);
      }
      const homeworld = await response.json();
      return homeworld;
    } catch (error) {
      console.error("Error fetching homeworld:", error);
      throw error;
    }
  }

  // Hide character details and show characters list
  function hideCharacterDetails() {
    characterDetailsContainer.classList.add("hidden");
    charactersList.classList.remove("hidden");
    paginationBtns.style.display = "flex";
  }

  // Add event listeners to buttons
  prevBtn.addEventListener("click", () => {
    if (currentCharacterIndex > 0) {
      showCharacterDetails(currentCharacterIndex - 1);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentCharacterIndex < characters.length - 1) {
      showCharacterDetails(currentCharacterIndex + 1);
    }
  });

  backBtn.addEventListener("click", () => {
    hideCharacterDetails();
  });

  prevCollectionBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      fetchCharacters(currentPage - 1);
      currentPage = currentPage - 1;
    }
  });

  nextCollectionBtn.addEventListener("click", () => {
    if (currentPage < 9) {
      fetchCharacters(currentPage + 1);
      currentPage = currentPage + 1;
    }
  });

  // Fetch characters when DOM content is loaded
  fetchCharacters(1);
});
