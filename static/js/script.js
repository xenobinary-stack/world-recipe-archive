let currentLanguage = "en";
let languageWasChosen = false;

const form = document.getElementById("feedbackForm");
const message = document.getElementById("feedbackMessage");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (currentLanguage === "en") {
        message.textContent = "Thank you for your feedback!";
    } else if (currentLanguage === "fr") {
        message.textContent = "Merci pour vos commentaires !";
    } else if (currentLanguage === "zh") {
        message.textContent = "感谢您的反馈！";
    }
    //form.reset();
});

function changeLanguage(lang, isAuto = false) {

    currentLanguage = lang;

    if (!isAuto) {
        languageWasChosen = true;
    }

    localStorage.setItem("preferred_lang", lang);
    loadHomepageRecipes(lang);

    const title = document.getElementById("mainTitle");

    if (lang === "en") {
        title.textContent = "My World Recipe Archive";
    } else if (lang === "fr") {
        title.textContent = "Mon archive de recettes du monde";
    } else if (lang === "zh") {
        title.textContent = "我的世界食谱档案";
    }

    const welcome = document.getElementById("welcomeText");
    // 1. Translate Navigation Bar Links
    const navBrand = document.getElementById("navBrand");
    const navHome = document.getElementById("navHome");
    const navRecipes = document.getElementById("navRecipes");
    const navFeatured = document.getElementById("navFeatured");
    const navAbout = document.getElementById("navAbout");
    const navFeedback = document.getElementById("navFeedback");
    if (lang === "en") {
        if (navBrand) navBrand.textContent = "Recipe Archive";
        if (navHome) navHome.textContent = "Home";
        if (navRecipes) navRecipes.textContent = "Explore";
        if (navFeatured) navFeatured.textContent = "Featured";
        if (navAbout) navAbout.textContent = "About";
        if (navFeedback) navFeedback.textContent = "Feedback";
    } else if (lang === "fr") {
        if (navBrand) navBrand.textContent = "Archives Culinaires";
        if (navHome) navHome.textContent = "Accueil";
        if (navRecipes) navRecipes.textContent = "Explorer";
        if (navFeatured) navFeatured.textContent = "En vedette";
        if (navAbout) navAbout.textContent = "À propos";
        if (navFeedback) navFeedback.textContent = "Commentaires";
    } else if (lang === "zh") {
        if (navBrand) navBrand.textContent = "美食食谱档案";
        if (navHome) navHome.textContent = "首页";
        if (navRecipes) navRecipes.textContent = "分类探索";
        if (navFeatured) navFeatured.textContent = "精选推荐";
        if (navAbout) navAbout.textContent = "关于我";
        if (navFeedback) navFeedback.textContent = "反馈";
    }
    // 2. Highlight the active language button
    document.querySelectorAll(".lang-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.getElementById(`btn-${lang}`);
    if (activeBtn) activeBtn.classList.add("active");

    if (lang === "en") {
        welcome.textContent = "Welcome to my world recipe archive!";
    } else if (lang === "fr") {
        welcome.textContent = "Bienvenue dans mon archive de recettes du monde !";
    } else if (lang === "zh") {
        welcome.textContent = "欢迎来到我的世界食谱档案！";
    }
    // Translate the Featured Hero Caption
    const heroCaption = document.getElementById("heroCaption");
    if (heroCaption) {
        if (lang === "en") {
            heroCaption.textContent = "✨ Featured Recipe: Classic Italian Tiramisu";
        } else if (lang === "fr") {
            heroCaption.textContent = "✨ Recette en vedette : Tiramisu traditionnel italien";
        } else if (lang === "zh") {
            heroCaption.textContent = "✨ 今日精选推荐：经典意式提拉米苏";
        }
    }
    const recipesHeading = document.getElementById("recipesHeading");

    if (lang === "en") {
        recipesHeading.textContent = "Explore by Category";
    } else if (lang === "fr") {
        recipesHeading.textContent = "Explorer par catégorie";
    } else if (lang === "zh") {
        recipesHeading.textContent = "分类探索";
    }

    const aboutHeading = document.getElementById("aboutHeading");

    if (lang === "en") {
        aboutHeading.textContent = "About My Recipe Archive";
    } else if (lang === "fr") {
        aboutHeading.textContent = "À propos de mon archive de recettes";
    } else if (lang === "zh") {
        aboutHeading.textContent = "关于我的菜谱档案";
    }
    const aboutText = document.getElementById("aboutText");

    if (lang === "en") {
        aboutText.textContent = "This website is my personal collection of recipes from different countries and cultures. I enjoy exploring desserts, main dishes, breads, and pastries from around the world.";
    } else if (lang === "fr") {
        aboutText.textContent = "Ce site est ma collection personnelle de recettes de différents pays et cultures. J'aime découvrir des desserts, des plats principaux, des pains et des pâtisseries du monde entier.";
    } else if (lang === "zh") {
        aboutText.textContent = "这个网站是我个人收藏的食谱集，汇集了不同国家和文化的美食。我喜欢探索世界各地的甜点、主菜、面包和面点。";
    }

    const dessertsHeading = document.getElementById("dessertsHeading");

    if (lang === "en") {
        dessertsHeading.textContent = "Desserts";
    } else if (lang === "fr") {
        dessertsHeading.textContent = "Desserts";
    } else if (lang === "zh") {
        dessertsHeading.textContent = "甜点";
    }

    const worldCuisineHeading = document.getElementById("soups");

    if (lang === "en") {
        worldCuisineHeading.textContent = "Soup";
    } else if (lang === "fr") {
        worldCuisineHeading.textContent = "Soupe";
    } else if (lang === "zh") {
        worldCuisineHeading.textContent = "汤";
    }

    // Translate Main Dishes
    const mainDishes = document.getElementById("mainDishes");

    if (lang === "en") {
        mainDishes.textContent = "Main Dishes";
    } else if (lang === "fr") {
        mainDishes.textContent = "Plats principaux";
    } else if (lang === "zh") {
        mainDishes.textContent = "主菜";
    }

    // Translate Breads and Pastries
    const breadsPastries = document.getElementById("breadsPastries");

    if (lang === "en") {
        breadsPastries.textContent = "Breads & Buns";
    } else if (lang === "fr") {
        breadsPastries.textContent = "Pains & Brioches";
    } else if (lang === "zh") {
        breadsPastries.textContent = "面包和面点";
    }


    // Translate Featured Recipes heading
    const featuredHeading = document.getElementById("featuredHeading");

    if (lang === "en") {
        featuredHeading.textContent = "Featured Recipes";
    } else if (lang === "fr") {
        featuredHeading.textContent = "Recettes en vedette";
    } else if (lang === "zh") {
        featuredHeading.textContent = "精选食谱";
    }

    // Translate table column headings
    const recipeColumn = document.getElementById("recipeColumn");
    const countryColumn = document.getElementById("countryColumn");
    const categoryColumn = document.getElementById("categoryColumn");

    if (lang === "en") {
        recipeColumn.textContent = "Recipe";
        countryColumn.textContent = "Country";
        categoryColumn.textContent = "Category";
    } else if (lang === "fr") {
        recipeColumn.textContent = "Recette";
        countryColumn.textContent = "Pays";
        categoryColumn.textContent = "Catégorie";
    } else if (lang === "zh") {
        recipeColumn.textContent = "食谱";
        countryColumn.textContent = "国家";
        categoryColumn.textContent = "类别";
    }


    // Translate Recipe Video heading
    const videoHeading = document.getElementById("videoHeading");

    if (lang === "en") {
        videoHeading.textContent = "Recipe Video";
    } else if (lang === "fr") {
        videoHeading.textContent = "Vidéo de recette";
    } else if (lang === "zh") {
        videoHeading.textContent = "食谱视频";
    }


    // Translate Feedback heading
    const feedbackHeading = document.getElementById("feedbackHeading");

    if (lang === "en") {
        feedbackHeading.textContent = "Feedback";
    } else if (lang === "fr") {
        feedbackHeading.textContent = "Commentaires";
    } else if (lang === "zh") {
        feedbackHeading.textContent = "反馈";
    }


    // Get the feedback form labels and button
    const firstNameLabel = document.getElementById("firstNameLabel");
    const lastNameLabel = document.getElementById("lastNameLabel");
    const userIdLabel = document.getElementById("userIdLabel");
    const passwordLabel = document.getElementById("passwordLabel");
    const commentLabel = document.getElementById("commentLabel");
    const submitButton = document.getElementById("submitButton");

    // English
    if (lang === "en") {
        firstNameLabel.textContent = "First Name:";
        lastNameLabel.textContent = "Last Name:";
        userIdLabel.textContent = "User ID:";
        passwordLabel.textContent = "Password:";
        commentLabel.textContent = "Comment:";
        submitButton.textContent = "Submit";
    }

    // French
    else if (lang === "fr") {
        firstNameLabel.textContent = "Prénom :";
        lastNameLabel.textContent = "Nom de famille :";
        userIdLabel.textContent = "Identifiant :";
        passwordLabel.textContent = "Mot de passe :";
        commentLabel.textContent = "Commentaire :";
        submitButton.textContent = "Envoyer";
    }

    // Chinese
    else if (lang === "zh") {
        firstNameLabel.textContent = "名字：";
        lastNameLabel.textContent = "姓氏：";
        userIdLabel.textContent = "用户 ID：";
        passwordLabel.textContent = "密码：";
        commentLabel.textContent = "评论：";
        submitButton.textContent = "提交";
    }
    // ==========================================
    // Transaction of Useful Cooking Resources
    // ==========================================
    const externalLinkHeading = document.getElementById("externalLinkHeading");
    const externalLinkInfo = document.getElementById("externalLinkInfo");
    const externalLink1 = document.getElementById("externalLink1");
    const externalLink2 = document.getElementById("externalLink2");
    const externalLink3 = document.getElementById("externalLink3");
    if (lang === "en") {
        if (externalLinkHeading) externalLinkHeading.textContent = "Useful Cooking Resources";
        if (externalLinkInfo) externalLinkInfo.textContent = "Explore more recipes and cooking tips from these trusted websites:";
        if (externalLink1) externalLink1.innerHTML = '<span class="link-icon">🌐</span> Allrecipes — 60M Home Cooks';
        if (externalLink2) externalLink2.innerHTML = '<span class="link-icon">🍱</span> Taste of Japan — Authentic Recipes';
        if (externalLink3) externalLink3.innerHTML = '<span class="link-icon">🥗</span> Canada\'s Food Guide — Nutrition';
    } else if (lang === "fr") {
        if (externalLinkHeading) externalLinkHeading.textContent = "Ressources Culinaires Utiles";
        if (externalLinkInfo) externalLinkInfo.textContent = "Découvrez plus de recettes et d'astuces sur ces sites réputés :";
        if (externalLink1) externalLink1.innerHTML = '<span class="link-icon">🌐</span> Allrecipes — Communauté de 60M de cuisiniers';
        if (externalLink2) externalLink2.innerHTML = '<span class="link-icon">🍱</span> Taste of Japan — Recettes japonaises authentiques';
        if (externalLink3) externalLink3.innerHTML = '<span class="link-icon">🥗</span> Guide alimentaire canadien — Conseils nutrition';
    } else if (lang === "zh") {
        if (externalLinkHeading) externalLinkHeading.textContent = "实用烹饪资源";
        if (externalLinkInfo) externalLinkInfo.textContent = "在这些精选的美食与健康网站中探索更多烹饪灵感：";
        if (externalLink1) externalLink1.innerHTML = '<span class="link-icon">🌐</span> Allrecipes — 全球6000万家庭厨师社区';
        if (externalLink2) externalLink2.innerHTML = '<span class="link-icon">🍱</span> Taste of Japan — 日本官方传统风味食谱';
        if (externalLink3) externalLink3.innerHTML = '<span class="link-icon">🥗</span> 加拿大膳食指南 — 健康饮食与营养建议';
    }
}
// Function to load recipes from SQLite and make them clickable
async function loadHomepageRecipes(lang) {

    try {
        const response = await fetch(`/api/recipes?lang=${lang}`);
        if (!response.ok) return;

        const recipes = await response.json();
        const table = document.querySelector("table");

        // Keep the header row (index 0) and remove old data rows
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        const COUNTRY_FLAGS = {
            "Italy": "🇮🇹", "Italie": "🇮🇹", "意大利": "🇮🇹",
            "France": "🇫🇷", "France": "🇫🇷", "法国": "🇫🇷",
            "China": "🇨🇳", "Chine": "🇨🇳", "中国": "🇨🇳",
            "United States": "🇺🇸", "États-Unis": "🇺🇸", "美国": "🇺🇸",
            "Japan": "🇯🇵", "Japon": "🇯🇵", "日本": "🇯🇵",
            "Canada": "🇨🇦","Canada": "🇨🇦","加拿大": "🇨🇦"
        };
        // Add dynamic rows from SQLite
        recipes.forEach(recipe => {
            const row = table.insertRow();

            const cellRecipe = row.insertCell(0);
            const cellCountry = row.insertCell(1);
            const cellCategory = row.insertCell(2);

            // Clickable link to recipe.html with the recipe ID!
            cellRecipe.innerHTML = `<a href="recipe.html?id=${recipe.recipe_id}">${recipe.recipe_name}</a>`;

            const countryName = recipe.country_name || "—";
            const flag = COUNTRY_FLAGS[countryName] || "🌍"; // if not found, default flag
            // country：add badge and badge-country CSS，and flag
            cellCountry.innerHTML = `<span class="badge badge-country">${flag} ${countryName}</span>`;
            // category：add badge and badge-category CSS
            const categoryName = recipe.category_name || "—";
            cellCategory.innerHTML = `<span class="badge badge-category">${categoryName}</span>`;
        });
    } catch (err) {
        console.error("Error loading recipes from database:", err);
    }
}
// 1. Get the language the user chose before (or default to 'en')
const initialLanguage = localStorage.getItem("preferred_lang") || "en";
// Start the page in THAT language
changeLanguage(initialLanguage, true);


