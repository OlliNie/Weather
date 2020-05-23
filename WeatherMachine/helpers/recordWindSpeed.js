"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordWindSpeed = void 0;
var configuration_1 = require("../configuration/configuration");
var calculateWindSpeed_1 = require("./calculateWindSpeed");
var getSensorVoltage_1 = require("./getSensorVoltage");
exports.recordWindSpeed = function () {
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
        console.log("recorded Wind", recordedWind);
    }, recordInterval);
    var stopRecoding = function () {
        clearInterval(sampleIntervalHandle);
        clearInterval(recordIntervalHandle);
    };
    return {
        stopRecoding: stopRecoding,
    };
};
