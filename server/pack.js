const syncExec = require('sync-exec');
const tar = require('tar');
const fstream = require('fstream');
const fs = require('fs');

module.exports = (module, res) => {

  if (!module) res.end(null);

  const logger = (error, stdout, stderr) => console.log(error, stdout, stderr);
  const uuid = `${module}-package`;
  const bundlePath = `/tmp/public/${uuid}.tar`;

  if (fs.existsSync(bundlePath)) res.end(uuid);
  else {
    syncExec(`mkdir /tmp/requests`, {stdio: [0, 1, 2]}, logger);
    syncExec(`mkdir /tmp/requests/${uuid}`, {stdio: [0, 1, 2]}, logger);

    process.chdir(`/tmp/requests/${uuid}`);
    syncExec('npm init -y');
    syncExec(`npm install ${module}`, {stdio: [0, 1, 2]});

    const dirSource = `/tmp/requests/${uuid}/node_modules`;

    syncExec(`mkdir /tmp/public`, {stdio: [0, 1, 2]}, logger);
    const dirDest = fs.createWriteStream(bundlePath);

    const onError = err => res.end('fail');
    const onEnd = () => {
      syncExec(`rm -r /tmp/requests/${uuid}`);
      res.end(uuid);
    };

    const packer = tar.Pack({noProprietary: true})
    .on('error', onError)
    .on('end', onEnd);

    fstream.Reader({path: dirSource, type: "Directory"})
    .on('error', onError)
    .pipe(packer)
    .pipe(dirDest);
  }
}
