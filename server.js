var fs = require('fs');
var path = require('path');
var { spawn } = require('child_process');
var config = require('./config');
var schedule = require('node-schedule');

var exportDir = path.join(process.cwd(), "exports");

var getDir = function() {
    var currnetDate = new Date();
    var year = currnetDate.getFullYear();
    var month = currnetDate.getMonth();
    var day = currnetDate.getDate();
    var hours = currnetDate.getHours();
    var minutes = currnetDate.getMinutes();
    var seconds = currnetDate.getSeconds();

    if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir);
    }    

    return path.join(exportDir,year+"-"+month+"-"+day+"T"+hours+"-"+minutes+"-"+seconds);
}

var backup = function() {
    var options = [];
    var options2 = {};
    if (config.uri) { options.push("--uri="+config.uri); }
    if (config.host) { options.push("--host="+config.host); }
    if (config.port) { options.push("--port="+config.port); }
    if (config.db) { options.push("--db="+config.db); }
    if (config.authenticationDatabase) { options.push("--authenticationDatabase="+config.authenticationDatabase); }
    if (config.authenticationMechanism) { options.push("--authenticationMechanism="+config.authenticationMechanism); }
    if (config.username) { options.push("--username="+config.username); }
    if (config.password) { options.push("--password="+config.password); }
    if (config.gzip) { options.push("--gzip"); }
    options.push("--out="+getDir());

    if (config.os === "windows") { options2.shell = true; }

    var backupProcess = spawn('mongodump', options, options2);

    backupProcess.on('exit', function(code, signal) {
        if(code) {
            console.log('Backup process exited with code ', code);
        } else if (signal) {
            console.error('Backup process was killed with singal ', signal);
        } else { 
            console.log('Successfully backedup the database');
        }
    });
}

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
var task = schedule.scheduleJob('0 * * * * *', function() {
    try {
        backup();
    } catch(err) {
        console.log(err);
    }
});