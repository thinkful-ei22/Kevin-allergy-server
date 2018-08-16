const mongoose = require('mongoose');

const allergenSchema = new mongoose.Schema({
  name: {type: String, require: true, unique: true},
  category: [{type: String, required: true}]
});

allergenSchema.set('timestamps', true);

// Customize output for `res.json(data)`, `console.log(data)` etc.
allergenSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});

//   milk: ['milk'],}{
//   peanuts: ['peanut'],}
//   rice: ['rice'],
//   sesame: ['sesame'],
//   soy: ['soy'],
//   sulfite: ['sulfite'],
//   garlic: ['garlic'],
//   oats: ['oat'],
//   wheat: ['wheat'],
//   fish: ['fish'],
//   meat: ['beef', 'pork', 'lamb'],

//   shellfish: ['shrimp', 'crab','lobster','clam','mussel','oyster','scallop'],

//   fruit: ['mango', 'strawberry', 'apple', 'avocado', 'banana', 
//     'cherry', 'orange', 'grapefruit', 'clementine', 'kiwi', 'melon', 
//     'nectarine', 'peach', 'pear', 'pineapple', 'plum', 'tomato'],

//   'hot peppers': ['jalapeno', 'habanero', 'serrano pepper', 'tabasco pepper', 
//     'chili pepper', 'carolina reaper', 'pimiento'],

//   'tree nuts': ['almond', 'brazil nut', 'cashew', 'chestnut', 
//     'cobnut', 'filbert nut', 'hazelnut', 'filbert', 'macadamia nut', 
//     'pecan', 'pistachio', 'pine nut', 'shea nut', 'walnut']
// }

module.exports = mongoose.model('Allergen', allergenSchema);