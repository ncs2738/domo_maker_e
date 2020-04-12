const models = require('../models');

const { Domo } = models;

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.class || !req.body.level) {
    return res.status(400).json({ error: 'Name, age, class, and level are all required dude.' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    class: req.body.class,
    level: req.body.level,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists man.' });
    }

    return res.status(400).json({ error: 'An error occured; Sorry.' });
  });

  return domoPromise;
};

const deleteDomo = (req, res) =>
{
  Domo.DomoModel.deleteDomo(req.body.id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Error in deleting. Sorry bud.' });
    }

    console.log("Succesfully deleted!");
    return res.json({ domos: docs });
  });
}

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ err: 'An error occurred. Sorry about that.' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred. Sorry bud.' });
    }

    return res.json({ domos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.delete = deleteDomo;
