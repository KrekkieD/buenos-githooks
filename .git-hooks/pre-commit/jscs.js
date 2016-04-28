#!/usr/bin/env node

'use strict';

var $buenosJscs = require('buenos-jscs');

$buenosJscs().promise
    .then(function (result) {
        if (result.totalErrorCount > 0) {
            setTimeout(function () {
                throw 'failed';
            });
        }
    });

