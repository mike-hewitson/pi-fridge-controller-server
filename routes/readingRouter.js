var myLogger = require('../logging');
var ForecastIo = require('forecastio');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var winston = require('winston');
var Papertrail = require('winston-papertrail').Papertrail;

var myLogger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            json: true,
            expressFormat: true,
            colorize: true
        }),
        new winston.transports.Papertrail({
            host: 'logs4.papertrailapp.com',
            port: 32583, // your port here
            program: 'rest-server',
            colorize: true
        })
    ]
});


var Readings = require('../models/readings');

var readingRouter = express.Router();

readingRouter.use(bodyParser.json());

readingRouter.route('/')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {
        Readings.find({}, function(err, reading) {
            if (err) throw err;
            res.json(reading);
        });
    })
    .post(function(req, res, next) {

        // var forecastIo = new ForecastIo('<apiKey>');
        // forecastIo.forecast('51.506', '-0.127').then(function(data) {
        //     console.log(JSON.stringify(data, null, 2));
        // });
                // myLogger.info("incoming body", req.body);
        Readings.create(req.body, function(err, reading) {
            if (err) {
                myLogger.error(err);
                // myLogger.error(req);
                myLogger.error(req.body);
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end('Validation error on reading');
                // throw err;
            } else {
                console.log('reading created!');
                var id = reading._id;

                res.writeHead(201, {
                    'Content-Type': 'text/plain'
                });
                res.end('Added the reading with id: ' + id);
            }
        });
    })
    .delete(function(req, res, next) {
        Readings.remove({}, function(err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

readingRouter.route('/:readingId')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {
        Readings.findById(req.params.readingId, function(err, reading) {
            if (err) throw err;
            res.json(reading);
        });
    })
    .put(function(req, res, next) {
        Readings.findByIdAndUpdate(req.params.readingId, {
            $set: req.body
        }, {
            new: true
        }, function(err, reading) {
            if (err) throw err;
            res.json(reading);
        });
    })
    .delete(function(req, res, next) {
        Readings.findByIdAndRemove(req.params.readingId, function(err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

readingRouter.route('/:readingId/sensors')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {
        Readings.findById(req.params.readingId, function(err, reading) {
            if (err) throw err;
            res.json(reading.sensors);
        });
    })
    .post(function(req, res, next) {
        Readings.findById(req.params.readingId, function(err, reading) {
            if (err) throw err;
            reading.sensors.push(req.body);
            reading.save(function(err, reading) {
                if (err) throw err;
                console.log('Updated sensors!');
                res.json(reading);
            });
        });
    })
    .delete(function(req, res, next) {
        Readings.findById(req.params.readingId, function(err, reading) {
            if (err) throw err;
            for (var i = (reading.sensors.length - 1); i >= 0; i--) {
                reading.sensors.id(reading.sensors[i]._id).remove();
            }
            reading.save(function(err, result) {
                if (err) throw err;
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all sensors!');
            });
        });
    });

// readingRouter.route('/:readingId/comments/:commentId')
//     .get(function(req, res, next) {
//         Readings.findById(req.params.readingId, function(err, reading) {
//             if (err) throw err;
//             res.json(reading.comments.id(req.params.commentId));
//         });
//     })
//     .put(function(req, res, next) {
//         // We delete the existing commment and insert the updated
//         // comment as a new comment
//         Readings.findById(req.params.readingId, function(err, reading) {
//             if (err) throw err;
//             reading.comments.id(req.params.commentId).remove();
//             reading.comments.push(req.body);
//             reading.save(function(err, reading) {
//                 if (err) throw err;
//                 console.log('Updated Comments!');
//                 res.json(reading);
//             });
//         });
//     })
//     .delete(function(req, res, next) {
//         Readings.findById(req.params.readingId, function(err, reading) {
//             reading.comments.id(req.params.commentId).remove();
//             reading.save(function(err, resp) {
//                 if (err) throw err;
//                 res.json(resp);
//             });
//         });
//     });

module.exports = readingRouter;
