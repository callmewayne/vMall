var express = require('express');
var router = express.Router();
var User = require('./../models/users')
require('./../util/util')
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
          maxAge: 1000 * 60 * 60 * 60
        })
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 60
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
router.post("/addressList", (req, res, next) => {
  var userId = req.cookies.userId,
    addressList = req.body.addressList
  User.findOne({ userId: userId }, (err, userDoc) => {
    if (userDoc) {
      userDoc.addressList.push(addressList)
      userDoc.save((err1, doc1) => {
        if (err1) {
          res.json({
            code: 201,
            msg: err1.message,
            body: null
          })
        } else {
          res.json({
            code: 200,
            msg: '添加购物车成功',
            body: userDoc.addressList
          })
        }
      })
    }
  })
})
//查询用户地址接口
router.get("/addressList", (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        code: 201,
        msg: err.message,
        body: ''
      })
    } else {
      res.json({
        code: 200,
        msg: '',
        body: doc.addressList
      })
    }
  })
})

//设为默认地址
router.post('/setDefault', (req, res, next) => {
  var userId = req.cookies.userId,
    addressId = req.body.addressId
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        code: 201,
        msg: err.message,
        body: ''
      })
    } else {
      doc.addressList.forEach((item) => {
        if (item.addressId == addressId) {
          item.isDefault = true
        } else {
          item.isDefault = false
        }
      })
      doc.save((err2, doc2) => {
        if (err2) {
          res.json({
            code: 201,
            msg: err2.message,
            body: ''
          })
        } else {
          res.json({
            code: 200,
            msg: '设置默认成功',
            body: doc2.addressList
          })
        }
      })
    }
  })
})
//删除地址
router.post('/delAddress', (req, res, next) => {
  var userId = req.cookies.userId,
    addressId = req.body.addressId
  User.update({ "userId": userId }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
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

router.post("/payMent", (req, res, next) => {
  let userId = req.cookies.userId,
    orderTotal = req.body.orderTotal,
    addressId = req.body.addressId;
  User.findOne({ userId: userId }, (err, userdoc) => {
    if (err) {
      res.json({
        code: 201,
        msg: err.message,
        body: ""
      })
    } else {
      let address = '',
        goodsList = [];
      //获取当前的用户地址信息
      userdoc.addressList.forEach((item => {
        if (addressId == item.addressId) {
          address = item
        }
      }))
      //获取用户车的购买商品
      userdoc.cartList.filter((item) => {
        if (item.checked == '1') {
          goodsList.push(item)
        }
      })
      let platform = '211'
      let r1 = Math.floor(Math.random() * 10);
      let r2 = Math.floor(Math.random() * 10);
      let sysDate = new Date().Format('yyyyMMddhhmmss')
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
      let orderId = platform + r1 + sysDate + r2
      let order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      }
      userdoc.orderList.push(order)
      userdoc.save((err2, doc2) => {
        if (err2) {
          res.json({
            code: 201,
            msg: '',
            body: ""
          })
        } else {
          res.json({
            code: 200,
            msg: '订单创建成功！',
            body: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      })
    }
  })
})

//根据订单ID查询订单信息
router.get("/orderDetail", (req, res, next) => {
  let userId = req.cookies.userId,
    orderId = req.param('orderId')
  User.findOne({ userId: userId }, (err, userDoc) => {
    if (err) {
      res.json({
        code: 201,
        msg: '',
        body: ""
      })
    } else {

      let orderList = userDoc.orderList
      if (orderList.length > 0) {
        let orderTotal = ''
        orderList.forEach((item) => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal
          }
        })
        if (orderTotal) {
          res.json({
            code: 200,
            msg: '',
            body: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        } else {
          res.json({
            code: 201,
            msg: '当前用户无此订单',
            body: ""
          })
        }

      } else {
        res.json({
          code: 200,
          msg: '无此订单',
          body: ""
        })
      }

    }
  })
})


router.get("/getCartCount", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId
    User.findOne({ userId: userId }, (err, userDoc) => {
      if (err) {
        res.json({
          code: 201,
          msg: err.message,
          body: ""
        })
      } else {
        let cartList = userDoc.cartList;
        let cartCount = 0;
        cartList.map((item) => {
          cartCount += parseInt(item.productNum)
        })
        res.json({
          code: 200,
          msg: '',
          body: cartCount
        })
      }
    })
  }
})
module.exports = router;
