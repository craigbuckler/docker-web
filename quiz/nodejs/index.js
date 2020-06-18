// main application

'use strict';

// load environment
require('dotenv').config();

const
  // initialize database
  quizDB = require('./lib/db'),

  // default HTTP port
  port = process.env.NODE_PORT || 8000,

  // express
  express = require('express'),
  app = express();


// static files
app.use(express.static('./static'));

// header middleware
app.use((req, res, next) => {

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'must-revalidate, max-age=0'
  });
  next();

});

// route: fetch a question
app.get('/question', async (req, res) => {

  const q = await quizDB.getQuestion();

  if (q) res.json(q);
  else res.status(500).send('service unavailable');

});

// start HTTP server
app.listen(port, () =>
  console.log(`quiz app running on port ${port}`)
);
