var express = require('express');
var ECT = require('ect');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');

var app = express();
var ectRenderer = ECT({watch: true, root: __dirname + '/views', ext: '.ect'});

var dbUrl = 'mongodb://localhost:27017/sample';

app.engine('ect', ectRenderer.render);
app.set('view engine', 'ect');
app.use('/static', express.static('public'));

app.get('/', function (req, res) {
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            throw err;
        }   

        var testCollection = db.collection('sample_collection');

        testCollection.find({}).sort({created: -1}).limit(40).toArray(function (err, docs) {
            db.close();
            res.render('index', {docs: docs, moment: moment});
        }); 
    }); 
}); 

app.listen(3000);
