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
const TicketReplySchema = new mongoose_1.Schema({
    byUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    byName: { type: String, required: true },
    body: { type: String, required: true },
    at: { type: Date, default: Date.now },
}, { _id: true });
const SupportTicketSchema = new mongoose_1.Schema({
    customerName: { type: String, required: true, trim: true },
    phone: String,
    email: { type: String, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    bookingId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Booking' },
    status: {
        type: String,
        enum: ['OPEN', 'REPLIED', 'CLOSED'],
        default: 'OPEN',
        index: true,
    },
    replies: [TicketReplySchema],
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
}, { timestamps: true });
exports.default = mongoose_1.default.models.SupportTicket ||
    mongoose_1.default.model('SupportTicket', SupportTicketSchema);
