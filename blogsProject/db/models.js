/**
 * Created by Administrator on 2017/3/7.
 */
//保存的是数据模型
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
module.exports = {
    User:{
        username:{type:String,required:true},
        password:{type:String,required:true},
        email:{type:String,required:true},
        avatar:String
    },
    Article:{
        user:{type:ObjectId,ref:'User'},
        title:{type:String,required:true},
        content:{type:String,required:true},
        createTime:{type:Date,default:Date.now}
    }
};