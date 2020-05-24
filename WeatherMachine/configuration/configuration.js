"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
var types_1 = require("./types");
exports.configuration = {
    units: types_1.Units.METRIC,
    minVoltage: 0,
    maxVoltage: 10,
    minWindSpeed: {
        METRIC: 0,
        STANDARD: 0,
    },
    maxWindSpeed: {
        METRIC: 30,
        STANDARD: 50,
    },
    sampleRateInMs: 1000,
    sampleIntervalinMs: 1000 * 60 * 0.5,
   
};
