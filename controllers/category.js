const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandlers");

// CategoryByID Middleware Method

exports.categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    req.category = category;
    next();
  });
};

// Category Create Method

exports.create = (req, res) => {
  const category = new Category(req.body);
  category.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: "Category does not exist",
      });
    }
    res.json({ data });
  });
};

// Category Read Method

exports.read = (req, res) => {
  return res.json(req.category);
};

//Category Update Method

exports.update = (req, res) => {
  const category = req.category
  category.name = req.body.name
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data)
  })
};

// Catagory Delete Method

exports.remove = (req, res) => {
  let category = req.category;
  category.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Catagory Deleted Successfully",
    });
  });
};

// Categories List

exports.list = (req, res) => {
  Category.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data)
  })
}
