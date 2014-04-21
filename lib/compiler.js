/*
 * fis
 * http://fis.baidu.com/
 * 2014/4/16
 */

'use strict';

var fs = require('fs');
var fis = global.fis || require('fis-kernel');
var exec = require("child_process").exec;
var async = require("async");

function compiler(projectPath, options){
    projectPath = fis.util.realpath(projectPath);
    var modules = null;
    var modulePath = null;
    getModules();
    options = options || {};
    options.output = options.output || '../../output';
    options.compileCMD = options.compileCMD || 'fisp release --no-color -pod ' + options.output;

    function getModules(){
        if (modules)
            return modules;
        modules = [];
        modulePath = {};
        if (!projectPath)
            return modules;
        var list = fs.readdirSync(projectPath);
        if (list.indexOf('fis-conf.js') !== -1){
            var moduleName = projectPath.split(/[\\|\/]/).pop();
            modulePath[moduleName] = projectPath;
            modules.push(moduleName);
            return modules;
        }else{
            modules= list.filter(function(v) {
                var conf = projectPath + "/" + v + "/fis-conf.js";
                if(fis.util.exists(conf)){
                    modulePath[v] = fis.util.realpath(projectPath + "/" + v);
                    return v;
                }
            });
            return modules;
        }
    }

    function compile(callback, beforeCompile, afterCompile){
        var modules = getModules();
        var count = 0;
        var output = {};
        async.whilst(
            function() {return count < modules.length},
            function(cb) {
                var module = modules[count];
                count++;
                beforeCompile && beforeCompile(module);
                run(module, function(error){
                    afterCompile && afterCompile(module);
                    cb && cb(error);
                }, function(stdout, stderr){
                    output[module] = {
                        stdout:stdout,
                        stderr:stderr
                    }
                });
            },
            function(err) {
                callback && callback(err, output)
            }
        );

        function run(module, callback, log){
            var path = getModulePath(module);
            var cmd = null;
            if (typeof options.compileCMD == 'function')
                cmd = options.compileCMD(module, path);
            else
                cmd = options.compileCMD;
            exec(cmd, {cwd: path},function(error, stdout, stderr){
                log && log(stdout, stderr);
                callback&&callback(error);
            });
        }

    }

    function getModulePath(module){
        return modulePath[module];
    }

    return {
        getModules:getModules,
        compile:compile,
        getModulePath:getModulePath
    }
}

module.exports = compiler;