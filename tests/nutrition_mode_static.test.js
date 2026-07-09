const assert = require("assert/strict");
const fs = require("fs");

const config = fs.readFileSync("config.js", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const serviceWorker = fs.readFileSync("service-worker.js", "utf8");

assert.match(config, /const NUTRITION_MODE = "ai_estimate_only";/);
assert.match(config, /nutritionMode: NUTRITION_MODE/);
assert.match(config, /vitatrack-mobile-shell-v41/);
assert.match(serviceWorker, /vitatrack-mobile-shell-v41/);

assert.match(app, /function isAiEstimateOnlyMode\(\)/);
assert.match(app, /function logNutritionModeDebug/);
assert.match(app, /\[Cyber Zdrowie Nutrition Mode\]/);
assert.match(app, /status: "ai_estimate"/);
assert.match(app, /nutritionSource: lookupResult\.source\?\.type === "ai_estimate" \? "ai_estimate" : lookupResult\.source/);
assert.match(app, /function requestFoodLookup/);
assert.match(app, /Food lookup is disabled by nutrition mode: ai_estimate_only/);

const mealResolverIndex = app.indexOf("async function resolveMealWithFoodLookup");
const mealModeIndex = app.indexOf("if (isAiEstimateOnlyMode())", mealResolverIndex);
const mealLookupIndex = app.indexOf("lookupProductWithDebug", mealResolverIndex);
assert.ok(mealModeIndex > mealResolverIndex, "meal resolver should check nutrition mode");
assert.ok(mealModeIndex < mealLookupIndex, "meal resolver should skip lookup before lookupProductWithDebug");

const dishResolverIndex = app.indexOf("async function resolveDishIngredientsWithFoodLookup");
const dishModeIndex = app.indexOf("if (isAiEstimateOnlyMode())", dishResolverIndex);
const dishLookupIndex = app.indexOf("lookupProductWithDebug", dishResolverIndex);
assert.ok(dishModeIndex > dishResolverIndex, "dish resolver should check nutrition mode");
assert.ok(dishModeIndex < dishLookupIndex, "dish resolver should skip lookup before lookupProductWithDebug");

console.log("nutrition mode static checks: OK");
