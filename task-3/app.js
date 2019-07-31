const { httpClient } = require('./http-client');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

const fakeAPIurl = 'https://randomuser.me/api/';
const options = {
  headers: {
    'Content-Type': 'application/json'
  }
};

app.use(logger);
app.use(requestCounter);
app.use(bodyParser.json());
app.post('/sum', sumRequestHandler);
app.get('/anything', fakeDataReqestHadnler);
app.use(errorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;

function errorHandler(err, req, res, next) {
  console.error(`Error: ${err.message}`);
  res.status(err.status || 500);
}

function requestCounter(req, res, next) {
  next();
}

function logger(req, res, next) {
  next();
}

function sumRequestHandler(req, res, next) {
  const { a } = req.query;
  const { b, c } = req.body;
  const sum = parseFloat(a) + parseFloat(b) + parseFloat(c);

  res.set('Content-Type', 'application/json');

  if (Number.isNaN(sum)) {
    res.status(400).send({ error: 'Parameters invalid' });
  } else {
    res.status(200).send({ answer: sum });
  }
  next();
}

async function fakeDataReqestHadnler(req, res, next) {
  try {
    const data = await httpClient.get(fakeAPIurl, options);
    res.send(data);
  } catch (e) {
    next(e.message);
  } finally {
    res.end();
    next();
  }
}
