"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordWindSpeed = void 0;
var configuration_1 = require("../configuration/configuration");
var calculateWindSpeed_1 = require("./calculateWindSpeed");
var getSensorVoltage_1 = require("./getSensorVoltage");
var firebase_1 = __importDefault(require("firebase"));
var serialport_1 = __importDefault(require("serialport"));
var serialport = new serialport_1.default("/dev/ttyS0");
// initialise firebase
var app = firebase_1.default.initializeApp(configuration_1.configuration.firebaseConfig);
// firebase.analytics();
var db = app.firestore();
var getDay = function () {
    var date = new Date();
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();
    return month + "_" + day + "_" + year;
};
exports.recordWindSpeed = function () {
    console.log("recording wind speed");
    var sampleRate = configuration_1.configuration.sampleRateInMs;
    var unit = configuration_1.configuration.units;
    var saveInterval = configuration_1.configuration.saveIntervalinMs;
    //  RecordedSamples is each sample
    var recordedSamples = [];
    //  Recorded wind includes min and max measurements for configured interval
    var recordedWind = [];
    var sampleIntervalHandle;
    var updateCloudIntervalHandle;
    var getStrongestWindRecording = function (acc, current) {
        if (acc === undefined || current.windSpeed > acc.windSpeed) {
            return current;
        }
        else {
            return acc;
        }
    };
    var getWeakestWindRecording = function (acc, current) {
        if (acc === undefined || current.windSpeed < acc.windSpeed) {
            return current;
        }
        else {
            return acc;
        }
    };
    var windRecording = function (voltage) {
        var time = new Date();
        var windRecording = {
            windSpeed: calculateWindSpeed_1.calculateWindSpeed(voltage),
            unit: unit,
            time: time.getHours() + ":" + time.getMinutes(),
        };
        return windRecording;
    };
    sampleIntervalHandle = setInterval(function () {
        recordedSamples.push(windRecording(getSensorVoltage_1.getSenesorVoltage()));
    }, sampleRate);
    updateCloudIntervalHandle = setInterval(function () {
        var _a;
        var date = new Date();
        var strongestWind = recordedSamples.reduce(getStrongestWindRecording, undefined);
        var weakestWind = recordedSamples.reduce(getWeakestWindRecording, undefined);
        var strongestWeakestRecoding = {
            strongest: strongestWind,
            weakest: weakestWind,
            recordIntervalInMs: configuration_1.configuration.saveIntervalinMs,
            recordTime: date.getHours() + ":" + date.getMinutes(),
        };
        recordedWind.push(strongestWeakestRecoding);
        recordedSamples = [];
        var day = getDay();
        console.log("day", day);
        db.collection("windSpeeds")
            .doc("recordings")
            .set((_a = {},
            _a[day] = recordedWind,
            _a));
    }, saveInterval);
    var stopRecoding = function () {
        clearInterval(sampleIntervalHandle);
        clearInterval(updateCloudIntervalHandle);
    };
    return {
        stopRecoding: stopRecoding,
    };
};
