"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const auth_services_1 = require("../services/auth_services");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Please provide a valid token' });
        }
        const user = yield (0, auth_services_1.isValidAuthToken)(token);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized to access' });
        }
        res.locals.user = user;
        next();
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
    }
});
exports.auth = auth;
//# sourceMappingURL=auth.js.map