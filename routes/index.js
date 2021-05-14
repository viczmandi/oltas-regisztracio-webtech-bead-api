var express = require('express');
var router = express.Router();
const OID = require('mongodb').ObjectID;

router.get('/vakcina', (req, res, next) => {
  req.collection.find({})
    .toArray()
    .then(results => res.json(results))
    .catch(error => res.json(error));
})

router.post('/vakcina', (req, res, next) => {
  const { name, age, email, telnum, taj } = req.body;
  if (!name || !age || !email || !telnum) {
    return res.status(400).json({
      message: 'Helytelen vagy üres mező!'
    })
  }

  const date = randomDate(new Date(2021, 5, 14), new Date(2021, 12, 31))
  const payload = { date, name, age, email, telnum, taj };
  req.collection.insertOne(payload)
    .then(result => res.json(result.ops[0]))
    .catch(error => res.send(error));
})

router.delete('/vakcina/:id', (req, res, next) => {
  const { id } = req.params;
  const _id = OID(id);

  req.collection.deleteOne({ _id })
    .then(result => res.json(result))
    .catch(error => res.send(error));
})

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

module.exports = router;
