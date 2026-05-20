function buildAndShowHomeHTML (categories) {

  // Load home snippet page
  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      // =========================
      // 🔴 STEP 2 - RANDOM CATEGORY
      // =========================
      var chosenCategory = chooseRandomCategory(categories); // ✅ FIX
      var chosenCategoryShortName = chosenCategory.short_name; // ✅ FIX


      // =========================
      // 🔴 STEP 3 - INSERT INTO HTML
      // =========================
      var homeHtmlToInsertIntoMainPage =
        insertProperty(
          homeHtml,
          "randomCategoryShortName",
          "'" + chosenCategoryShortName + "'" // ⚠️ IMPORTANT: quotes added
        );


      // =========================
      // 🔴 STEP 4 - INSERT INTO PAGE
      // =========================
      insertHtml("#main-content", homeHtmlToInsertIntoMainPage);

    },
    false);
}
