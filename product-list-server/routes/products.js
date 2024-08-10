const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).exec();
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });  

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/comments", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      const comment = {
        ...req.body,
        productId: req.params.id,
      };
      product.comments.push(comment);
      await product.save();
      res.status(201).json(product.comments[product.comments.length - 1]); 
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.delete("/:id/comments/:commentId", async (req, res) => {
    try {
      const { id, commentId } = req.params;
      if (!commentId || commentId === "undefined") {
        return res.status(400).json({ message: "Invalid comment ID" });
      }
  
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      const commentExists = product.comments.some(
        (c) => c._id.toString() === commentId
      );
      if (!commentExists) return res.status(404).json({ message: "Comment not found" });
  
      product.comments = product.comments.filter(
        (c) => c._id.toString() !== commentId
      );
      await product.save();
  
      res.json({ message: "Comment deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;
