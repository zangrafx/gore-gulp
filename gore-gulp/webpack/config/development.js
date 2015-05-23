/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var _ = require("lodash"),
    path = require("path"),
    web = require(path.resolve(__dirname, "web"));

function development(config, pckg, libDir, entries) {
    return _.merge(web(config, pckg, libDir, entries), {
        "debug": true,
        "devtool": "cheap-source-map"
    });
}

module.exports = development;
