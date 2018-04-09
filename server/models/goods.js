const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productSchema = new Schema({
    "productId":Number,//这里每一个字段类型要与传进去的参数，数据库里的字段类型，三者一致
    "productName":String,
    "salePrice":Number,
    "productImage":String,
    "productNum":Number,
    "checked":String,
})

module.exports = mongoose.model('Good',productSchema)