/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var globSpread = require("../globSpread"),
    mocha = require("gore-mocha"),
    path = require("path");

module.exports = function (config, pckgPromise) {
    return function () {
        return pckgPromise.then(function (pckg) {
            return mocha(path.resolve(config.baseDir, globSpread(pckg.directories.lib), "**", "*.test.js"));
        });
    };
};
