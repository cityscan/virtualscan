var Browser = require('zombie'),
    assert = require('chai').assert;

var browser;

suite('Cross-Page Tests', function() {
    setup(function() {
        browser = new Browser();
    });

    test('Clicking on Contact from the VirtualScan map page should populate the referrer field', function(done) {
        var referrer = 'http://localhost:3000/';
        browser.visit(referrer, function() {
            browser.clickLink('.contact', function() {
                assert(browser.field('referrer').value === referrer);
                done();
            });
        });
    });

    test('visiting the "contact" page directly should result in an empty referrer field', function(done) {
        browser.visit('http://localhost:3000/contact', function() {
                assert(browser.field('referrer').value === '');
                done();
                });
    });
});
