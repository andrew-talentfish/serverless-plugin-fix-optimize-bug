'use strict';

/**
 * @module serverless-plugin-fix-optimize-bug
 *
 * @see {@link https://github.com/andrew-talentfish/serverless-plugin-fix-optimize-bug}
 *
 * @requires 'bluebird'
 * @requires 'fs-extra'
 * */

const BbPromise = require('bluebird');
const fs = BbPromise.promisifyAll(require('fs-extra'));

class Fix {
  constructor(serverless, options) {
    /** Serverless variables */
    this.serverless = serverless;
    this.options = options;
    this.custom = this.serverless.service.custom;

    this.provider = this.serverless.getProvider('aws');

    /** Runtime >=node4.3 */
    const validRunTime =
      !this.serverless.service.provider.runtime ||
      this.serverless.service.provider.runtime === 'nodejs4.3' ||
      this.serverless.service.provider.runtime === 'nodejs6.10' ||
      this.serverless.service.provider.runtime === 'nodejs8.10' ||
      this.serverless.service.provider.runtime === 'nodejs10.x' ||
      this.serverless.service.provider.runtime === 'nodejs12.x';

    /** AWS provider and valid runtime check */
    if (validRunTime) {
      let nodeVersion = 'current';

      if (this.serverless.service.provider.runtime) {
        nodeVersion = this.serverless.service.provider.runtime.split(
          'nodejs',
        )[1];
      }

      if (nodeVersion.endsWith('.x')) {
        nodeVersion = nodeVersion.replace(/\.x$/, '');
      }

      this.fix();
    }
  }

  fix() {
    fs.copyFile('node_modules/serverless-plugin-fix-optimize-bug/src/out/reader.js', 'node_modules/fast-glob/out/readers/reader.js', (err) => {
      if (err) throw err;
    });
    fs.copyFile('node_modules/serverless-plugin-fix-optimize-bug/src/out/stream.js', 'node_modules/fast-glob/out/readers/stream.js', (err) => {
      if (err) throw err;
    });
    fs.copyFile('node_modules/serverless-plugin-fix-optimize-bug/src/out/sync.js', 'node_modules/fast-glob/out/readers/sync.js', (err) => {
      if (err) throw err;
    });
  }
}

/** Export optimize class */
module.exports = Fix;
