
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
router.get('/', (req, res, next) => {
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
//添加到购物车
// router.post('/addCart', (req, res, next) => {
//     var userId = '101'
//     let productId = req.body.productId//如果是post要用body
//     var User = require('../models/user')

//     User.findOne({ userId: userId }, (err, userdoc) => {
//         if (err) {
//             res.json({
//                 status: 201,
//                 msg: err.message
//             })
//         } else {
//             if (userdoc) {
//                 Goods.findOne({ productId: productId }, (err1, goodsdoc) => {
//                     if (err1) {
//                         res.json({
//                             status: 201,
//                             msg: err1.message
//                         })
//                     } else {
//                         res.json({
//                             status: 201,
//                             msg: goodsdoc
//                         })
//                         if (goodsdoc) {
//                             goodsdoc.productNum = 1
//                             goodsdoc.checked = 1
//                             userdoc.cartList.push(goodsdoc)
//                             userdoc.save((err2) => {
//                                 if (err2) {
//                                     res.json({
//                                         status: 201,
//                                         msg: err2.message
//                                     })
//                                 } else {
//                                     res.json({
//                                         status: 200,
//                                         msg: '请求成功',
//                                         result: 'suc'
//                                     })
//                                 }
//                             })
//                         }
//                     }
//                 })
//             }
//         }
//     })
// });
//加入到购物车
router.post("/addCart", function (req,res,next) {
    var userId = '101',productId = req.body.productId
    productId = parseInt(productId) 
    var User = require('../models/users');
    User.findOne({userId:userId}, function (err,userDoc) {
      if(err){
          res.json({
              status:"1",
              msg:err.message
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
                    status:"1",
                    msg:err2.message
                  })
                }else{
                  res.json({
                    status:'0',
                    msg:'添加购物车成功',
                    result: userDoc.cartList
                  })
                }
              })
            }else{
              Goods.findOne({"productId":productId}, function (err1,doc) {
                  console.log('GoodsFindOne:'+doc)
                if(err1){
                  res.json({
                    status:"1",
                    msg:err1.message
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
                          status:"1",
                          msg:err2.message
                        })
                      }else{
                        res.json({
                          status:'0',
                          msg:'添加购物车成功',
                          result: userDoc.cartList
                        })
                      }
                    })
                  }else{
                    res.json({
                        status:"0",
                        msg:'查无数据'
                      })
                  }
                }
              });
            }
          }
      }
    })
  });
  
module.exports = router
