
const express = require('express');
const mongoose = require('mongoose');

const Food = require('../db/models/food');

const router = express.Router();

//get all with or without searchterm
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

//create a new food item, most likely with jwt auth
router.post('/', (req, res, next) => {
  const { name, ingredients= [] } = req.body;
  console.log(name, ingredients);
  /* const userId = req.user.id; */
  //validating input
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  // if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
  //   const err = new Error('The `folderId` is not valid');
  //   err.status = 400;
  //   return next(err);
  // }

  // if (tags) {
  //   tags.forEach((tag) => {
  //     if (!mongoose.Types.ObjectId.isValid(tag)) {
  //       const err = new Error('The tags `id` is not valid');
  //       err.status = 400;
  //       return next(err);
  //     }
  //   });
  // }

  const newFood = { name, ingredients, /* userId */ };

  Food.create(newFood)
    .then(result => {
      res
        .location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

//update a food item, with jwt auth
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const {name, ingredients = [] } = req.body;
  // const userId = req.user.id;
  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (name === '') {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  // if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
  //   const err = new Error('The `folderId` is not valid');
  //   err.status = 400;
  //   return next(err);
  // }

  // if (tags) {
  //   const badIds = tags.filter((tag) => !mongoose.Types.ObjectId.isValid(tag));
  //   if (badIds.length) {
  //     const err = new Error('The tags `id` is not valid');
  //     err.status = 400;
  //     return next(err);
  //   }
  // }

  const updateFood = { name, ingredients };

  Food.findOneAndUpdate({_id: id, /* userId */}, updateFood, { new: true })
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

//delete a food item with jwt auth
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  // const userId = req.user.id;
  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Food.findOneAndDelete({_id: id, /* userId */})
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;