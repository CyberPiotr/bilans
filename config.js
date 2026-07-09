(() => {
  "use strict";

  const APP_VERSION = "vitatrack-mobile-shell-v41";
  const APP_LAST_CHANGE = "add AI estimate only nutrition mode";
  const NUTRITION_MODE = "ai_estimate_only";
  const supabaseUrl = "https://bfugtsaxwzpumjmwfknf.supabase.co";

  window.VITATRACK_CONFIG = Object.freeze({
    appVersion: APP_VERSION,
    appLastChange: APP_LAST_CHANGE,
    nutritionMode: NUTRITION_MODE,
    supabaseUrl,
    // Wklej tutaj wyłącznie publiczny anon/publishable key, jeśli Edge Function go wymaga.
    supabasePublishableKey: "sb_publishable_a1hk0nCE1pV-mloD1nGoNA_ymDJT7SB",
    aiParserFunctionUrl: `${supabaseUrl}/functions/v1/ai-parser`,
    foodLookupFunctionUrl: `${supabaseUrl}/functions/v1/food-lookup`,
    cloudSyncFunctionUrl: `${supabaseUrl}/functions/v1/cloud-sync`,
  });
})();
