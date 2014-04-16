/*
 * fis
 * http://fis.baidu.com/
 * 2014/4/16
 */

'use strict';

var SVN = require('node.svn');

var client = module.exports;

function download(url, destPath, callback){
    var svn = new SVN(destPath);
    svn.co(url, function(err, info){
       callback && callback(err, info)
    });
}

client.name = 'svn';
client.download = download;


