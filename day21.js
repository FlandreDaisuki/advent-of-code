const inputLines = (this.window ? document.body.textContent : require('fs').readFileSync('day21.txt', 'utf8'))
  .split('\n').filter(Boolean);

const trim = (s) => String(s).trim();
const uniq = (a) => [...new Set(a)];
const intersect = (a, b) => a.filter((e) => b.includes(e));
const menu = inputLines.map((recipe) => {
  const [ingredientStr, allergenStr] = recipe.match(/([\w ]+) \(contains ([\w\s,]+)\)/).slice(1);
  const ingredients = ingredientStr.split(' ').map(trim).filter(Boolean);
  const allergens = allergenStr.split(',').map(trim).filter(Boolean);
  return {
    ingredients,
    allergens,
  };
});

const allAllergens = uniq(menu.map((recipe) => recipe.allergens).flat(1));
const maybeAllergen = Object.fromEntries(allAllergens.map((allergen) => [allergen, null]));
allAllergens.forEach((allergen) => {
  const recipeIngredients = menu.filter((recipe) => recipe.allergens.includes(allergen)).map((recipe) => recipe.ingredients);
  for (const recipe of recipeIngredients) {
    if (!maybeAllergen[allergen]) {
      maybeAllergen[allergen] = recipe;
    } else {
      maybeAllergen[allergen] = uniq(intersect(maybeAllergen[allergen], recipe));
    }
  }
});
const allMaybeAllergenIngredients = uniq(Object.values(maybeAllergen).reduce((a, b) => a.concat(b), []));
menu.map((recipe) => {
  return recipe.ingredients.filter((ingredient) => !allMaybeAllergenIngredients.includes(ingredient));
}).flat(1).length; // answer 1

const ingredientContainsAllergen = { ...maybeAllergen };
while (Object.values(ingredientContainsAllergen).some(Array.isArray)) {
  for (const [allergen, possibles] of Object.entries(ingredientContainsAllergen)) {
    if (possibles.length === 1) {
      const correct = possibles[0];
      ingredientContainsAllergen[allergen] = correct;

      Object.values(ingredientContainsAllergen)
        .filter(Array.isArray)
        .filter((otherPossibles) => otherPossibles.includes(correct))
        .forEach((otherPossibles) => {
          otherPossibles.splice(otherPossibles.indexOf(correct), 1);
        });
    }
  }
}

[...allAllergens].sort()
  .map((allergen) => ingredientContainsAllergen[allergen])
  .join(','); // answer 2
