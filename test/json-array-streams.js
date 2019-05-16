/* eslint no-underscore-dangle: 0 */

var test = require('tape');
var through = require('through2');
var jsonArrayStreams = require('../index');
var Readable = require('stream').Readable;

function createStringifyStream(dataCB, replacer, space) {
	var input = new Readable({objectMode: true});
	input._read = function () {};
	input
		.pipe(jsonArrayStreams.stringify(replacer, space))
		.pipe(through.obj(
			function (chunk, enc, cb) {
				dataCB(chunk);
				cb();
			}));
	return input;
}

function createParseStream(dataCB) {
	var input = new Readable();
	input._read = function () {};
	input
		.pipe(jsonArrayStreams.parse())
		.pipe(through.obj(
			function (chunk, enc, cb) {
				dataCB(chunk);
				cb();
			}));
	return input;
}

test("parse", function (t) {
	var result = [];
	var input = createParseStream(function (chunk) {
		result.push(chunk);
	});

	input.push('[42,"foo",{"key":"value"}]');
	input.push(null);

	input.on('end', function () { 
		t.deepEqual(result, [42, "foo", {key: "value"}]);
		t.end();
	});
});

test("stringify empty stream", function (t) {
	var result = "";
	var input = createStringifyStream(function (chunk) {
		result = result + chunk;
	});

	input.push(null);

	input.on('end', function () { 
		t.equal(result, "[]");
		t.end(); 
	});
});

test("stringify singleton stream", function (t) {
	var result = "";
	var input = createStringifyStream(function (chunk) {
		result = result + chunk;
	});

	input.push(42);
	input.push(null);

	input.on('end', function () { 
		t.equal(result, "[42]");
		t.end(); 
	});
});

test("stringify stream", function (t) {
	var result = "";
	var input = createStringifyStream(function (chunk) {
		result = result + chunk;
	});

	input.push(42);
	input.push("foo");
	input.push({key: "value"});
	input.push(null);

	input.on('end', function () { 
		t.equal(result, '[42,"foo",{"key":"value"}]');
		t.end(); 
	});
});

test("with space", function (t) {
	var result = "";
	var input = createStringifyStream(function (chunk) {
		result = result + chunk;
	}, null, 2);

	input.push({key: "value"});
	input.push(null);

	input.on('end', function () { 
		t.equal(result, '[{\n  "key": "value"\n}]');
		t.end(); 
	});
});

