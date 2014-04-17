/*
 * fis
 * http://fis.baidu.com/
 * 2014/4/16
 */

'use strict';

var assert = require("assert");
var path = require("path");
var fs = require('fs');
var compiler = require('../../lib/compiler.js');
var projectPath = __dirname + "/../testProject/src";
var errorProjectPath = __dirname + "/../testProject/error_src";
var bin = path.normalize(__dirname + "../../../node_modules/.bin/fisp");
var injection = require('../../lib/injection.js');
describe('compiler', function() {
    describe('#getModules()', function () {
        it("should get project modules with projectPath", function () {
            var client = new compiler(projectPath);
            var modules = client.getModules();
            assert.notEqual(modules.indexOf('common'), -1);
            assert.notEqual(modules.indexOf('home'), -1);
            assert.equal(modules.length, 2);
        });
        it("should get project modules with module path", function () {
            var client = new compiler(projectPath + '/home');
            var modules = client.getModules();
            assert.deepEqual(modules, ["home"]);
        });
        it("should get none with invalid folder", function () {
            var client = new compiler(projectPath + '/ccc');
            var modules = client.getModules();
            assert.deepEqual(modules, []);
        });
        it("should get none with folder which is not fis-plus project", function () {
            var client = new compiler(projectPath + '/something');
            var modules = client.getModules();
            assert.deepEqual(modules, []);
        });
    });
    describe('#compile()', function () {
        it("should compile testproject successfully", function (done) {
            var output = path.normalize(projectPath + '/../../output/all');
            fis.util.del(output);
            var client = new compiler(projectPath, {
                compileCMD: bin + ' release --no-color -pd ../../../output/all'
            });
            client.compile(function(err){
                assert.equal(err,undefined);
                done();
            });
        });
        it("should compile single module successfully", function (done) {
            var output = path.normalize(projectPath + '/../../output/common');
            fis.util.del(output);
            var client = new compiler(projectPath + '/common', {
                compileCMD: bin + ' release --no-color -pd ../../../output/common'
            });
            client.compile(function(err){
                assert.equal(err,undefined);
                done();
            });
        });
        it("should compile test-wrong-project failed", function (done) {
            var output = path.normalize(errorProjectPath + '/../../output/err');
            fis.util.del(output);
            var client = new compiler(errorProjectPath, {
                compileCMD: bin + ' release --no-color -pd ../../../output/err'
            });
            client.compile(function(err){
                assert.notEqual(err,undefined);
                done();
            });
        });
        it("should support beforeCompile setting", function (done) {
            var output = path.normalize(projectPath + '/../../output/common_ext');
            fis.util.del(output);
            var client = new compiler(projectPath + '/common', {
                compileCMD: bin + ' release --no-color -pd ../../../output/common_ext'
            });
            client.compile(
                function(err){
                    assert.equal(err,undefined);
                    //get hash
                    var conf = fis.util.readJSON(output+"/config/common-map.json");
                    assert.equal(conf['res']['common:page/layout.tpl'].hash ,'0e132eb');
                    done();
                },function(module){
                    var path = client.getModulePath(module);
                    //inject fis-conf.js to add ext-map
                    injection.apply(path, injection.EXT_MAP);
                },function(module){
                    var path = client.getModulePath(module);
                    injection.revert(path);
                }
            );
        });
    });
});