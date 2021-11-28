"use strict";
var { networkInterfaces } = require('os');
var nets = networkInterfaces();
var localIP = [];
for (const nameIP of Object.keys(nets)) {
    for (const net of nets[nameIP]) {
         if (net.family === 'IPv4' && !net.internal) {
         localIP.push(net.address)
         }
    }
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("./utils");
const packageJson = utils_1.getPkg();
const { name, version } = packageJson;

const logQueue = (queue) => {
    try {
        queue === null || queue === void 0 ? void 0 : queue.forEach((item) => console.log(...(Array.isArray(item) ? item : [item])));
    }
    catch (e) {
        console.log('error', e);
    }
};
exports.logQueue = logQueue;
exports.default = {
    default: ({ port, time }) => {
        const ip = `http://${String(localIP)}:${port}`;
        exports.logQueue([
            '\n',
            [chalk_1.default.bgGreen.black(' done '), chalk_1.default.green(`App is runing!`)],
            '\n',
            [
                '- Local:  ',
                chalk_1.default.underline.blue(`http://localhost:${port}`)
            ],
            ['- Network:', chalk_1.default.underline.blue(ip)],
            '\n',
            [
                'name: ',
                chalk_1.default.underline.green(name),
                '   version: ',
                chalk_1.default.underline.green(version)
            ],
            '\n',
            ['Compiled Time ⏱:', ...utils_1.time2M(time)],
        ]);
    },
};
