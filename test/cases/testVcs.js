/*
 * fis
 * http://fis.baidu.com/
 * 2014/4/16
 */

'use strict';

var assert = require("assert");
var vcs = require('../../lib/vcs.js');
describe('vcs', function() {
    describe('#getClient()', function () {
        it("should get client", function () {
            var client = vcs.getClient('svn');
            assert.equal(client.name, 'svn');
        });
    });
});