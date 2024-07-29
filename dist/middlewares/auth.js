"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
function checkAuth(req, res, next) {
    var _a;
    if (((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.user) || req.path === "/login")
        next();
    else {
        res.status(403).redirect("/auth-login.html");
    }
}
exports.checkAuth = checkAuth;
