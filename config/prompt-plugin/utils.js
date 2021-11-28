"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.time2M = exports.getPkg = void 0;
const fs_1 = __importDefault(require("fs"));
const perf_hooks_1 = require("perf_hooks");
function getPkg() {
    const pkg = fs_1.default.readFileSync('package.json').toString();
    return JSON.parse(pkg);
}
exports.getPkg = getPkg;
function time2Emoji(time) {
    const t = time / 1000;
    if (t >= 20) {
        return '🐌';
    }
    if (t > 15) {
        return '🐢';
    }
    if (t > 10) {
        return '🛵';
    }
    if (t > 6) {
        return '🚂';
    }
    if (t > 4) {
        return '🚅';
    }
    if (t > 2) {
        return '🚀';
    }
    return '🛸 ⚡️⚡️⚡️';
}
function time2M(t) {
    const time = perf_hooks_1.performance.now() - t;
    const str = time > 2000 ? `${(time / 1000).toFixed(2)}s` : `${time.toFixed(0)}ms`;
    return [str, time2Emoji(time)];
}
exports.time2M = time2M;
