
$(function () {

  $("#navbarToggle").blur(function () {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

});


(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";

var menuItemsUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";

var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";


// =========================
// UTILS
// =========================

var insertHtml = function (selector, html) {
  document.querySelector(selector).innerHTML = html;
};

var showLoading = function (selector) {
  var html = "<div class='text-center'><img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  return string.replace(new RegExp(propToReplace, "g"), propValue);
};


// =========================
// INIT PAGE
// =========================

document.addEventListener("DOMContentLoaded", function () {

  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true);

});


// =========================
// HOME PAGE
// =========================

function buildAndShowHomeHTML(categories) {

  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      var chosenCategory = chooseRandomCategory(categories);
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


// random category
function chooseRandomCategory(categories) {
  var randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
}


// =========================
// MENU ITEMS PAGE
// =========================

dc.loadMenuItems = function (categoryShort) {

  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHTML);
};


function buildAndShowMenuItemsHTML(categoryMenuItems) {

  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {

      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {

          var html = buildMenuItemsViewHtml(
            categoryMenuItems,
            menuItemsTitleHtml,
            menuItemHtml
          );

          insertHtml("#main-content", html);

        },
        false);
    },
    false);
}


// SAFE VERSION (NO BREAK)
function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml) {

  var cat = categoryMenuItems.category;
  var menuItems = categoryMenuItems.menu_items || [];

  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml, "name", cat.name);
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml, "special_instructions", cat.special_instructions || "");

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  var catShortName = cat.short_name;

  for (var i = 0; i < menuItems.length; i++) {

    var html = menuItemHtml;

    html = insertProperty(html, "short_name", menuItems[i].short_name || "");
    html = insertProperty(html, "catShortName", catShortName || "");
    html = insertProperty(html, "name", menuItems[i].name || "");
    html = insertProperty(html, "description", menuItems[i].description || "");

    html = insertItemPrice(html, "price_small", menuItems[i].price_small);
    html = insertItemPrice(html, "price_large", menuItems[i].price_large);

    finalHtml += html;

    if (i % 2 !== 0) {
      finalHtml += "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }
  }

  finalHtml += "</section>";
  return finalHtml;
}


// =========================
// PRICE HELPERS
// =========================

function insertItemPrice(html, propName, value) {
  if (!value) {
    return insertProperty(html, propName, "");
  }

  return insertProperty(html, propName, "$" + value.toFixed(2));
}


// =========================
// EXPORT
// =========================

global.$dc = dc;

})(window);
