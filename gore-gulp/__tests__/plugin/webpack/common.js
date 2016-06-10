/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const assert = require('chai').assert;
const fixtureDir = '../../../__fixtures__';
const fs = require('fs');
const gg = require('../../../index');
const Gulp = require('gulp').Gulp;
const merge = require('lodash/merge');
const noop = require('lodash/noop');
const path = require('path');
const Promise = require('bluebird');
const test = require('lookly-preset-ava/test');
const tmp = require('tmp');

function doFiles(paths, cb) {
  return function (distDir) {
    const promises = paths.map(function (pth) {
      return Promise.fromCallback(function (statCb) {
        fs.stat(path.resolve(distDir, pth), statCb);
      }).then(function (stats) {
        return cb(stats.isFile(), pth);
      }).catch(function (err) {
        if (err.code === 'ENOENT') {
          return cb(false, pth);
        }

        throw err;
      });
    });

    return Promise.all(promises).then(noop);
  };
}

function expectFiles(paths) {
  return doFiles(paths, assert.ok);
}

function notExpectFiles(paths) {
  return doFiles(paths, assert.notOk);
}

function runDirectory(baseDir, variant) {
  const gulpInstance = new Gulp();
  let distDir;

  gg({
    baseDir,
    override(pckg) {
      return Promise.fromCallback(tmp.dir).then(function (tmpDir) {
        distDir = path.resolve(tmpDir, pckg.directories.dist);

        return merge(pckg, {
          directories: {
            dist: distDir,
          },
        });
      });
    },
  }).setup(gulpInstance);

  return new Promise(function (resolve, reject) {
    gulpInstance.on('err', function (err) {
      reject(err.err);
    });
    gulpInstance.on('stop', resolve);

    gulpInstance.start(variant);
  }).then(function () {
    return distDir;
  });
}

function setup(variant) {
  [
    {
      expectFiles: [
        'test-library-1.module.min.js',
        'test-library-1.test.min.js',
      ],
      fixture: 'test-library-1',
      name: 'generates output using .entry files',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-2.true.min.js',
      ],
      fixture: 'test-library-2',
      name: 'uses library location specified in package configuration',
      notExpectFiles: [
        'test-library-2.not-an.min.js',
      ],
    },
    {
      expectFiles: [
        'test-library-3.index.min.js',
      ],
      fixture: 'test-library-3',
      name: 'uses vendor libraries configuration field',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-4.index.min.js',
      ],
      fixture: 'test-library-4',
      name: 'resolves nested modules paths',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-5.fake-module-holder.min.js',
      ],
      fixture: 'test-library-5',
      name: 'resolves node_modules paths',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-6.index.min.js',
      ],
      fixture: 'test-library-6',
      name: 'uses externals settings',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-7.first-pointof.min.js',
      ],
      fixture: 'test-library-7',
      name: 'resolves multiple entry points',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-9.index.min.js',
      ],
      fixture: 'test-library-9',
      name: "uses 'provide' plugin",
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-11.symfony.min.js',
      ],
      fixture: 'test-library-11',
      name: 'symfony package directory structure',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-13.first.min.js',
      ],
      fixture: 'test-library-13',
      name: 'multiple library paths',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-14.index.min.js',
      ],
      fixture: 'test-library-14',
      name: 'uses ES6 decorators',
      notExpectFiles: [],
    },
  ].forEach(function (testData) {
    test(testData.name, function () {
      let distDir;

      return runDirectory(path.resolve(__dirname, fixtureDir, testData.fixture), variant)
        .then(function (dd) {
          distDir = dd;

          return dd;
        })
        .then(expectFiles(testData.expectFiles))
        .then(function () {
          return distDir;
        })
        .then(notExpectFiles(testData.notExpectFiles));
    });
  });
}

module.exports = {
  expectFiles,
  runDirectory,
  setup,
};
