const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {type: String, require: true, unique: true},
  ingredients:[{type: String, required: true}],
  comments: [{type: String}]
});

foodSchema.set('timestamps', true);

// Customize output for `res.json(data)`, `console.log(data)` etc.
foodSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});


module.exports = mongoose.model('Food', foodSchema);