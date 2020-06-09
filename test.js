"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var waveshare_1 = require("./WeatherMachine/helpers/waveshare/waveshare");
var waveShare = new waveshare_1.Waveshare("/dev/ttyS0");
var textParams = {
    number: "0444036147",
    message: "programmatically awesome!",
};
waveShare.text(textParams);
