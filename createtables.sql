-- ============================================
-- Recipe Archive Database
-- Languages: English / French / Chinese
-- Database: SQLite
-- ============================================


-- ============================================
-- 1. Countries
-- ============================================

CREATE TABLE countries (
    country_id INTEGER PRIMARY KEY,
    code TEXT NOT NULL UNIQUE
);


-- ============================================
-- 2. Country Translations
-- ============================================

CREATE TABLE country_translations (
    country_id INTEGER,
    language_code TEXT,
    name TEXT NOT NULL,

    PRIMARY KEY (country_id, language_code),

    FOREIGN KEY (country_id)
        REFERENCES countries(country_id)
);


-- ============================================
-- 3. Recipes
-- ============================================

CREATE TABLE recipes (
    recipe_id INTEGER PRIMARY KEY,
    country_id INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER,
    difficulty TEXT,

    FOREIGN KEY (country_id)
        REFERENCES countries(country_id)
);


-- ============================================
-- 4. Recipe Translations
-- ============================================

CREATE TABLE recipe_translations (
    recipe_id INTEGER,
    language_code TEXT,
    name TEXT NOT NULL,
    description TEXT,

    PRIMARY KEY (recipe_id, language_code),

    FOREIGN KEY (recipe_id)
        REFERENCES recipes(recipe_id)
);


-- ============================================
-- 5. Categories
-- ============================================

CREATE TABLE categories (
    category_id INTEGER PRIMARY KEY,
    code TEXT NOT NULL UNIQUE
);


-- ============================================
-- 6. Category Translations
-- ============================================

CREATE TABLE category_translations (
    category_id INTEGER,
    language_code TEXT,
    name TEXT NOT NULL,

    PRIMARY KEY (category_id, language_code),

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
);


-- ============================================
-- 7. Recipe ↔ Category
-- ============================================

CREATE TABLE recipe_categories (
    recipe_id INTEGER,
    category_id INTEGER,

    PRIMARY KEY (recipe_id, category_id),

    FOREIGN KEY (recipe_id)
        REFERENCES recipes(recipe_id),

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
);


-- ============================================
-- 8. Ingredients
-- ============================================

CREATE TABLE ingredients (
    ingredient_id INTEGER PRIMARY KEY,
    code TEXT NOT NULL UNIQUE
);


-- ============================================
-- 9. Ingredient Translations
-- ============================================

CREATE TABLE ingredient_translations (
    ingredient_id INTEGER,
    language_code TEXT,
    name TEXT NOT NULL,

    PRIMARY KEY (ingredient_id, language_code),

    FOREIGN KEY (ingredient_id)
        REFERENCES ingredients(ingredient_id)
);


-- ============================================
-- 10. Recipe Ingredients
-- ============================================

CREATE TABLE recipe_ingredients (
    recipe_ingredient_id INTEGER PRIMARY KEY,

    recipe_id INTEGER,
    ingredient_id INTEGER,

    quantity REAL,
    unit TEXT,

    FOREIGN KEY (recipe_id)
        REFERENCES recipes(recipe_id),

    FOREIGN KEY (ingredient_id)
        REFERENCES ingredients(ingredient_id)
);


-- ============================================
-- 11. Recipe Steps
-- ============================================

CREATE TABLE recipe_steps (
    recipe_step_id INTEGER PRIMARY KEY,

    recipe_id INTEGER,
    step_number INTEGER,
    instruction TEXT,

    FOREIGN KEY (recipe_id)
        REFERENCES recipes(recipe_id)
);


-- ============================================
-- 12. Recipe Step Translations
-- ============================================

CREATE TABLE recipe_step_translations (
    recipe_step_id INTEGER,
    language_code TEXT,
    instruction TEXT NOT NULL,

    PRIMARY KEY (recipe_step_id, language_code),

    FOREIGN KEY (recipe_step_id)
        REFERENCES recipe_steps(recipe_step_id)
);


-- ============================================
-- 13. Recipe Photos
-- ============================================

CREATE TABLE recipe_photos (
    photo_id INTEGER PRIMARY KEY,

    recipe_id INTEGER,
    file_path TEXT NOT NULL,

    photo_type TEXT,
    caption TEXT,

    display_order INTEGER,

    FOREIGN KEY (recipe_id)
        REFERENCES recipes(recipe_id)
);


-- ============================================
-- 14. Photo Translations
-- ============================================

CREATE TABLE photo_translations (
    photo_id INTEGER,
    language_code TEXT,
    caption TEXT NOT NULL,

    PRIMARY KEY (photo_id, language_code),

    FOREIGN KEY (photo_id)
        REFERENCES recipe_photos(photo_id)
);


-- ============================================
-- 15. Recipe Notes
-- ============================================

CREATE TABLE recipe_notes (
    note_id INTEGER PRIMARY KEY,

    recipe_id INTEGER,
    language_code TEXT,
    note TEXT NOT NULL,

    FOREIGN KEY (recipe_id)
        REFERENCES recipes(recipe_id)
);