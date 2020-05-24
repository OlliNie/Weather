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
var firebaseConfig = {
    apiKey: "AIzaSyBu8mVbVZ2cCgjU1XI_5e00qsBgJRvWYYw",
    authDomain: "weather-8654c.firebaseapp.com",
    databaseURL: "https://weather-8654c.firebaseio.com",
    projectId: "weather-8654c",
    storageBucket: "weather-8654c.appspot.com",
    messagingSenderId: "1069979341863",
    appId: "1:1069979341863:web:8f0ff2dcdcbca1b63dea02",
    measurementId: "G-EY9BZ09347",
};
// initialise firebase
var app = firebase_1.default.initializeApp(firebaseConfig);
// firebase.analytics();
console.log("app", app);
var db = app.firestore();
var getDay = function () {
    var date = new Date();
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();
    return month + "_" + day + "_" + year;
};
exports.recordWindSpeed = function () {
    console.log("recoding wind speed");
    var sampleRate = configuration_1.configuration.sampleRateInMs;
    var unit = configuration_1.configuration.units;
    var recordInterval = configuration_1.configuration.sampleIntervalinMs;
    //  RecordedSamples is each sample
    var recordedSamples = [];
    //  Recorded wind includes min and max measurements for configured interval
    var recordedWind = [];
    var sampleIntervalHandle;
    var recordIntervalHandle;
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
        var windRecording = {
            windSpeed: calculateWindSpeed_1.calculateWindSpeed(voltage),
            unit: unit,
            date: Date(),
        };
        return windRecording;
    };
    sampleIntervalHandle = setInterval(function () {
        recordedSamples.push(windRecording(getSensorVoltage_1.getSenesorVoltage()));
    }, sampleRate);
    recordIntervalHandle = setInterval(function () {
        var strongestWind = recordedSamples.reduce(getStrongestWindRecording, undefined);
        var weakestWind = recordedSamples.reduce(getWeakestWindRecording, undefined);
        var strongestWeakestRecoding = {
            strongest: strongestWind,
            weakest: weakestWind,
        };
        recordedWind.push(strongestWeakestRecoding);
        recordedSamples = [];
        var day = getDay();
        console.log("day", day);
        db.collection("windSpeeds").doc(day).set({ test: recordedWind });
    }, recordInterval);
    var stopRecoding = function () {
        clearInterval(sampleIntervalHandle);
        clearInterval(recordIntervalHandle);
    };
    return {
        stopRecoding: stopRecoding,
    };
};
