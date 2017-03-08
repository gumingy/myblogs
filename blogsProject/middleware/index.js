/**
 * Created by Administrator on 2017/3/8.
 */
exports.checkLogin = function(req,res,next){
    if(!req.session.user){
        //没有登陆转到登陆页面
        req.flash('error','未登录');
        return res.redirect('/users/login');
    }
    //已经登陆则放行
    next();
}

exports.checkNotLogin = function(req,res,next){
    if(req.session.user){
        //如果已登录不能访问注册页面，回到之前页面
        req.flash('error','已登录');
        return res.redirect('back');
    }
    //没登陆则放行
    next();
}