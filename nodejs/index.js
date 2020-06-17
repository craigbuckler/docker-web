// main application
'use strict';

const
  // HTTP port from NODE_PORT environment variable
  port = process.env.NODE_PORT || 3000,

  // Express.js module
  express = require('express'),
  app = express();


// root route with optional name
app.get('/:name?', (req, res) => {

  // returned message
  const message = `Hello ${ req.params.name  || 'World' }!`;

  if (req.xhr) {

    // JSON response when HTTP "X-Requested-With" header set to "XMLHttpRequest"
    res
      .set('Access-Control-Allow-Origin', '*')
      .json({ message });

  }
  else {

    // text response for all other requests
    res.send( message );

  }

});

// start HTTP server
app.listen(port, () =>
  console.log(`server running on port ${port}`)
);
