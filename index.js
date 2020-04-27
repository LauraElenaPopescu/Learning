var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    Hapi = require('hapi');

var url = 'mongodb://localhost:27017/movies_database'

const server = new Hapi.Server({  
  host: 'localhost',
  port: 8080
})

server.route( [
    // Get tour list
    {
        method: 'GET',
        path: '/api/movies',
        config: {json: {space: 2}},
        handler: function(request, reply) {
            var findObject = {};
            for (var key in request.query) {
                findObject[key] = request.query[key]
            }
            collection.find(findObject).toArray(function(error, tours) {
                assert.equal(null,error);
                reply(movies);
            })
        }
    },
    // Add new tour
    {
        method: 'POST',
        path: '/api/movies',
        handler: function(request, reply) {
            collection.insertOne(request.payload, function(error, result) {
                assert.equal(null,error);
                reply(request.payload);
            })
        }
    },
    // Get a single tour
    {
        method: 'GET',
        path: '/api/movies/{_id}',
        config: {json: {space: 2}},
        handler: function(request, reply) {
            collection.findOne({"_id":request.params._id}, function(error, tour) {
               assert.equal(null,error);
               reply(movie);
            })
        }
    },
    // Update a single tour
    {
        method: 'PUT',
        path: '/api/movies/{_id}',
        handler: function(request, reply) {
            if (request.query.replace == "true") {
                request.payload.tourName = request.params._id;
                console.log(request.payload);
                collection.replaceOne({"_id": request.params._id},
                                      request.payload,
                   function(error, results) {
                        collection.findOne({"_id":request.params._id}, 
                            function(error, results) {
                                reply(results);
                    })
            })
            } else {
                    collection.updateOne({_id:request.params._id},
                                    {$set: request.payload},
                                    function(error, results) {
                    collection.findOne({"_id":request.params._id}, function(error, results) {
                        reply(results);
                }) 
              })
            }
        }
    },
    // Delete a single tour
    {
        method: 'DELETE',
        path: '/api/movies/{_id}',
        handler: function(request, reply) {
            collection.deleteOne({_id:request.params._id},
                function(error, results) {
                    reply ().code(204);
            })
        }
    },
    // Home page
    {
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            reply( "Hello world from Hapi/Mongo example.")
        }
    }
])

MongoClient.connect(url, function(err, db) {
    assert.equal(null,err);
    console.log("connected correctly to server");
    collection = db.collection('movies');
    server.start(function(err) {
        console.log('Hapi is listening to http://localhost:8080')
    })
})