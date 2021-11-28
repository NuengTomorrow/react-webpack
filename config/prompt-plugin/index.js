"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const tpl_1 = __importDefault(require("./tpl"));
const chalk_1 = __importDefault(require("chalk"));
const perf_hooks_1 = require("perf_hooks");
const PLUGIN_NAME = 'prompt-plugin';
const DEFAULT_OPTIONS = {
    tips: [],
    style: 'default'
};
let t;
module.exports = class WebpackPromptPlugin {
    constructor(options) {
        this.isWatch = false;
        this.option = DEFAULT_OPTIONS;
        this.option = Object.assign({}, this.option, options);
    }
    printIP(devServer) {
        const { option: { style } } = this;
        const port = devServer.port || 8080;

        // console.log
        tpl_1.default[style]({
            port,
            time: t,
        });
    }
    printHandler(compiler) {
        const self = this;
        compiler.hooks.done.tap(PLUGIN_NAME, function () {
            setTimeout(() => {
                var _a;
                if (self.isWatch) {
                    self.printIP(((_a = compiler === null || compiler === void 0 ? void 0 : compiler.options) === null || _a === void 0 ? void 0 : _a.devServer) || {});
                    self.printCustom();
                }
            });
        });
    }
    printCustom() {
        const { option: { tips } } = this;
        tips === null || tips === void 0 ? void 0 : tips.forEach((item) => {
            var _a, _b;
            const color = typeof item !== 'string' && item.color ? item.color : 'white';
            console.log(chalk_1.default[color]((_b = (_a = item) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : (item || '')));
        });
    }

    initHandler(compiler) {
        const self = this;
        compiler.hooks.watchRun.tap(PLUGIN_NAME, function (c) {
            t = perf_hooks_1.performance.now();
            self.isWatch = true;
        });
        compiler.hooks.failed.tap(PLUGIN_NAME, function () {
            self.isWatch = false;
            console.log(chalk_1.default.red('failed'));
        });
    }
    apply(compiler) {
        this.initHandler(compiler);
        this.printHandler(compiler);
    }
};
