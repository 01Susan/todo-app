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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAuthToken = void 0;
exports.generateAuthToken = generateAuthToken;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET_KEY;
function generateAuthToken(userId, email, username) {
    const user = {
        userId,
        email,
        username
    };
    console.log(user);
    console.log(JWT_SECRET);
    const token = jsonwebtoken_1.default.sign(user, JWT_SECRET, { expiresIn: '1d' });
    console.log(token);
    return token;
}
const isValidAuthToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = decoded.userId;
        // Check if user exists in the database
        const user = yield prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user)
            return false;
        return decoded;
    }
    catch (error) {
        return false;
    }
});
exports.isValidAuthToken = isValidAuthToken;
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = 10;
        const plainPassoword = password;
        const hashedPassword = yield bcrypt_1.default.hash(plainPassoword, salt);
        return hashedPassword;
    });
}
function comparePassword(plainPassword, hashPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcrypt_1.default.compare(plainPassword, hashPassword);
        return isMatch;
    });
}
//# sourceMappingURL=auth_services.js.map