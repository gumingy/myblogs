var express = require('express');
//router就是路由模块
var router = express.Router();
var md = require('markdown').markdown;

/* GET home page. */
router.get('/', function(req, res, next) {
    Model('Article').find({}).populate('user').exec(function(err,articles){
        articles.forEach(function (article) {
            article.content = md.toHTML(article.content);
        });
        res.render('index', {title: '主页',articles:articles});
    });
});

module.exports = router;
