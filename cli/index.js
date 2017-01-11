#!/usr/bin/env node

const axios = require('axios');
const colors = require('colors');
const fs = require('fs');
const tar = require('tar');

const info = message => console.log(colors.blue(`\n ${message} \n`));
const error = message => console.log(colors.red(`\n ${message} \n`)) && process.exit();

if (process.argv.length < 4) {
  error('You forgot to give the package name. Use the following synax: \n rpm install express');
}

const package = process.argv.pop();
info(`Resolving ${package}`);

let url = 'https://rpm.now.sh';
if (process.env.dev) url = 'http://localhost:3000';

const download = hash => {
  if (!hash) error('Oops! something went horribly wrong!');
  else {
    info('Resolved, now downloading');
    axios({
      url: `${url}/public/${hash}.tar`,
      responseType: "arraybuffer"
    })
    .then(response => {
      info('Downloaded, unpacking');
      fs.writeFileSync(`${process.cwd()}/node_modules.tar`, response.data, 'binary');
      const extractor = tar.Extract({path: process.cwd()})
      .on('error', error)
      .on('end', () => fs.unlink(`${process.cwd()}/node_modules.tar`));

      fs.createReadStream(`${process.cwd()}/node_modules.tar`)
      .on('error', error)
      .pipe(extractor);
    })
    .catch(error => console.log(colors.red(error)));
  }
};

axios.get(`${url}/package/${package}`)
.then(response => download(response.data))
.catch(error => console.log(colors.red(error)));
