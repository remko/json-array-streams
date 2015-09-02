# [json-array-streams: Streams for JSON array parsing/stringifying](https://el-tramo.be/json-array-streams)

This package provides streams for parsing and stringifying a stream of objects to a 
JSON array. This is useful when you have huge lists of generated data from a stream that 
you can't (or don't want to) entirely keep in memory, and instead want to directly stream
this to/from storage.

## Installation

    npm install json-array-streams --save

## Usage

    var through = require("through2");
    var fs = require("fs");
    var jsonArrayStreams = require("json-array-streams");

    // Write a stream of objects to a JSON file
    createSomeObjectStream()
      .pipe(jsonArrayStreams.stringify())
      .pipe(fs.createWriteStream("data.json"));

    // Read a stream of objects from a JSON file
    fs.createReadStream("data.json")
      .pipe(jsonArrayStreams.parse())
      .pipe(through.obj(function (object, enc, cb) {
        console.log("Got object", object);
        cb();
      }));

## API

### `jsonArrayStreams.parse()`

Create a parsing stream.

### `jsonArrayStreams.stringify()`

Create a stringifying stream.
