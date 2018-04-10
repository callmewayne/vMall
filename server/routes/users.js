var express = require('express');
var router = express.Router();
var User = require('./../models/users')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
//二级路由
router.post('/login', function (req, res, next) {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param,(err,doc)=>{
    if(err){
      res.json({
        code:201,
        msg:err.message
      })
    }else{
      if(doc){
        res.cookie('userId',doc.userId,{
          path:'/',
          maxAge:1000*60*60
        })
        res.cookie('userName',doc.userName,{
          path:'/',
          maxAge:1000*60*60
        })
        // req.session.user = doc
        res.json({
          code:200,
          msg:'登录成功',
          body:{
            userName:doc.userName,
           
          }
        })
      }
    }
  })
});
//登出接口
router.post('/logout', (req, res, next)=>{
  res.cookie("userId",'',{
    path:'/',
    maxAge:-1
  })
  res.json({
    code:200,
    msg:'退出成功'
  })
})

//校验
router.get('/checkLogin', (req, res, next)=>{
 if(req.cookies.userId){
   res.json({
    code:200,
    msg:'',
    body:req.cookies.userName || ''
   })
 }else{
  res.json({
    code:201,
    msg:'未登录',
    body:''
   })
 }
})
module.exports = router;
