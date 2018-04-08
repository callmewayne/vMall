
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

module.exports = router
