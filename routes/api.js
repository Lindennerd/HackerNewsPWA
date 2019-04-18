var express = require("express");
var crawler = require("../controller/hackernewscrawler");
var router = express.Router();

router.get("/:pageName/:page*?", function(req, res, next) {
  crawler
    .getPage(req.params.pageName, req.params.page)
    .then(function(items) {
      res.send(items);
    })
    .catch(function(error) {
      res.status(403).send(error);
    });
});

module.exports = router;
