/*
 * fis
 * http://fis.baidu.com/
 * 2014/4/17
 */

'use strict';

var fs = require('fs');

module.exports.EXT_MAP =
    "\r\n;if (typeof fis.config.data.modules.postpackager == 'string') fis.config.data.modules.postpackager = [fis.config.data.modules.postpackager];" +
    "fis.config.data.modules.postpackager = fis.config.data.modules.postpackager || [] ;"+
    "if (fis.config.data.modules.postpackager.indexOf('ext-map') == -1) fis.config.data.modules.postpackager.push('ext-map');";

module.exports.CLEAR_PACK = "fis.config.data.pack = null;";

module.exports.apply = function(path, injection){
    path = path + '/fis-conf.js';
    if (!fs.existsSync(path+".bak_injection"))
        fs.writeFileSync(path+".bak_injection", fs.readFileSync(path));
    fs.appendFileSync(path, injection);
};

module.exports.revert = function(path){
    path = path + '/fis-conf.js';
    if (fs.existsSync(path+".bak_injection"))
        fs.writeFileSync(path, fs.readFileSync(path+".bak_injection"));
};