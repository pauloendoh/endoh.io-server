"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserGetDto = void 0;
// PE 3/3 
var AuthUserGetDto = /** @class */ (function () {
    function AuthUserGetDto(user, token, expiresAt) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.picture = user.picture;
        this.token = token;
        this.expiresAt = expiresAt;
    }
    return AuthUserGetDto;
}());
exports.AuthUserGetDto = AuthUserGetDto;
//# sourceMappingURL=AuthUserGetDto.js.map