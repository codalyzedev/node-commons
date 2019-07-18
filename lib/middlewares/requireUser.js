"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const requireUser = (req, res, next) => {
    if (req.headers['x-secret'] === config.get('SERVER_SECRET')) {
        next();
        return;
    }
    if (!req.currentUser) {
        res.status(401).json({ error: 'UNAUTHORIZED' });
        return;
    }
    next();
};
exports.default = requireUser;
//# sourceMappingURL=requireUser.js.map