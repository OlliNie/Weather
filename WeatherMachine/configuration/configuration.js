"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
var types_1 = require("./types");
var firebaseConfig_1 = require("./firebaseConfig/firebaseConfig");
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
    sampleRateInMs: 1000 * 30,
    saveIntervalinMs: 1000 * 60 * 2,
    firebaseConfig: firebaseConfig_1.firebaseConfig,
};
