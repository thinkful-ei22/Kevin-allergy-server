
const express = require('express');
const mongoose = require('mongoose');
const Food = require('../db/models/food');

//get all with or without searchterm
const router = express.Router();
router.get('/', (req, res, next) => {
  const {searchTerm} = req.query;
  let filter = {};

  if(searchTerm){
    const re = new RegExp(searchTerm, 'i');
    filter.$or = [{ 'name': re }];
  }

  Food.find(filter)
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

//get 1 food item specifically
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  // const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Food.findOne({_id: id, /* userId */})
    .populate('tags')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;