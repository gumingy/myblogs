var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
router.use(cookieParser());
var middleware = require('../middleware/index');
//访问登录页面
router.get('/login', function(req, res, next) {
  console.log("打开登陆页面");
  var keyword = req.session.keyword;
  res.render('users/login',{title:'登录成功',keyword:keyword});
});

//使用post提交登录信息
router.post('/login', function(req,res,next) {
    console.log("提交登录信息");
    var user = req.body;
    user.password = md5(user.password);
    // console.log(user);
    //查询数据库，找到是否有匹配的记录
    Model('User').findOne(user,function(err,u){
        // console.log(u);
        if(u){
            req.session.user = u;
            req.flash('success','登录成功');
             return res.redirect('/');
        };
        //用户登录成功 将用户的登录信息保存到session中
        req.flash('error',"用户名密码错误");
        res.redirect('/users/login');
    })
});

//访问注册页面
router.get('/reg',middleware.checkNotLogin,function(req,res,next){
  console.log("打开注册页面");
  var keyword = req.session.keyword;
    res.render("users/reg",{title:'注册',keyword:keyword});
});
//提交注册信息
router.post('/reg',function(req,res,next){
  console.log("提交注册信息");
  //获得用户提交的表单信息
  var user = req.body;
  console.log(user);
  if(user.password !== user.password2){
    req.flash('error',"两次输入的密码不一致");
    //重新跳到注册页面
    return res.redirect('/users/reg');
  }
  //删除确认密码
    delete user.password2;
  user.password = md5(user.password); //对密码进行加密
    user.avatar = "https://secure.gravatar.com/avatar/"+md5(user.email)+"?s=100"; //得到用户的头像
    //保存到数据库中
    new Model('User')(user).save(function(err,user){
      if(err){
        req.flash('err',"注册失败");
        res.redirect('/users/reg');
      };
      //在session中保存用户的登录信息
        req.flash('success','注册成功');
      req.session.user = user;
      res.redirect('/');
    });
});

//注销用户登陆
router.get('/loginout',function(req,res,next){
  console.log("注销用户登录");
  req.flash('success','用户登录已注销');
  req.session.user = null;
  res.redirect('/');
});

function md5(val){
    return require('crypto').createHash('md5').update(val).digest('hex');
}

module.exports = router;
