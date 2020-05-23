"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSenesorVoltage = void 0;
exports.getSenesorVoltage = function () {
    //  Without having GPIO and sensor setup, mock data with math.random.
    var sensorVoltage = Math.random() * 10;
    return sensorVoltage;
};
