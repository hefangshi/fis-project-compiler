/*
 * fis
 * http://fis.baidu.com/
 * 2014/4/11
 */

'use strict';

var compiler = module.exports;

compiler.compiler = require('./lib/compiler.js');

compiler.vcs = require('./lib/vcs.js');

compiler.injection = require('./lib/injection.js');