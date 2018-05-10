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
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        code: 201,
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60*60
        })
        // req.session.user = doc
        res.json({
          code: 200,
          msg: '登录成功',
          body: {
            userName: doc.userName,

          }
        })
      }
    }
  })
});
//登出接口
router.post('/logout', (req, res, next) => {
  res.cookie("userId", '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    code: 200,
    msg: '退出成功'
  })
})

//校验
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      code: 200,
      msg: '',
      body: req.cookies.userName || ''
    })
  } else {
    res.json({
      code: 201,
      msg: '未登录',
      body: ''
    })
  }
})

//查询当前用户购物车数据
router.get('/cartList', (req, res, next) => {
  let userId = req.cookies.userId
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        code: 201,
        msg: err.message,
        body: ''
      })
    } else {
      if (doc) {
        res.json({
          code: 200,
          msg: '',
          body: doc.cartList
        })
      }
    }
  })
})
//购物车删除
router.post('/cartDel', (req, res, next) => {
  let userId = req.cookies.userId, productId = req.body.productId
  User.update({ userId: userId },
    {
      $pull: { 'cartList': { "productId": productId } }
    }, (err, doc) => {
      if (err) {
        res.json({
          code: 201,
          msg: err.message,
          body: ''
        })
      } else {
        res.json({
          code: 200,
          msg: '删除成功',
          body: ''
        })
      }
    })
})
//修改商品数量
router.post('/cartEdit', (req, res, next) => {
  var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked
  User.update({ "userId": userId, "cartList.productId": productId }, {
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked
  }, (err, doc) => {
    if (err) {
      res.json({
        code: 201,
        msg: err.message,
        body: ''
      })
    } else {
      res.json({
        code: 200,
        msg: '编辑成功',
        body: ''
      })
    }
  })
})

router.post('/editCheckAll', (req, res, next) => {
  var userId = req.cookies.userId,
    checkAll = req.body.checkAll ? '1' : '0'
  User.findOne({ "userId": userId }, (err, user) => {
    if (user) {
      user.cartList.forEach(item => {
        item.checked = checkAll
      });

      user.save((err1, doc) => {
        if (err1) {
          res.json({
            code: 201,
            msg: err.message,
            body: ''
          })
        } else {
          res.json({
            code: 200,
            msg: '全选成功',
            body: ''
          })
        }
      })

    } else {
      res.json({
        code: 200,
        msg: '编辑成功',
        body: ''
      })
    }
  })
})
//添加地址
router.post("/addressList",(req,res,next)=>{
  var userId = req.cookies.userId,
  addressList = req.body.addressList
  User.findOne({userId:userId},(err,userDoc)=>{
    if(userDoc){
      userDoc.addressList.push(addressList)
      userDoc.save((err1,doc1)=>{
        if(err1){
          res.json({
            code:"201",
            msg:err1.message,
            body:null
          })
        }else{
          res.json({
            code:'200',
            msg:'添加购物车成功',
            body: userDoc.addressList
          })
        }
      })
    }
  })
})
//查询用户地址接口
router.get("/addressList",(req,res,next)=>{
  var userId = req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        code:201,
        msg:err.message,
        body:''
      })
    }else{
      res.json({
        code:200,
        msg:'',
        body:doc.addressList
      })
    }
  })
})

//设为默认地址
router.post('/setDefault',(req,res,next)=>{
  var userId = req.cookies.userId,
  addressId = req.body.addressId
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        code:201,
        msg:err.message,
        body:''
      })
    }else{
      doc.addressList.forEach((item)=>{
        if(item.addressId ==addressId){
         item.isDefault = true
        }else{
          item.isDefault = false
        }
      })
      doc.save((err2,doc2)=>{
       if(err2){
         res.json({
           code:201,
           msg:err2.message,
           body:''
         })
       }else{
         res.json({
           code:200,
           msg:'设置默认成功',
           body:doc2.addressList
         })
       }
      })
    }
  })
})
//删除地址
router.post('/delAddress',(req,res,next)=>{
  var userId = req.cookies.userId,
  addressId = req.body.addressId
  User.update({"userId":userId},{
    $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
  },(err,doc)=>{
    if(err){
      res.json({
        code:201,
        msg:err.message,
        body:''
      })
    }else{
      res.json({
        code:200,
        msg:'删除成功',
        body:''
      })
    }
  })
})
module.exports = router;
