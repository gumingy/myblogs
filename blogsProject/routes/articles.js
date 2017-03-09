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
    console.log(article);
   new Model('Article')(article).save(function(err,art){
       console.log(err);
       if(err){
           req.flash('error', '发表文章失败!'); //放置失败信息
           return res.redirect('/articles/add');
       }
       req.flash('success', '发表文章成功!');  //放置成功信息
       res.redirect('/');//发表文章成功后返回主页

   })
});

module.exports = router;