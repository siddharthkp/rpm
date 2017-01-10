const pack = require('./pack');
const serve = require('./serve');
require('now-logs')('super-secret-key-bro');

module.exports = (req, res) => {

  const type = req.url.split('/')[1];
  const info = req.url.split('/')[2];

  if (type === 'package') pack(info, res);
  else if (type === 'public') serve(info, res);
  else {
    res.statusCode = 404;
    res.end();
  }

  process.on('uncaughtException', err => {
    console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
    console.error(err.stack);
  });

};
