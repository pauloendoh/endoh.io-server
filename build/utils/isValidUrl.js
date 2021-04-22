"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUrl = void 0;
function isValidUrl(text) {
    try {
        new URL(text);
    }
    catch (_) {
        return false;
    }
    return true;
}
exports.isValidUrl = isValidUrl;
