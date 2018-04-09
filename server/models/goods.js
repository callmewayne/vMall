const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productSchema = new Schema({
    "productId":Number,
    "productName":String,
    "salePrice":Number,
    "productImage":String,
    "productNum":Number,
    "checked":String,
})

module.exports = mongoose.model('Good',productSchema)