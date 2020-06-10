"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var waveshare_1 = require("./WeatherMachine/helpers/waveshare/waveshare");
dotenv_1.config();
var phoneNumber = process.env.PHONE_NUMBER;
if (phoneNumber) {
    var waveShare = new waveshare_1.Waveshare("/dev/ttyS0");
    var textParams = {
        number: phoneNumber,
        message: "programmatically awesome!",
    };
    waveShare.text(textParams);
}
