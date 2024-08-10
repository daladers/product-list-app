const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    id: { type: Number, required: false },
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product', },
    description: { type: String, required: true },
    date: { type: String, required: true },
  });
  
  const productSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    name: { type: String, required: true },
    count: { type: Number, required: true },
    size: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    weight: { type: String, required: true },
    comments: [commentSchema],
  });
  

module.exports = mongoose.model('Product', productSchema, 'product');
