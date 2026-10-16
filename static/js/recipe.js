// Get recipe_id from URL (?id=2), default to 2 (Tiramisu)
const urlParams = new URLSearchParams(window.location.search);
let currentRecipeId = urlParams.get("id") || 2;
let currentLanguage = localStorage.getItem("preferred_lang") || "en";
// UI Static Translations
const UI_TEXT = {
    en: {
        backHome: "← Back to Home",
        prep: "Prep Time:",
        cook: "Cook / Chill Time:",
        servings: "Servings:",
        ingredients: "Ingredients",
        steps: "Preparation Steps",
        notes: "Chef's Notes & Tips",
        mins: "mins",
        portions: "portions"
    },
    fr: {
        backHome: "← Retour à l'accueil",
        prep: "Préparation :",
        cook: "Cuisson / Repos :",
        servings: "Portions :",
        ingredients: "Ingrédients",
        steps: "Étapes de préparation",
        notes: "Conseils du Chef",
        mins: "min",
        portions: "personnes"
    },
    zh: {
        backHome: "← 返回首页",
        prep: "准备耗时：",
        cook: "制作/冷藏耗时：",
        servings: "份量：",
        ingredients: "食材清单",
        steps: "制作步骤",
        notes: "主厨贴士",
        mins: "分钟",
        portions: "人份"
    }
};
// Switch language and reload content
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem("preferred_lang", lang);
    applyUIText(lang);
    loadRecipeDetails(currentRecipeId, lang);
}
// Update static labels on page
function applyUIText(lang) {
    const t = UI_TEXT[lang] || UI_TEXT["en"];
    document.getElementById("backHomeLink").textContent = t.backHome;
    document.getElementById("labelPrep").textContent = t.prep;
    document.getElementById("labelCook").textContent = t.cook;
    document.getElementById("labelServings").textContent = t.servings;
    document.getElementById("ingredientsHeading").textContent = t.ingredients;
    document.getElementById("stepsHeading").textContent = t.steps;
    document.getElementById("notesHeading").textContent = t.notes;
}
// Fetch and render recipe from SQLite API
async function loadRecipeDetails(recipeId, lang) {
    try {
        const response = await fetch(`/api/recipe/${recipeId}?lang=${lang}`);
        if (!response.ok) throw new Error("Recipe not found");

        //Highlight the active language button
        document.querySelectorAll(".lang-btn").forEach(btn => btn.classList.remove("active"));
        const activeBtn = document.getElementById(`btn-${lang}`);
        if (activeBtn) activeBtn.classList.add("active");
        
        const data = await response.json();
        const t = UI_TEXT[lang] || UI_TEXT["en"];
        // 1. Basic Info
        document.getElementById("pageTitle").textContent = `${data.name} - Recipe Archive`;
        document.getElementById("recipeTitle").textContent = data.name;
        document.getElementById("recipeDescription").textContent = data.description || "";
        document.getElementById("recipeCountry").textContent = data.country ? `🌍 ${data.country}` : "";
        document.getElementById("recipeCategory").textContent = data.category ? `🏷 ${data.category}` : "";
        document.getElementById("recipeDifficulty").textContent = data.difficulty ? `⭐ ${data.difficulty}` : "";
        document.getElementById("prepTime").textContent = `${data.prep_time || "—"} ${t.mins}`;
        document.getElementById("cookTime").textContent = `${data.cook_time || "—"} ${t.mins}`;
        document.getElementById("servings").textContent = `${data.servings || "—"} ${t.portions}`;

        // 2. Ingredients
        // Group ingredients by section
        const ingredientsList = document.getElementById("ingredientsList");
        ingredientsList.innerHTML = "";

        const sections = {};
        data.ingredients.forEach(item => {
            const sec = item.section || "main";
            if (!sections[sec]) sections[sec] = [];
            sections[sec].push(item);
        });

        // Section label translations
        const sectionLabels = {
            en: {
                ingredients: "Ingredients",
                dough: "🍞 Dough",
                crust: "🥧 Crust",
                filling: "🍎 Filling",
                topping: "✨ Topping",
                cake: "Cake"
            },
            fr: {
                ingredients: "Ingrédients",
                dough: "🍞 Pâte à pain",
                crust: "🥧 Pâte brisée",
                filling: "🍎 Garniture",
                topping: "✨ Finition",
                cake: "Gâteau"
            },
            zh: {
                ingredients: "食材",
                dough: "🍞 面团",
                crust: "🥧 饼皮",
                filling: "🍎 馅料",
                topping: "✨ 表面装饰",
                cake: "蛋糕"
            }
        };

        const labels = sectionLabels[lang] || sectionLabels["en"];

        Object.keys(sections).forEach(sec => {
            // Section heading
            const heading = document.createElement("li");
            heading.style.fontWeight = "bold";
            heading.style.marginTop = "12px";
            heading.style.listStyle = "none";
            heading.textContent = labels[sec] || sec;
            ingredientsList.appendChild(heading);

            // Items under this section
            sections[sec].forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item.quantity || ""} ${item.unit || ""} ${item.name}`.trim();
                ingredientsList.appendChild(li);
            });
        });


        // 3. Numbered Steps
        const stepsList = document.getElementById("stepsList");
        stepsList.innerHTML = "";
        if (data.steps && data.steps.length > 0) {
            data.steps.forEach(step => {
                const li = document.createElement("li");
                li.textContent = step.instruction;
                stepsList.appendChild(li);
            });
        } else {
            stepsList.innerHTML = "<li>No steps available.</li>";
        }
        // 4. Notes
        const notesSection = document.getElementById("notesSection");
        if (data.note) {
            notesSection.style.display = "block";
            document.getElementById("recipeNotes").textContent = data.note;
        } else {
            notesSection.style.display = "none";
        }
        // 5. Load Photo from Database
        const photoImg = document.getElementById("recipePhoto");
        const photoCaption = document.getElementById("photoCaption");
        if (data.photo && data.photo.file_path) {
            // Handle path whether it includes "images/" or just the filename
            let path = data.photo.file_path;
            if (!path.startsWith("images/") && !path.startsWith("http")) {
                path = "images/" + path;
            }
            photoImg.src = path;
            photoImg.alt = data.photo.caption || data.name || "Recipe Photo";
            if (photoCaption) {
                photoCaption.textContent = data.photo.caption || "";
            }
        } else {
            // Default placeholder if no photo in database
            photoImg.src = "images/dessert.jpg";
        }
    } catch (err) {
        console.error("Error loading recipe:", err);
        document.getElementById("recipeTitle").textContent = "Recipe Not Found";
    }
}
// Initial load
applyUIText(currentLanguage);
loadRecipeDetails(currentRecipeId, currentLanguage);

