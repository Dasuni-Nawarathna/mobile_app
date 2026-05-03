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
const PaymentSchema = new mongoose_1.Schema({
    bookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        index: true,
    },
    invoiceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Invoice' },
    amount: { type: Number, required: true, min: 0 },
    provider: {
        type: String,
        enum: ['PAYHERE', 'STRIPE', 'MANUAL'],
        default: 'MANUAL',
    },
    status: {
        type: String,
        enum: ['INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'CANCELED', 'CHARGEDBACK', 'VOIDED'],
        default: 'SUCCESS', // Default for backward compatibility with existing manual payments
    },
    orderId: { type: String, unique: true, sparse: true },
    payherePaymentId: { type: String },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    md5sigVerified: { type: Boolean },
    rawNotifyPayload: { type: mongoose_1.Schema.Types.Mixed },
    method: {
        type: String,
        enum: ['CASH', 'BANK', 'CARD_OTHER', 'ONLINE'],
        required: false, // Made optional for initiated payments
    },
    paidAt: { type: Date },
    reference: String,
    type: {
        type: String,
        enum: ['PAYMENT', 'REFUND'],
        default: 'PAYMENT',
    },
    notes: String,
    recordedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    voidedAt: Date,
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
}, { timestamps: true });
PaymentSchema.index({ bookingId: 1, type: 1 });
exports.default = mongoose_1.default.models.Payment ||
    mongoose_1.default.model('Payment', PaymentSchema);
