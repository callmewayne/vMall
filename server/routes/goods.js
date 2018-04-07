var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接mongo数据库
mongoose.connect('mongodb://127.0.0.1:27017/test');
mongoose.connection.on('connected',function(){
    console.log("mongodb connected success")
})
mongoose.connection.on('error',function(){
    console.log("mongodb connected fail")
})
mongoose.connection.on('disconnected',function(){
    console.log("mongodb connected disconnected")
})

router.get('/',(req,res,next)=>{
    Goods.find({},(err,doc)=>{
        if(err){
            res.json({
                status:201,
                msg:err.message
            })
        }else{
            res.json({
                status:200,
                msg:'',
                body:{
                    totalCount:doc.length,
                    list:doc
                }
            })
        }
    })
    // res.send('hello,goods list');

})

module.exports = router
