const Product = require("../models/product");
const fs = require("fs");
const {errorHandler} = require('../helpers/dbErrorHandlers')
const formidable = require("formidable");
const _ = require("lodash");

exports.create = (req, res) => {

    let form = new formidable.IncomingForm();

    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image couldn't be uploaded"
            })
        }

        // Check for fields as they are required

        const {name, description, price, category, quantity, shipping} = fields
        if (!name || !description || !price || !category || !quantity || !shipping){
             return res.status(400).json({
                error: "All fields are required"
             });
        }

        let product = new Product(fields);


        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb"
            });
            }
          product.photo.data = fs.readFileSync(files.photo.filepath);
          product.photo.contentType = files.photo.mimetype;
        }

        product.save((err, product) => {
            if (err) {
            return res.status(400).json({
            error: errorHandler(error)
                })
            }
            res.json(product);
            })
    })
}

