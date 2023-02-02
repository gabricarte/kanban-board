var express = require('express');
var assert = require('assert');
var restify = require('restify-clients');
var router = express.Router();

// Creates a JSON client
var client = restify.createJsonClient({
  url: 'http://localhost:4000/'
});

/* first calling the '/cards' of the client server, and then, the '/cards' of the restful server  */

router.get('/', function (req, res, next) {

  client.get('/cards', function (err, request, response, obj) {

    assert.ifError(err);

    res.json(obj);

  });

});

router.get('/:id', function (req, res, next) {

  client.get(`/cards/${req.params.id}`, function (err, request, response, obj) {

    assert.ifError(err);

    res.json(obj);

  });

});


router.post('/', function (req, res, next) {

  client.post('/cards', req.body, function (err, request, response, obj) {

    assert.ifError(err);

    res.end(JSON.stringify(obj, null, 2));

  });

});

router.put('/:id', function (req, res, next) {

  client.put(`/cards/${req.params.id}`, req.body, function (err, request, response, obj) {

    assert.ifError(err);

    res.end(JSON.stringify(obj, null, 2));

  });

});

router.delete('/:id', function (req, res, next) {

  client.del(`/cards/${req.params.id}`, function (err, request, response, obj) {

    assert.ifError(err);

    res.end(JSON.stringify(obj, null, 2));

  });

});


module.exports = router;
