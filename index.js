"use strict";

var JSONParse = require("jsonparse");
var through = require("through2");

function createParseStream() {
	var parser = new JSONParse();
	return through.obj(
		function (chunk, enc, cb) {
			var self = this;
			parser.onValue = function (value) {
				if (this.stack.length === 1) {
					self.push(value);
				}
			};
			parser.write(chunk);
			cb();
		});
}

function createStringifyStream(replacer, space) {
	var first = true;
	return through.obj(
		function (value, enc, cb) {
			if (first) {
				first = false;
				this.push("[");
			}
			else {
				this.push(",");
			}
			this.push(JSON.stringify(value, replacer, space));
			cb();
		}, 
		function (cb) {
			if (first) {
				this.push("[");
			}
			this.push("]");
			cb();
		});
}

module.exports = {
	parse: createParseStream,
	stringify: createStringifyStream
};
