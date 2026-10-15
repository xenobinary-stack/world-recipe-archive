let recipes = [];
let currentLanguage = localStorage.getItem("preferred_lang") || "en";


// ---------------------------------------------------------
// Translations for this page
// ---------------------------------------------------------

const pageText = {
    en: {
        brand: "Recipe Archive",
        home: "Home",
        explore: "Explore",
        featured: "Featured",
        about: "About",
        feedback: "Feedback",

        heading: "Explore Recipes",
        intro: "Discover recipes from around the world.",
        search: "Search recipes...",

        allCategories: "All Categories",
        allCountries: "All Countries",
        allDifficulties: "All Difficulties",

        prep: "Prep",
        cook: "Cook",

        easy: "Easy",
        medium: "Medium",
        hard: "Hard",

        viewRecipe: "View Recipe →",
        noResults: "No recipes found."
    },

    fr: {
        brand: "Archives Culinaires",
        home: "Accueil",
        explore: "Explorer",
        featured: "En vedette",
        about: "À propos",
        feedback: "Commentaires",

        heading: "Explorer les recettes",
        intro: "Découvrez des recettes du monde entier.",
        search: "Rechercher des recettes...",

        allCategories: "Toutes les catégories",
        allCountries: "Tous les pays",
        allDifficulties: "Toutes les difficultés",

        prep: "Préparation",
        cook: "Cuisson",

        easy: "Facile",
        medium: "Moyen",
        hard: "Difficile",

        viewRecipe: "Voir la recette",
        noResults: "Aucune recette trouvée."
    },

    zh: {
        brand: "美食食谱档案",
        home: "首页",
        explore: "分类探索",
        featured: "精选推荐",
        about: "关于我",
        feedback: "反馈",

        heading: "探索食谱",
        intro: "探索来自世界各地的食谱。",
        search: "搜索食谱...",

        allCategories: "所有类别",
        allCountries: "所有国家",
        allDifficulties: "所有难度",

        prep: "准备",
        cook: "烹饪",

        easy: "简单",
        medium: "中等",
        hard: "困难",

        viewRecipe: "查看食谱",
        noResults: "没有找到食谱。"
    }
};


// ---------------------------------------------------------
// Category code → translated category name
// ---------------------------------------------------------

const categoryNames = {
    en: {
        dessert: "Dessert",
        main_dish: "Main Dish",
        bread: "Bread",
        soup: "Soup"
    },

    fr: {
        dessert: "Dessert",
        main_dish: "Plat principal",
        bread: "Pain",
        soup: "Soupe"
    },

    zh: {
        dessert: "甜点",
        main_dish: "主菜",
        bread: "面包与面点",
        soup: "汤"
    }
};


// ---------------------------------------------------------
// Change language
// ---------------------------------------------------------

function changeRecipeLanguage(lang) {

    currentLanguage = lang;

    localStorage.setItem("preferred_lang", lang);

    applyPageLanguage();

    loadRecipes();
}


// ---------------------------------------------------------
// Apply page language
// ---------------------------------------------------------

function applyPageLanguage() {

    const t = pageText[currentLanguage];

    document.getElementById("navBrand").textContent = t.brand;
    document.getElementById("navHome").textContent = t.home;
    document.getElementById("navRecipes").textContent = t.explore;
    document.getElementById("navFeatured").textContent = t.featured;
    document.getElementById("navAbout").textContent = t.about;
    document.getElementById("navFeedback").textContent = t.feedback;

    document.getElementById("recipesHeading").textContent = t.heading;
    document.getElementById("recipesIntro").textContent = t.intro;

    document.getElementById("searchInput").placeholder = t.search;

    document.getElementById("noResults").textContent = t.noResults;

    updateFilterTexts();

    document.querySelectorAll(".lang-btn").forEach(button => {
        button.classList.remove("active");
    });

    const activeButton = document.getElementById(`btn-${currentLanguage}`);

    if (activeButton) {
        activeButton.classList.add("active");
    }
}


// ---------------------------------------------------------
// Load recipes from SQLite through Flask
// ---------------------------------------------------------

async function loadRecipes() {

    try {

        const response = await fetch(
            `/api/recipes?lang=${currentLanguage}`
        );

        if (!response.ok) {
            throw new Error("Failed to load recipes.");
        }

        recipes = await response.json();

        populateFilters();

        displayRecipes();

    } catch (error) {

        console.error("Error loading recipes:", error);

        document.getElementById("recipeGrid").innerHTML = "";

        document.getElementById("noResults").style.display = "block";
    }
}


// ---------------------------------------------------------
// Populate filters
// ---------------------------------------------------------

function populateFilters() {

    const categoryFilter =
        document.getElementById("categoryFilter");

    const countryFilter =
        document.getElementById("countryFilter");

    const difficultyFilter =
        document.getElementById("difficultyFilter");

    const t = pageText[currentLanguage];


    // Save current selections
    const oldCategory = categoryFilter.value;
    const oldCountry = countryFilter.value;
    const oldDifficulty = difficultyFilter.value;


    // Categories
    const categories = [
        ...new Set(
            recipes
                .map(recipe => recipe.category_name)
                .filter(Boolean)
        )
    ].sort();


    // Countries
    const countries = [
        ...new Set(
            recipes
                .map(recipe => recipe.country_name)
                .filter(Boolean)
        )
    ].sort();


    // Difficulties
    const difficulties = [
        ...new Set(
            recipes
                .map(recipe => recipe.difficulty)
                .filter(Boolean)
        )
    ].sort();


    // Category dropdown
    categoryFilter.innerHTML =
        `<option value="">${t.allCategories}</option>`;

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });


    // Country dropdown
    countryFilter.innerHTML =
        `<option value="">${t.allCountries}</option>`;

    countries.forEach(country => {

        const option = document.createElement("option");

        option.value = country;
        option.textContent = country;

        countryFilter.appendChild(option);
    });


    // Difficulty dropdown
    difficultyFilter.innerHTML =
        `<option value="">${t.allDifficulties}</option>`;

    difficulties.forEach(difficulty => {

        const option = document.createElement("option");

        option.value = difficulty;

        option.textContent =
            translateDifficulty(difficulty);

        difficultyFilter.appendChild(option);
    });


    // Restore old selections when possible
    if (
        [...categoryFilter.options]
            .some(option => option.value === oldCategory)
    ) {
        categoryFilter.value = oldCategory;
    }

    if (
        [...countryFilter.options]
            .some(option => option.value === oldCountry)
    ) {
        countryFilter.value = oldCountry;
    }

    if (
        [...difficultyFilter.options]
            .some(option => option.value === oldDifficulty)
    ) {
        difficultyFilter.value = oldDifficulty;
    }


    // Check URL for category filter
    applyCategoryFromUrl();
}


// ---------------------------------------------------------
// Apply category from URL
// Example:
// recipes.html?category=dessert
// recipes.html?category=main_dish
// ---------------------------------------------------------

function applyCategoryFromUrl() {

    const params =
        new URLSearchParams(window.location.search);

    const categoryCode =
        params.get("category");

    if (!categoryCode) {
        return;
    }

    const translatedName =
        categoryNames[currentLanguage]?.[categoryCode];

    if (!translatedName) {
        return;
    }

    const categoryFilter =
        document.getElementById("categoryFilter");

    const matchingOption =
        [...categoryFilter.options].find(
            option => option.value === translatedName
        );

    if (matchingOption) {
        categoryFilter.value = translatedName;
    }

    displayRecipes();
}


// ---------------------------------------------------------
// Update filter labels
// ---------------------------------------------------------

function updateFilterTexts() {

    const t = pageText[currentLanguage];

    const categoryFilter =
        document.getElementById("categoryFilter");

    const countryFilter =
        document.getElementById("countryFilter");

    const difficultyFilter =
        document.getElementById("difficultyFilter");


    if (categoryFilter.options.length > 0) {
        categoryFilter.options[0].text =
            t.allCategories;
    }

    if (countryFilter.options.length > 0) {
        countryFilter.options[0].text =
            t.allCountries;
    }

    if (difficultyFilter.options.length > 0) {
        difficultyFilter.options[0].text =
            t.allDifficulties;
    }
}


// ---------------------------------------------------------
// Translate difficulty
// ---------------------------------------------------------

function translateDifficulty(value) {

    const t = pageText[currentLanguage];

    const normalized =
        String(value).toLowerCase();

    if (normalized === "easy") {
        return t.easy;
    }

    if (normalized === "medium") {
        return t.medium;
    }

    if (normalized === "hard") {
        return t.hard;
    }

    return value;
}


// ---------------------------------------------------------
// Display recipe cards
// ---------------------------------------------------------

function displayRecipes() {

    const grid =
        document.getElementById("recipeGrid");

    const noResults =
        document.getElementById("noResults");

    const searchText =
        document.getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();

    const selectedCategory =
        document.getElementById("categoryFilter").value;

    const selectedCountry =
        document.getElementById("countryFilter").value;

    const selectedDifficulty =
        document.getElementById("difficultyFilter").value;


    const filteredRecipes =
        recipes.filter(recipe => {

            const name =
                String(recipe.recipe_name || "")
                    .toLowerCase();

            const country =
                String(recipe.country_name || "")
                    .toLowerCase();

            const category =
                String(recipe.category_name || "")
                    .toLowerCase();

            const difficulty =
                String(recipe.difficulty || "")
                    .toLowerCase();


            const matchesSearch =
                !searchText ||
                name.includes(searchText) ||
                country.includes(searchText) ||
                category.includes(searchText);


            const matchesCategory =
                !selectedCategory ||
                recipe.category_name === selectedCategory;


            const matchesCountry =
                !selectedCountry ||
                recipe.country_name === selectedCountry;


            const matchesDifficulty =
                !selectedDifficulty ||
                recipe.difficulty === selectedDifficulty;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesCountry &&
                matchesDifficulty
            );
        });


    grid.innerHTML = "";


    if (filteredRecipes.length === 0) {

        noResults.style.display = "block";

        return;
    }


    noResults.style.display = "none";


    filteredRecipes.forEach(recipe => {

        const card =
            document.createElement("article");

        card.className = "recipe-card";


        const imagePath =
            recipe.photo_path ||
            "images/placeholder.jpg";


        const image =
            document.createElement("img");

        image.src = imagePath;

        image.alt =
            recipe.recipe_name || "Recipe";


        image.onerror = function() {
            this.src = "images/placeholder.jpg";
        };


        // Image area
        const imageContainer =
            document.createElement("div");

        imageContainer.className =
            "recipe-card-image";

        imageContainer.appendChild(image);


        // Content area
        const content =
            document.createElement("div");

        content.className =
            "recipe-card-content";


        // Recipe name
        const title =
            document.createElement("h2");

        title.textContent =
            recipe.recipe_name || "—";


        // Time information
        const meta =
            document.createElement("div");

        meta.className =
            "recipe-card-meta";


        const prep =
            document.createElement("span");

        prep.textContent =
            `${pageText[currentLanguage].prep}: ${
                recipe.prep_time ?? "—"
            } min`;


        const cook =
            document.createElement("span");

        cook.textContent =
            `${pageText[currentLanguage].cook}: ${
                recipe.cook_time ?? "—"
            } min`;


        meta.appendChild(prep);
        meta.appendChild(cook);


        // Country and category
        const location =
            document.createElement("p");

        location.textContent =
            `${recipe.country_name || "—"} · ${
                recipe.category_name || "—"
            }`;


        // Difficulty
        const difficulty =
            document.createElement("p");

        difficulty.textContent =
            translateDifficulty(
                recipe.difficulty || "—"
            );


        // View Recipe button
        const viewButton =
            document.createElement("a");

        viewButton.className =
            "btn-primary";

        viewButton.href =
            `recipe.html?id=${recipe.recipe_id}`;

        viewButton.textContent =
            pageText[currentLanguage].viewRecipe;


        content.appendChild(title);
        content.appendChild(meta);
        content.appendChild(location);
        content.appendChild(difficulty);
        content.appendChild(viewButton);


        card.appendChild(imageContainer);
        card.appendChild(content);

        grid.appendChild(card);
    });
}


// ---------------------------------------------------------
// Search and filter events
// ---------------------------------------------------------

document
    .getElementById("searchInput")
    .addEventListener("input", displayRecipes);

document
    .getElementById("categoryFilter")
    .addEventListener("change", displayRecipes);

document
    .getElementById("countryFilter")
    .addEventListener("change", displayRecipes);

document
    .getElementById("difficultyFilter")
    .addEventListener("change", displayRecipes);


// ---------------------------------------------------------
// Initial page load
// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", function() {

    applyPageLanguage();

    loadRecipes();
});
