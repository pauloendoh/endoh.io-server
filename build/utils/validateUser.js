"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// PE 2/3 - maybe validateUserFields ?; also, MyError is a little confusing;
const validateUser = (user) => {
    let errors = [];
    if (!user.email.length) {
        errors.push({ field: 'email', message: 'Email is required' });
    }
    if (!user.username.length) {
        errors.push({ field: 'username', message: 'Username is required' });
    }
    if (!user.password.length) {
        errors.push({ field: 'password', message: 'Password is required' });
    }
    else if (user.password.length < 6) {
        errors.push({
            field: 'password',
            message: 'Password must have at least 6 characters'
        });
    }
    return errors;
};
exports.default = validateUser;
//# sourceMappingURL=validateUser.js.map