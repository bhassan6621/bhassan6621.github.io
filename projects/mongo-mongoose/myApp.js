require('dotenv').config();
const mongoose = require('mongoose');
const mySecret = process.env['MONGO_URI']
mongoose.connect(mySecret);

// make schema for model
const personSchema = new mongoose.Schema({
  name: {type: String, required: true},
  age: Number,
  favoriteFoods: [String]
});
//create a model using schema
let Person = mongoose.model('Person', personSchema);
//create a record of the model
const createAndSavePerson = (done) => {
  var bibiHassan = new Person({name:"Bibi Hassan", age:21, favoriteFoods:["pizza","fries"]});
  bibiHassan.save(function(err,data){
    if(err) return console.error(err);
    done(null, data);
  });
};
// create multiple records of the model
var arrayOfPeople = [
  {name:"sammy",age:23,favoriteFoods:["tacos"]},
  {name:"john",age:65,favoriteFoods:["burrito"]},
  {name:"abby",age:80,favoriteFoods:["soup"]}
];
var createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data)=> {
    if(err) return console.error(err);
    done(null, data);
  });
};
// find data in model(search database)
const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, function(err, personFound){
    if(err) return console.log(err);
    done(null, personFound);
  })
};
// return a single matching document from database
const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, data) => {
    if(err) return console.log(err);
    done(null,data);
  })
};
// search Database by ID
const findPersonById = (personId, done) => {
  Person.findById(personId, function (err, data) {
    if (err) return console.log(err);
    done(null, data);
  });
};
// perform classic updates by running Find, edit then save
const findEditThenSave = (personId, done) => {
  const foodToAdd = 'hamburger';

  // .findById() method to find a person by _id with the parameter personId as search key. 
  Person.findById(personId, (err, person) => {
    if(err) return console.log(err); 
  
    // Array.push() method to add "hamburger" to the list of the person's favoriteFoods
    person.favoriteFoods.push(foodToAdd);

    // and inside the find callback - save() the updated Person.
    person.save((err, updatedPerson) => {
      if(err) return console.log(err);
      done(null, updatedPerson)
    })
  })
};
// perform new updates on a document using model.findOneAndUpdate()
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, (err, updatedDoc) => {
    if(err) return console.log(err);
    done(null, updatedDoc);
  })
};
// delete one document using model.findByIdAndRemove
const removeById = (personId, done) => {
  Person.findByIdAndRemove(
    personId,
    (err, removedDoc) => {
      if(err) return console.log(err);
      done(null, removedDoc);
    }
  );
};
// delete many documents with model.remove()
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err, response) => {
    if(err) return console.log(err);
    done(null, response);
  })
};
// chain search query helpers to narrow search results
const queryChain = (done) => {
  var foodToSearch = "burrito";
  Person.find({favoriteFoods:foodToSearch}).sort({name : "asc"}).limit(2).select("-age").exec((err, data) => {
     if(err)
       done(err);
    done(null, data);
  })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
