const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

// mongoose.Types.ObjectID is a function
// that converts string ID to a real mongo ID

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name:
    {
      type: String,
      require: true,
      trim: true,
      set: setName,
    },

  age:
    {
      type: Number,
      min: 0,
      require: true,
    },

  class:
  {
    type: String,
    require: true,
    trim: true,
  },

  level:
    {
      type: Number,
      min: 0,
      require: true,
    },

  owner:
    {
      type: mongoose.Schema.ObjectId,
      require: true,
      ref: 'Account',
    },

  createdData:
    {
      type: Date,
      default: Date.now,
    },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  class: doc.class,
  level: doc.level,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name age class level').lean().exec(callback);
};

DomoSchema.statics.deleteDomo = (Id, callback) =>
{
  return DomoModel.deleteOne({ _id: Id }, callback);
}

DomoSchema.statics.findByName = (data, callback) =>
{
  const search = {
    owner: convertId(data.owner),
  };

  const name = {
    name: data.name,
  };

  return DomoModel.find(search).findOne(name, callback);
}

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
