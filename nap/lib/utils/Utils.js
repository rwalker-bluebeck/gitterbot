"use strict";

var clc = require("cli-color");
var AppConfig = require("../../config/AppConfig");
// var winston = require("winston");

var Logger = require("./Logger.js");


// console.log("AppConfig required", AppConfig);

// check if we're in test mode
// console.log("Utils", "argv", process.argv);

var Utils = {

    bright: clc.xterm(237).bgXterm(195),
    dimmed: clc.xterm(232).bgXterm(253),
    warning: clc.xterm(232).bgXterm(215),
    errorColors: clc.xterm(232).bgXterm(196),
    logLevel: 10,  // default

    // this can't run strict
    // cls: function () {
    //     process.stdout.write('\033c');  // cls
    // },

    clog: function (where, msg, obj) {
        if (this.logLevel < 3) {
            return;
        }
        obj = obj || "";
        console.log(this.bright(where), this.dimmed(msg), obj);
        // winston.log(where, msg, obj);
    },

    warn: function (where, msg, obj) {
        if (this.logLevel < 2) {
            // console.log("skipping warn this.logLevel", this.logLevel);
            return;
        }
        obj = obj || "";
        console.log(this.warning(where), this.warning(msg), obj);
    },

    error: function (where, msg, obj) {
        if (this.logLevel < 1) {
            return;
        }
        obj = obj || "";
        console.log(this.warning(where), this.dimmed(msg), obj);
    },

    // used for tests
    // and also strings to commands
    // https://developer.gitter.im/docs/messages-resource
    makeMessageFromString: function (text) {
        var message = {};
        var model = {
            text: text
        };
        message.model = model;
        return message;
    },

    sanitize: function (str, opts) {
        if (opts && opts.spaces) {
            str = str.replace(/\s/g, "-");
        }
        str = str.toLowerCase();
        str = str.replace(".md", "");
        str = str.replace(/([^a-z0-9áéíóúñü_@\-\s]|[\t\n\f\r\v\0])/gim, "");
        return str;
    },

    // display filenames replace the - with a space
    namify: function (str, opts) {
        str = str.replace(/-/g, " ");
        return str;
    },

    linkify: function (str, where) {
        var host, link, uri, name;

        str = str.replace("?", "%3F");  // not URL encoded

        switch (where) {
            case 'gitter':
                host = AppConfig.gitterHost + AppConfig.botname;
                break;
            case 'wiki':
                host = AppConfig.wikiHost;
                break;
            default:
                host = AppConfig.wikiHost + AppConfig.botname;
        }

        // Utils.clog("AppConfig", AppConfig);
        console.dir(AppConfig);

        uri = host + str;
        name = Utils.namify(str);
        link = `[${name}](${uri})`;
        Utils.clog("link", link);
        return link;
    },

    messageMock: function (text) {
        var message = this.makeMessageFromString(text);

        message.model.fromUser = {
            username: "testuser"
        };
        return message;
    },

    splitParams: function (input) {
        var words = input.text.split(" ");
        input.command = words.shift();
        input.params = words.join(" ");
        return input;
    }


};

Utils.logLevel = parseInt(process.env.LOG_LEVEL || 4);

// var logFile = __dirname + '/../../log/winston.log';
// var logFile = "winston.log";
// winston.add(winston.transports.File, { filename: logFile });

// console.log("winston logs:", logFile);
// var logger = new winston.Logger();
// logger.log('info', 'Hello distributed log files!');
// winston.log("hello", "winston startup");


module.exports = Utils;