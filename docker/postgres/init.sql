-- Runs once, when the Postgres volume is first created.
-- To re-run: `npm run db:reset`.
-- Will be replaced by migrations before the first AWS deploy.

-- Entities -------------------------------------------------------------------

CREATE TABLE courses (
  id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL CHECK (btrim(name) <> '')
);
CREATE UNIQUE INDEX courses_name_key ON courses (lower(name));

CREATE TABLE recipes (
  id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT NOT NULL CHECK (btrim(name) <> ''),
  course_id  INTEGER NOT NULL REFERENCES courses (id) ON DELETE RESTRICT
);
CREATE INDEX recipes_course_id_idx ON recipes (course_id);

-- instances of recipes (one recipe may have multiple variations (ie crock pot versus oven approach))
CREATE TABLE recipe_variants (
  id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recipe_id  INTEGER NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
  name       TEXT NOT NULL CHECK (btrim(name) <> ''),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Also serves as the index for recipe_id lookups.
CREATE UNIQUE INDEX recipe_variants_recipe_id_name_key ON recipe_variants (recipe_id, lower(name));

CREATE TABLE ingredients (
  id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT NOT NULL CHECK (btrim(name) <> '')
);
CREATE UNIQUE INDEX ingredients_name_key ON ingredients (lower(name));

CREATE TABLE techniques (
  id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT NOT NULL CHECK (btrim(name) <> '')
);
CREATE UNIQUE INDEX techniques_name_key ON techniques (lower(name));

CREATE TABLE cuisines (
  id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT NOT NULL CHECK (btrim(name) <> '')
);
CREATE UNIQUE INDEX cuisines_name_key ON cuisines (lower(name));

-- Relationships --------------------------------------------------------------
-- Composite PKs index (a, b); the extra index covers lookups from the b side.
-- Deleting a variant removes its links; deleting a referenced ingredient,
-- technique or cuisine is blocked until its links are removed.

CREATE TABLE recipe_variant_ingredients (
  recipe_variant_id INTEGER NOT NULL REFERENCES recipe_variants (id) ON DELETE CASCADE,
  ingredient_id     INTEGER NOT NULL REFERENCES ingredients (id) ON DELETE RESTRICT,
  PRIMARY KEY (recipe_variant_id, ingredient_id)
);
CREATE INDEX recipe_variant_ingredients_ingredient_id_idx ON recipe_variant_ingredients (ingredient_id);

-- Directed edge: parent is the broader ingredient (fish -> salmon).
-- Cycles are not prevented by constraints; enforce in the service layer.
CREATE TABLE ingredient_relationships (
  parent_id INTEGER NOT NULL REFERENCES ingredients (id) ON DELETE CASCADE,
  child_id  INTEGER NOT NULL REFERENCES ingredients (id) ON DELETE CASCADE,
  PRIMARY KEY (parent_id, child_id),
  CHECK (parent_id <> child_id)
);
CREATE INDEX ingredient_relationships_child_id_idx ON ingredient_relationships (child_id);

CREATE TABLE recipe_variant_techniques (
  recipe_variant_id INTEGER NOT NULL REFERENCES recipe_variants (id) ON DELETE CASCADE,
  technique_id      INTEGER NOT NULL REFERENCES techniques (id) ON DELETE RESTRICT,
  PRIMARY KEY (recipe_variant_id, technique_id)
);
CREATE INDEX recipe_variant_techniques_technique_id_idx ON recipe_variant_techniques (technique_id);

CREATE TABLE recipe_variant_cuisines (
  recipe_variant_id INTEGER NOT NULL REFERENCES recipe_variants (id) ON DELETE CASCADE,
  cuisine_id        INTEGER NOT NULL REFERENCES cuisines (id) ON DELETE RESTRICT,
  PRIMARY KEY (recipe_variant_id, cuisine_id)
);
CREATE INDEX recipe_variant_cuisines_cuisine_id_idx ON recipe_variant_cuisines (cuisine_id);

-- Seed -----------------------------------------------------------------------

INSERT INTO courses (name) VALUES ('Main'), ('Side'), ('Appetizer'), ('Dessert');

INSERT INTO recipes (name, course_id)
SELECT 'Beef Stew', id FROM courses WHERE name = 'Main';
