"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWindSpeed = void 0;
var configuration_1 = require("../configuration/configuration");
exports.calculateWindSpeed = function (voltage) {
    //  Calculate slope
    var deltaVoltage = configuration_1.configuration.maxVoltage - configuration_1.configuration.minVoltage;
    var deltaWind = configuration_1.configuration.maxWindSpeed[configuration_1.configuration.units] -
        configuration_1.configuration.minWindSpeed[configuration_1.configuration.units];
    var slope = deltaWind / deltaVoltage;
    //  Calculate wind value
    return slope * voltage;
};
