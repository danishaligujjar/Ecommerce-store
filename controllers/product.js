const Product = require("../models/product");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandlers");
const formidable = require("formidable");
const _ = require("lodash");

// ProductByID Middleware

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "Product not found",
      });
    }
    req.product = product;
    next();
  });
};

// Product View Method

exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// Product Create Method

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image couldn't be uploaded",
      });
    }

    // Check for fields as they are required

    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
    }

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json(product);
    });
  });
};

// Product Update Method

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image couldn't be uploaded",
      });
    }

    // Check for fields as they are required

    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let product = req.product;
    product = _.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
    }

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(product);
    });
  });
};

// Product Delete Method

exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Product Deleted Successfully",
    });
  });
};

// Product List Method

// SELL || ARRIVAL
// BY SELL = /products?sortBy=sold&Order=desc&limit=4
// BY ARRIVAL = /products?sortBy=createdAt&Order=desc&limit=4
// If no prams are sent, we return an all products.

exports.list = (req, res) => {
  //Queries based on the frontend client request

  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  //Pull products from databse based on above queries

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      res.json(products);
    });
};

// Product ListRelated Methods

// It is going to find products related to the requested product category and return them.

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      res.json(products);
    });
};

// Product Catagory Methods

exports.listCatagories = (req, res) => {
  Product.distinct("category", {}, (err, catagories) => {
    if (err) {
      return res.status(400).json({
        error: "Product not found",
      });
    }
    res.json(catagories);
  });
};

//Product by search methods

// List the products by search
// we will impliment product search in react frontend
// we will show categories  in checkboxes and price range in radio buttons
// as user can click on those radio buttons and checkboxes
// we will make api request and show  the  products to users based on what he wants.

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key == "price") {
        // gte - greater than price [1-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec(function (err, data) {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

// Product Photos - will act as a Middleware

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};
