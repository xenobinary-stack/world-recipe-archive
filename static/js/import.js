// Feedback Table
fetch('/api/admin/feedbacks')
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("feedbackTable");
        data.forEach(item => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${item.feedback_id}</td>
                <td>${item.first_name} ${item.last_name}</td>
                <td>${item.user_id}</td>
                <td>${item.comment}</td>
                <td>${item.created_at}</td>
            `;
        });
    });


// -------------------------------------------------------------
// Hero Recipe Management
// -------------------------------------------------------------

document.addEventListener("DOMContentLoaded", loadHeroRecipes);

const heroSelect = document.getElementById("heroRecipeSelect");
const heroPreview = document.getElementById("heroRecipePreview");
const heroSaveButton = document.getElementById("saveHeroRecipeButton");
const heroMessage = document.getElementById("heroRecipeMessage");

let heroRecipes = [];


// Load recipes from Flask API
async function loadHeroRecipes() {

    if (!heroSelect) return;

    try {
        const response = await fetch('/api/admin/hero-recipes?lang=en');

        if (!response.ok) {
            throw new Error("Unable to load recipes.");
        }

        heroRecipes = await response.json();

        heroSelect.innerHTML = "";

        if (heroRecipes.length === 0) {
            heroSelect.add(new Option("No recipes found", ""));
            heroSaveButton.disabled = true;
            return;
        }

        heroRecipes.forEach(recipe => {

            const option = new Option(
                recipe.recipe_name || `Recipe #${recipe.recipe_id}`,
                recipe.recipe_id
            );

            if (recipe.is_hero === 1) {
                option.selected = true;
            }

            heroSelect.add(option);
        });

        heroSaveButton.disabled = false;

        updateHeroPreview();

    } catch (error) {

        console.error("Hero Recipe Error:", error);

        heroSelect.innerHTML = "";
        heroSelect.add(new Option("Unable to load recipes", ""));

        showHeroMessage(
            "Unable to load recipes. Please refresh the page.",
            true
        );
    }
}


// Display selected recipe preview
function updateHeroPreview() {

    const selectedId = Number(heroSelect.value);

    const recipe = heroRecipes.find(
        item => item.recipe_id === selectedId
    );

    if (!recipe) {
        heroPreview.replaceChildren();
        return;
    }

    heroPreview.replaceChildren();

    const wrapper = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = recipe.recipe_name || `Recipe #${recipe.recipe_id}`;

    const status = document.createElement("p");
    status.textContent =
        recipe.is_hero === 1
            ? "Currently displayed as Hero Recipe"
            : "Not currently displayed as Hero Recipe";

    wrapper.appendChild(title);
    wrapper.appendChild(status);

    if (recipe.photo_path) {

        const image = document.createElement("img");

        image.src = recipe.photo_path;
        image.alt = recipe.recipe_name || "Recipe preview";
        image.style.maxWidth = "220px";
        image.style.width = "100%";
        image.style.height = "auto";
        image.style.borderRadius = "8px";

        wrapper.appendChild(image);
    }

    heroPreview.appendChild(wrapper);
}


// Update preview when selection changes
if (heroSelect) {
    heroSelect.addEventListener("change", updateHeroPreview);
}


// Display status message
function showHeroMessage(message, isError = false) {

    if (!heroMessage) return;

    heroMessage.textContent = message;

    heroMessage.style.color = isError ? "red" : "green";
}


// Save selected Hero Recipe
if (heroSaveButton) {

    heroSaveButton.addEventListener("click", async () => {

        const recipeId = Number(heroSelect.value);

        if (!recipeId) {
            showHeroMessage("Please select a recipe.", true);
            return;
        }

        heroSaveButton.disabled = true;

        try {

            const response = await fetch('/api/admin/hero-recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recipe_id: recipeId
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Save failed.");
            }

            showHeroMessage("Hero Recipe saved successfully!");

            // Reload current status from database
            await loadHeroRecipes();

        } catch (error) {

            console.error("Save Hero Recipe Error:", error);

            showHeroMessage(
                error.message || "Unable to save Hero Recipe.",
                true
            );

        } finally {
            heroSaveButton.disabled = false;
        }
    });
}
