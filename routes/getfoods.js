
const express = require('express');
const mongoose = require('mongoose');

const Food = require('../db/models/food');
const Allergen = require('../db/models/allergen');

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
    // .populate('tags')
    .then(result => {
      if (result) {
        console.log(result, result.ingredients, '&&&&&&&&&&&&&&&&&&&&&&&');
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id/allergens', (req, res, next) => {
  const { id } = req.params;
  console.log(id, 'id');
  // const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Food.findOne({_id: id, /* userId */})
    .then(result => {
      console.log(result, 'result of food db query');
      if (result) {
        // const allergenList = {};
        // console.log(allergenList, 'allergenList');
        const lowerIngred = result.ingredients.map(item => item.toLowerCase());
        Allergen.find({name: {$in: lowerIngred}})
          .then(allergy => {
            console.log(allergy, 'object from 2nd db call');
            res.json(allergy);
          });
        // res.json(allergenList);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;