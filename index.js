#!/usr/bin/env node
var fs = require("fs");
var path = require("path");
var inputMinType = "uglifyjs";
var compressor = require("node-minify");

var walk = function(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function(name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walk(filePath, callback);
        }
    });
}

var minifyAll = function(dir, options, callback){
    options = options || {};
    options.type = options.type || inputMinType;

    walk(dir, function(path, result){
        if (path.substr(-3) === ".js" || path.substr(-4) === ".css"){
            if (!options.silent){
                console.log("found file: " + path);
            }
            new compressor.minify({
                type: options.type, 
                fileIn: path, 
                fileOut: path, 
                callback: callback || function(err, min){
                    if(err){
                        console.log(err);
                    }
                }
            });
        }
    });
};
if (require.main === module) {
    var input = process.argv, 
        inputDir = input[2], 
        inputMinType = input[3] || inputMinType;
    minifyAll(inputDir);
} else {
    module.exports = minifyAll;
}
