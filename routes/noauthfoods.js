
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Food.findOne({_id: id})
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Food.findOne({_id: id})
    .then(result => {
      console.log(result, 'result of food db query');
      if (result) {
        // let allergenList = new Set();
        const lowerIngred = result.ingredients.map(item => item.toLowerCase()/* .split(' ') */);
        // console.log(lowerIngred, 'strings');
        // console.log(allergenList, 'allergenlist');
        //and in a split to account for two word ingredients if time to improve query
        Allergen.find({name: {$in: lowerIngred}})
          .then(allergy => {
            console.log(allergy, 'object from 2nd db call');
            // allergenList.add(allergy);
            // console.log(allergenList, 'allergenlist');
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


router.put('/:id/comments', (req, res, next) => {
  const { id } = req.params;
  const { comments, search } = req.body;
  console.log(comments, search);
  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (comments.trim() === '') {
    const err = new Error('You can not enter in nothing');
    err.status = 400;
    return next(err);
  }

  const postComment = { comments };

  Food.findOneAndUpdate({_id: id}, {$push: postComment}, {new: true})
    .then(result => {
      console.log(result, 'new comment');
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