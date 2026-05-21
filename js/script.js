function buildAndShowHomeHTML(categories) {

  console.log("categories:", categories);

  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      console.log("homeHtml loaded");

      var chosenCategory = chooseRandomCategory(categories);

      if (!chosenCategory) {
        console.log("ERROR: no category");
        return;
      }

      var chosenCategoryShortName = chosenCategory.short_name;

      var homeHtmlToInsertIntoMainPage =
        insertProperty(
          homeHtml,
          "randomCategoryShortName",
          "'" + chosenCategoryShortName + "'"
        );

      insertHtml("#main-content", homeHtmlToInsertIntoMainPage);

    },
    false);
}
