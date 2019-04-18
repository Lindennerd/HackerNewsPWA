(function() {
  var app = {
    currentTab: "news",
    currentPage: 1
  };

  app.getCounter = function(currentPage, index) {
    return (currentPage - 1) * 30 + index + 1;
  };

  app.changeTab = function(tab) {
    app.currentTab = tab;
    app.currentPage = 1;
    $(".headerTab a").removeClass("currentTab");
    $('[data-taget="' + tab + '"]').addClass("currentTab");

    app.load();
  };

  app.load = function() {
    $("main")
      .children()
      .remove();
    $("#cover-spin").show();
    $.get("/api/" + app.currentTab + "/" + app.currentPage)
      .done(function(result) {
        $("#cover-spin").hide();

        $(result).each(function(index, element) {
          var card = $("<div>", {
            class: "card cardTemplate"
          });

          card.append(
            $("<a>", {
              href: element.url,
              text:
                app.getCounter(app.currentPage, index) + "." + element.title,
              target: "_blank"
            })
          );

          card.append(
            $("<div>", {
              class: "description",
              text:
                "(" +
                element.sitebit.site +
                ")" +
                " " +
                element.score +
                " " +
                element.age
            }).append(
              $("<a>", {
                href: "https://news.ycombinator.com/" + element.comments.link,
                text: element.comments.text,
                target: "_blank"
              })
            )
          );

          $("main").append(card);
        });
      })
      .fail(function(error) {
        console.log(error);
        $("#cover-spin").hide();
        $("main").append(
          $("<div>", {
            class: "card cardTemplate",
            text: error.statusCode + " " + error.responseText
          })
        );
      });
  };

  app.load();

  /* UI Events */

  $("#more").click(function(e) {
    e.preventDefault();

    app.currentPage = app.currentPage + 1;
    app.load();
  });

  $(".headerTab a").click(function(e) {
    e.preventDefault();
    var targetTab = $(e.target).data("target");
    if (targetTab) app.changeTab(targetTab);
  });

  $("#responsiveMenu").click(function(e) {
    e.preventDefault();

    var $tabs = $(".headerTabs");
    if ($tabs.hasClass("responsive")) $tabs.removeClass("responsive");
    else $tabs.addClass("responsive");
  });
})();
