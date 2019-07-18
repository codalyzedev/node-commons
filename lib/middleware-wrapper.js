"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrapExpressMiddleWare = () => {
    const layer = require('express/lib/router/layer');
    const handleRequest = layer.prototype.handle_request;
    layer.prototype.handle_request = function (_req, _res, next) {
        if (!this.isWrapped) {
            this.isWrapped = true;
            const handle = this.handle;
            if (handle.length > 3) {
                return next();
            }
            this.handle = function (_req2, _res2, next2) {
                try {
                    const p = handle.apply(this, arguments);
                    if (p && p.catch) {
                        p.catch((err) => {
                            next2(err);
                        });
                    }
                    return p;
                }
                catch (e) {
                    next2(e);
                }
            };
        }
        return handleRequest.apply(this, arguments);
    };
};
exports.default = wrapExpressMiddleWare;
//# sourceMappingURL=middleware-wrapper.js.map