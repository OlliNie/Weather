"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Port = void 0;
var serialport_1 = __importDefault(require("serialport"));
var pattern = /(?<=\r|\r\n|\r).*(?=\r|\r\n|\r)/gi;
var Port = /** @class */ (function () {
    function Port(port) {
        var _this = this;
        this.write = function (dataToWrite) {
            return new Promise(function (res, rej) {
                var serialData = [];
                console.log("data to write", dataToWrite);
                var handle = _this.port.on("data", function (data) {
                    serialData.push(data.toString());
                    var answer = serialData.join("").match(pattern);
                    if (answer) {
                        handle.removeListener;
                        res(answer[0]);
                    }
                });
                setTimeout(function () {
                    handle.removeListener;
                    rej(new Error("Command Timed Out"));
                }, 5000);
                _this.port.write(dataToWrite + "\n");
            });
        };
        this.send = function (dataToSend) {
            return new Promise(function (res, rej) {
                var serialData = [];
                var handle = _this.port.on("data", function (data) {
                    serialData.push(data.toString());
                    var answer = serialData.join("").match(pattern);
                    if (answer) {
                        handle.removeListener;
                        res(answer[0]);
                    }
                });
                setTimeout(function () {
                    handle.removeListener;
                    rej(new Error("Command Timed Out"));
                }, 10000);
                _this.port.write(dataToSend + "\u001A");
            });
        };
        this.port = new serialport_1.default(port, { baudRate: 9600 });
    }
    return Port;
}());
exports.Port = Port;
