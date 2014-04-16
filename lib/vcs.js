/*
 * fis
 * http://fis.baidu.com/
 * 2014/4/16
 */

'use strict';

module.exports.getClient = function(type){
    return require('./vcs/' + type + '.js');
};