"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMinutes = void 0;
const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
};
exports.addMinutes = addMinutes;
//# sourceMappingURL=addMinutes.js.map