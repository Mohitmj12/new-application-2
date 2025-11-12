const API_KEY = "ea09ff9b3308472cb3eb810de2f429f8";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}
async function fetchNews(query) {
  const loading = document.getElementById("loading");
  const noResults = document.getElementById("no-results");
  const cardsContainer = document.getElementById("cards-container");

  loading.classList.remove("hidden");
  noResults.classList.add("hidden");
  cardsContainer.innerHTML = "";

  try {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();

    loading.classList.add("hidden");

    if (!data.articles || data.articles.length === 0) {
      noResults.classList.remove("hidden");
      return;
    }

    bindData(data.articles);
  } catch (error) {
    loading.classList.add("hidden");
    noResults.textContent = "⚠️ Failed to load news. Please try again later.";
    noResults.classList.remove("hidden");
  }
}


function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector(".news-img");
    const newsTitle = cardClone.querySelector(".news-title");
    const newsSource = cardClone.querySelector(".news-source");
    const newsDesc = cardClone.querySelector(".news-desc");

    newsTitle.addEventListener("mouseover", function () {
        newsTitle.style.backgroundColor = "#A3D8FF";
    });

    newsTitle.addEventListener("mouseout", function () {
        newsTitle.style.backgroundColor = "transparent";
    });

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
