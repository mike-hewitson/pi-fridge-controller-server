/* test/test_dish.js*/

var request = require('supertest');
var assert = require('chai').assert
var expect = require('chai').expect

// var assert = require('assert');
var mongoose = require('mongoose');

require('dotenv').config();
var app = require('../app');
var Readings = require('../models/readings');

var STRICT_REST = true; // change that to false depending on https://www.coursera.org/learn/server-side-development/lecture/bKtMl/exercise-video-rest-api-with-express-mongodb-and-mongoose/discussions/x1AZIu9SEeWB0QpuSDkq-Q
var HTTP_OK = 200;
var HTTP_CREATED = (STRICT_REST) ? 201 : HTTP_OK;
var HTTP_NOT_FOUND = 404;

/*
 * Data
 */
var readings_fixture = require('./fixtures/readings_fixture');

/*
 * Tests
 */
describe('Latest', function() {
    beforeEach(function(done) {
        Readings.remove({}, function(err, res) { // don't use drop() as this will occasionnnaly raise a background operation error
            Readings.insertMany(readings_fixture, done);
        });
    });

    describe('GET /history', function() {
        it('respond with code HTTP_OK + list of 9 readings', function(done) {
            request(app)
                .get('/history')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(HTTP_OK)
                .expect(function(res) {
                    assert.equal(res.body.length, 9);
                })
                .end(done);
        });
    });

    describe('GET /history/2', function() {
        it('respond with code HTTP_OK + list of 7 readings', function(done) {
            request(app)
                .get('/history/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(HTTP_OK)
                .expect(function(res) {
                    assert.equal(res.body.length, 7);
                })
                .end(done);
        });
    });
});
