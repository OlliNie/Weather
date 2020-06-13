"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Waveshare = void 0;
var serialPort_1 = require("../serial-port/serialPort");
var rpi_gpio_1 = require("rpi-gpio");
var Waveshare = /** @class */ (function () {
    function Waveshare(port) {
        var _this = this;
        this.gpio = rpi_gpio_1.promise;
        this.write = function (data) { return _this.port.write(data); };
        this.text = function (_a) {
            var number = _a.number, message = _a.message;
            return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.port
                        .write("AT")
                        .then(function (r) {
                        console.log(r);
                        return _this.port.write("AT+CMGF=1");
                    })
                        .then(function (r) {
                        console.log(r);
                        return _this.port.write("AT+CMGW=\"" + number + "\"");
                    })
                        .then(function (r) {
                        console.log(r);
                        return _this.port.send("" + message);
                    })
                        .then(function (res) {
                        if (res.response.includes("+CMGW")) {
                            var textIndex = +res.response.slice(6);
                            return _this.port.write("AT+CMSS=" + textIndex);
                        }
                        else {
                            rej(new Error("Expected response to have +CMGW, got: " + res.response));
                        }
                    })
                        .then(function (response) { return res(response === null || response === void 0 ? void 0 : response.response); });
                    return [2 /*return*/];
                });
            }); });
        };
        this.togglePower = function () {
            return rpi_gpio_1.promise
                .setup(7, rpi_gpio_1.promise.DIR_OUT)
                .then(function () { return rpi_gpio_1.promise.read(7); })
                .then(function (res) {
                console.log("initial state:", res);
                return rpi_gpio_1.promise.write(7, false);
            })
                .then(function (res) {
                return new Promise(function (res, rej) {
                    setTimeout(function () {
                        res(rpi_gpio_1.promise.write(7, true));
                    }, 5000);
                });
            });
        };
        this.powerOn = function () {
            return new Promise(function (res, rej) {
                _this.port
                    .write("AT")
                    .then(function (_a) {
                    var response = _a.response;
                    if (response) {
                        res(true);
                    }
                })
                    .catch(function () {
                    //  If no response, power on and check for response
                    console.log("turn on power");
                    _this.togglePower()
                        .then(function () { return _this.port.write("AT"); })
                        .then(function (_a) {
                        var response = _a.response;
                        if (response) {
                            res(true);
                        }
                    })
                        .catch(rej);
                });
            });
        };
        this.internetOn = function () {
            new Promise(function (res, rej) {
                _this.port
                    .write("AT+CSQ")
                    .then(function (signalQuality) {
                    console.log("signalQuality:", signalQuality);
                })
                    .then(function () { return _this.port.write("AT+CREG=1"); })
                    .then(function (networkReqistered) {
                    return console.log("networkRegisterd:", networkReqistered);
                })
                    .then(function () { return _this.port.write("AT+CREG?"); })
                    .then(function (stateOfRegistration) {
                    return console.log("stateOfRegistration:", stateOfRegistration);
                })
                    .then(function () { return __awaiter(_this, void 0, void 0, function () {
                    var availableNetworks, selectedOperator, currentNetworkStatus, currenStateGprsService, test, connected;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.getAvailableNetworks()];
                            case 1:
                                availableNetworks = _a.sent();
                                return [4 /*yield*/, this.port.write("AT+COPS=" + availableNetworks[0])];
                            case 2:
                                selectedOperator = _a.sent();
                                console.log("selectedOperator:", selectedOperator);
                                return [4 /*yield*/, this.port.write("AT+COPS?")];
                            case 3:
                                currentNetworkStatus = _a.sent();
                                console.log("currentNetworkStatus:", currentNetworkStatus);
                                // AT+CGATT=1    [ to attach the terminal to GPRS service ]
                                return [4 /*yield*/, this.port.write("AT+CGATT=1")];
                            case 4:
                                // AT+CGATT=1    [ to attach the terminal to GPRS service ]
                                _a.sent();
                                return [4 /*yield*/, this.port.write("AT+CGATT?")];
                            case 5:
                                currenStateGprsService = _a.sent();
                                console.log("currenStateGprsService", currenStateGprsService);
                                return [4 /*yield*/, this.port.write("AT+CGDCONT=" + availableNetworks[0] + ",\"IP\",\"internet\"", 15000)];
                            case 6:
                                test = _a.sent();
                                console.log("test", test);
                                return [4 /*yield*/, this.port.write("AT+CGACT=1", 15000)];
                            case 7:
                                connected = _a.sent();
                                console.log("connected", connected);
                                return [2 /*return*/];
                        }
                    });
                }); })
                    .then(function () { return res(true); });
            });
        };
        this.getAvailableNetworks = function () {
            return new Promise(function (res, rej) {
                var pattern = /[1-9]/g;
                _this.port
                    .write("AT+COPS=?")
                    .then(function (r) {
                    console.log("response", r);
                    var networks = r.response.match(pattern);
                    console.log("Pattern match", networks);
                    return networks;
                })
                    .then(function (a) { return res(a); });
            });
        };
        // gpio.destroy();
        this.port = new serialPort_1.Port(port);
    }
    return Waveshare;
}());
exports.Waveshare = Waveshare;
