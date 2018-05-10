
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接mongo数据库
mongoose.connect('mongodb://127.0.0.1:27017/test');
mongoose.connection.on('connected', function () {
    console.log("mongodb connected success")
})
mongoose.connection.on('error', function () {
    console.log("mongodb connected fail")
})
mongoose.connection.on('disconnected', function () {
    console.log("mongodb connected disconnected")
})
//查询商品列表数据
router.get('/list', (req, res, next) => {
    let page = parseInt(req.param('page'))
    let pageSize = parseInt(req.param('pageSize'))
    let sort = parseInt(req.param('sort'))
    let priceLevel = req.param('priceChecked')
    let skip = (page - 1) * pageSize;
    var priceGt = '', priceLt = ''
    let params = {};
    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0':
                priceGt = 0, priceLt = 500
                break;
            case '1':
                priceGt = 500, priceLt = 1000
                break;
            case '2':
                priceGt = 1000, priceLt = 2000
                break;
            case '3':
                priceGt = 2000, priceLt = 5000
                break;
            default:
                priceGt = 0, priceLt = 500
                break;
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLt
            }
        }
    }

    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({ 'salePrice': sort });
    goodsModel.exec((err, doc) => {
        if (err) {
            res.json({
                status: 201,
                msg: err.message
            })
        } else {
            res.json({
                status: 200,
                msg: '',
                body: {
                    totalCount: doc.length,
                    list: doc
                }
            })
        }
    })
    // res.send('hello,goods list');

})

//加入到购物车
router.post("/addCart", function (req,res,next) {
    var userId = '101',productId = req.body.productId
    productId = parseInt(productId) 
    var User = require('../models/users');
    User.findOne({userId:userId}, function (err,userDoc) {
      if(err){
          res.json({
            status:"201",
            msg:err.message,
            body:null
          })
      }else{
          console.log("userDoc:"+userDoc);
          if(userDoc){
            var goodsItem = '';
            userDoc.cartList.forEach(function (item) {
                if(item.productId == productId){
                  goodsItem = item;
                  item.productNum++;
                }
            });
            console.log(goodsItem)
            if(goodsItem){
              userDoc.save(function (err2,doc2) {
                console.log("userDocsave:"+doc2);
                if(err2){
                  res.json({
                    status:"201",
                    msg:err2.message,
                    body:null
                  })
                }else{
                    userDoc.cartList.forEach((item)=>{
                        delete item._id
                    })

                  res.json({
                    status:'200',
                    msg:'添加购物车成功',
                    body: userDoc.cartList
                  })
                }
              })
            }else{
              Goods.findOne({"productId":productId}, function (err1,doc) {
                  console.log('GoodsFindOne:'+doc)
                if(err1){
                  res.json({
                    status:"201",
                    msg:err1.message,
                    body:null
                  })
                }else{
                  if(doc){
                    doc.productNum = 1;
                    doc.checked = 1;
                    userDoc.cartList.push(doc);
                    userDoc.save(function (err2,doc2) {
                        console.log('userDocOne:'+doc2)
                      if(err2){
                        res.json({
                            status:"201",
                            msg:err1.message,
                            body:null
                        })
                      }else{
                        
                        userDoc.cartList.forEach((item)=>{
                            delete item._id
                        })
                        res.json({
                            status:'200',
                            msg:'添加购物车成功',
                            body: userDoc.cartList
                        })
                      }
                    })
                  }else{
                    res.json({
                        status:"201",
                    msg:'找不到此商品',
                    body:null
                      })
                  }
                }
              });
            }
          }
      }
    })
});
 //全选商品
  router.post("/editCheckAll", function (req,res,next) {
    var userId = req.cookies.userId,
        checkAll = req.body.checkAll?'1':'0';
    User.findOne({userId:userId}, function (err,user) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(user){
          user.cartList.forEach((item)=>{
            item.checked = checkAll;
          })
          user.save(function (err1,doc) {
              if(err1){
                res.json({
                  status:'1',
                  msg:err1,message,
                  result:''
                });
              }else{
                res.json({
                  status:'0',
                  msg:'',
                  result:'suc'
                });
              }
          })
        }
      }
    });
  });
  
  
  router.post("/payMent", function (req,res,next) {
    var userId = req.cookies.userId,
      addressId = req.body.addressId,
      orderTotal = req.body.orderTotal;
    User.findOne({userId:userId}, function (err,doc) {
       if(err){
          res.json({
              status:"1",
              msg:err.message,
              result:''
          });
       }else{
         var address = '',goodsList = [];
         //获取当前用户的地址信息
         doc.addressList.forEach((item)=>{
            if(addressId==item.addressId){
              address = item;
            }
         })
         //获取用户购物车的购买商品
         doc.cartList.filter((item)=>{
           if(item.checked=='1'){
             goodsList.push(item);
           }
         });
  
         var platform = '622';
         var r1 = Math.floor(Math.random()*10);
         var r2 = Math.floor(Math.random()*10);
  
         var sysDate = new Date().Format('yyyyMMddhhmmss');
         var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
         var orderId = platform+r1+sysDate+r2;
         var order = {
            orderId:orderId,
            orderTotal:orderTotal,
            addressInfo:address,
            goodsList:goodsList,
            orderStatus:'1',
            createDate:createDate
         };
  
         doc.orderList.push(order);
  
         doc.save(function (err1,doc1) {
            if(err1){
              res.json({
                status:"1",
                msg:err.message,
                result:''
              });
            }else{
              res.json({
                status:"0",
                msg:'',
                result:{
                  orderId:order.orderId,
                  orderTotal:order.orderTotal
                }
              });
            }
         });
       }
    })
  });
  //根据订单Id查询订单信息
  router.get("/orderDetail", function (req,res,next) {
    var userId = req.cookies.userId,orderId = req.param("orderId");
    User.findOne({userId:userId}, function (err,userInfo) {
        if(err){
            res.json({
               status:'1',
               msg:err.message,
               result:''
            });
        }else{
           var orderList = userInfo.orderList;
           if(orderList.length>0){
             var orderTotal = 0;
             orderList.forEach((item)=>{
                if(item.orderId == orderId){
                  orderTotal = item.orderTotal;
                }
             });
             if(orderTotal>0){
               res.json({
                 status:'0',
                 msg:'',
                 result:{
                   orderId:orderId,
                   orderTotal:orderTotal
                 }
               })
             }else{
               res.json({
                 status:'120002',
                 msg:'无此订单',
                 result:''
               });
             }
           }else{
             res.json({
               status:'120001',
               msg:'当前用户未创建订单',
               result:''
             });
           }
        }
    })
  });
  
module.exports = router;
