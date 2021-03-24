"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASSPORT_KEYS = void 0;
var GOOGLE_TOKENS = {
    GOOGLE_CLIENT_ID: "292222419856-du1andl6v9fsnmcmvn8v2ibjcvdddcib.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "BSNc3aqRfMRxG82KVezgl8I6"
};
var SESSION = {
    COOKIE_KEY: "thisappisawesome"
};
exports.PASSPORT_KEYS = __assign(__assign({}, GOOGLE_TOKENS), SESSION);
//# sourceMappingURL=PASSPORT_KEYS.js.map