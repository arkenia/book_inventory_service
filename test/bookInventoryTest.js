var request = require('supertest');
var assert = require('assert');
var repository = require('../src/inMemoryStockRepository')();
var auth = require('../src/auth');
var noOpMiddleware = function (req, res, next) {
    next();
};

describe('Book inventory', function () {
    it('allows to stock up the items', function (done) {
        var app = require('../src/app.js')(repository, noOpMiddleware);
        request(app)
            .post('/stock')
            .send({
                isbn: '1234',
                count: 10
            })
            .expect('Content-Type', /json/)
            .expect(200, {isbn: '1234', count: 10}, done);
    });

    it('show now let users without credentials in', function (done) {
        var app = require('../src/app.js')(null, auth('user', 'pass'));

        request(app).get('/stock/1234').expect(401, done);
    });
});