"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attachUserToRequest = (req, _res, next) => {
    const userString = req.headers['x-user'];
    if (!userString) {
        next();
        return;
    }
    try {
        const user = JSON.parse(userString);
        req.currentUser = user;
        next();
        return;
    }
    catch (e) {
        next();
        return;
    }
};
exports.default = attachUserToRequest;
//# sourceMappingURL=attachUserToRequest.js.map