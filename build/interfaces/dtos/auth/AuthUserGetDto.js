"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserGetDto = void 0;
// PE 3/3 
class AuthUserGetDto {
    constructor(user, token, expiresAt) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.preference = user.preference;
        this.token = token;
        this.expiresAt = expiresAt;
    }
}
exports.AuthUserGetDto = AuthUserGetDto;
