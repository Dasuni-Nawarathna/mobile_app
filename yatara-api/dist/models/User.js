"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../lib/constants");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    phone: { type: String, trim: true },
    avatar: { type: String },
    passwordHash: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: Object.values(constants_1.UserRoles),
        default: constants_1.UserRoles.STAFF,
        index: true,
    },
    status: {
        type: String,
        enum: Object.values(constants_1.UserStatus),
        default: constants_1.UserStatus.ACTIVE,
        index: true,
    },
    emailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, select: false },
    emailVerificationExpires: Date,
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpires: Date,
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: Date,
    lastLogin: Date,
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
}, { timestamps: true });
UserSchema.index({ email: 1 }, { unique: true });
exports.default = mongoose_1.default.models.User ||
    mongoose_1.default.model('User', UserSchema);
