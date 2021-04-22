"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyErrorsResponse = void 0;
class MyErrorsResponse {
    constructor(message = '', field = '') {
        this.errors = [];
        if (message.length || field.length) {
            this.errors.push({ field, message });
        }
    }
    addError(message, field) {
        this.errors.push({ message, field });
    }
    addErrors(errors) {
        this.errors = this.errors.concat(errors);
        return this;
    }
}
exports.MyErrorsResponse = MyErrorsResponse;
//# sourceMappingURL=ErrorMessage.js.map