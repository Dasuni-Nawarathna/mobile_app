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
const VehicleSchema = new mongoose_1.Schema({
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    type: {
        type: String,
        required: true,
        enum: Object.values(constants_1.VehicleTypes),
    },
    model: { type: String, required: true, trim: true },
    plateNumber: { type: String, trim: true },
    seats: { type: Number, required: true, min: 1 },
    luggage: { type: Number, min: 0 },
    dailyRate: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: Object.values(constants_1.VehicleStatus),
        default: constants_1.VehicleStatus.AVAILABLE,
        index: true,
    },
    images: [String],
    features: [String],
    transferTypes: [{
            type: String,
            enum: ['AIRPORT_PICKUP', 'AIRPORT_DROP', 'CITY_TOUR']
        }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
}, { timestamps: true });
VehicleSchema.index({ type: 1, status: 1 });
exports.default = mongoose_1.default.models.Vehicle ||
    mongoose_1.default.model('Vehicle', VehicleSchema);
