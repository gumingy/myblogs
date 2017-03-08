/**
 * Created by Administrator on 2017/3/6.
 */
var express = require('express');
var router = express.Router();
var middleware = require('../middleware/index');

router.get('/add',middleware.checkLogin,function(req,res,next){
    console.log("发表文章页面");
    res.render("articles/addarticles",{title:'发表文章'});
});

router.post('/add',middleware.checkLogin,function(req,res,next){
   console.log("提交博客信息");
   var article = req.body;
   article.user= req.session.user._id;
   new Model('Article')(article).save(function(err,art){
       if(err){
           //发表文章失败
           return res.redirect('/articles/add');
       }
       //发表成功返回首页
       res.redirect('/');

   })
});

module.exports = router;