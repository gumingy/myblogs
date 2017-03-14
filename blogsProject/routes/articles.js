/**
 * Created by Administrator on 2017/3/6.
 */
var express = require('express');

var router = express.Router();
var middleware = require('../middleware/index');
var markdown = require('markdown').markdown;

router.get('/add',middleware.checkLogin,function(req,res,next){
    console.log("发表文章页面");
    res.render("articles/addarticles",{title:'发表文章',keyword:req.session.keyword});
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
       };
       req.flash('success', '发表文章成功!');  //放置成功信息
       res.redirect('/');//发表文章成功后返回主页

   })
});

router.post('/edit/:_id',middleware.checkLogin,function(req,res,next){
    console.log("提交博客信息");
    var article = req.body;
    console.log(req.params);
    Model('Article').update({_id:req.params._id},article,function(err,art){
        // console.log(err);
        if(err){
            req.flash('error','修改文章失败!'); //修改失败信息
        }
        req.flash('success','修改文章成功!');  //修改成功信息
        return res.redirect('/articles/detail/'+req.params._id);
    })
});

router.get('/detail/:_id',function(req,res,next){
    Model('Article').findOne({_id:req.params._id},function(err,article){
       article.content = markdown.toHTML(article.content);
       console.log(article);
       res.render('articles/detail',{title:'查看文章',art:article,keyword:req.session.keyword});
    });
});

router.get('/delete/:_id',function (req,res,next) {
    Model('Article').remove({_id:req.params._id},function (err,article) {
        if(!req.session.user && req.session.user._id !== article.user){
            req.flash('error','删除文章失败');
            res.redirect('back');
        };
        req.flash('success','删除文章成功');
        res.redirect('/');
    })
});

router.get('/edit/:_id',function (req,res,next) {
    Model('Article').findOne({_id:req.params._id},function (err,article) {
        //添加权限判断，判断当前的登陆人和文章发表人是否一致，如果不一致转回详情页面，并显示错误信息
        if(!req.session.user && req.session.user._id !== article.user){
            req.flash('error','你没有权限修改文章');
            res.redirect('/articles/detail/'+article._id);
        };
        res.render('articles/editarticles',{title:'编辑文章',art:article,keyword:req.session.keyword});
    })
});

//get方式   /articles/list/1/2
//post方式  /articles/list/1/2
//all，get和post请求都能访问
router.all('/list/:pageNum/:pageSize',function(req,res,next){
    var searchBtn = req.body.searchBtn;
    //pageNum表示当前第几页，pageSize表示每一页有几条
    var pageNum = parseInt(req.params.pageNum && req.params.pageNum>0?req.params.pageNum:1);
    var pageSize = parseInt(req.params.pageSize && req.params.pageSize>0?req.params.pageSize:2);
    //搜索条件对象
    var query = {};
    //这种情况是只有点击搜索按钮时才能拿到keyword
    var keyword = req.body.keyword;
    if(searchBtn){
        //点击了searchBtn按钮的，把关键字存到session中，防止丢失
        req.session.keyword = keyword;
    };
    if(req.session.keyword){
        query['title'] = new RegExp(req.session.keyword,'ig');
    };
    //查询搜索结果有多少条记录，方便计算页数
    Model('Article').count(query,function(err,count){
        console.log('count='+count+'totalPage='+Math.ceil(count/pageSize));
        //查询符合条件的当前这一页的数据
        Model('Article').find(query).sort({'createTime':-1}).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(err,articles){
            articles.forEach(function(art){
                art.content = markdown.toHTML(art.content);
            });
            res.render('index',{
                title:'首页',
                articles:articles,
                pageNum:pageNum,
                pageSize:pageSize,
                totalPage:Math.ceil(count/pageSize),
                count:count,
                keyword:req.session.keyword?req.session.keyword:''
            })
        });
    });
});

module.exports = router;