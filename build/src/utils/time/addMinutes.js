"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMinutes = void 0;
var addMinutes = function (date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
};
exports.addMinutes = addMinutes;
//# sourceMappingURL=addMinutes.js.map