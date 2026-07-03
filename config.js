(() => {
  "use strict";

  const APP_VERSION = "vitatrack-missing-foods-panel-v28";
  const APP_LAST_CHANGE = "panel braków i wyraźne badge źródła";
  const supabaseUrl = "https://bfugtsaxwzpumjmwfknf.supabase.co";

  window.VITATRACK_CONFIG = Object.freeze({
    appVersion: APP_VERSION,
    appLastChange: APP_LAST_CHANGE,
    supabaseUrl,
    // Wklej tutaj wyłącznie publiczny anon/publishable key, jeśli Edge Function go wymaga.
    supabasePublishableKey: "sb_publishable_a1hk0nCE1pV-mloD1nGoNA_ymDJT7SB",
    aiParserFunctionUrl: `${supabaseUrl}/functions/v1/ai-parser`,
    foodLookupFunctionUrl: `${supabaseUrl}/functions/v1/food-lookup`,
  });
})();
