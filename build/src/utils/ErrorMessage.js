"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyErrorsResponse = void 0;
var MyErrorsResponse = /** @class */ (function () {
    function MyErrorsResponse(message, field) {
        if (message === void 0) { message = ''; }
        if (field === void 0) { field = ''; }
        this.errors = [];
        if (message.length || field.length) {
            this.errors.push({ field: field, message: message });
        }
    }
    MyErrorsResponse.prototype.addError = function (message, field) {
        this.errors.push({ message: message, field: field });
    };
    MyErrorsResponse.prototype.addErrors = function (errors) {
        this.errors = this.errors.concat(errors);
        return this;
    };
    return MyErrorsResponse;
}());
exports.MyErrorsResponse = MyErrorsResponse;
//# sourceMappingURL=ErrorMessage.js.map