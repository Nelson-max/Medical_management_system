const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema();

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;
