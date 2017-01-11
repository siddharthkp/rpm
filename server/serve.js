const fs = require('fs');

module.exports = (filename, res) => {
  const path = `/tmp/public/${filename}`;
  fs.readFile(path, 'binary', (err, file) => {
    if(err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.write(err + '\n');
      res.end();
      return;
    }

    res.writeHead(200, {'Accept-Ranges': 'bytes'});
    res.write(file, 'binary');
    res.end();
  });
}
