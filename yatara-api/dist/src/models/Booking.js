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
const BookingSchema = new mongoose_1.Schema({
    bookingNo: { type: String },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    type: {
        type: String,
        enum: Object.values(constants_1.BookingTypes),
        required: true,
    },
    packageId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Package' },
    vehicleId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Vehicle' },
    customPlanId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'CustomPlan' },
    pax: { type: Number, required: true, min: 1 },
    pickupLocation: String,
    dates: {
        from: { type: Date, required: true },
        to: { type: Date, required: true },
    },
    status: {
        type: String,
        enum: Object.values(constants_1.BookingStatus),
        default: constants_1.BookingStatus.NEW,
        index: true,
    },
    assignedStaffId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    assignedVehicleId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Vehicle' },
    notes: String,
    specialRequests: String,
    totalCost: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    remainingBalance: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
}, { timestamps: true });
// Auto-generate booking number
BookingSchema.pre('save', async function (next) {
    if (!this.bookingNo) {
        const count = await mongoose_1.default.models.Booking.countDocuments();
        this.bookingNo = `YC-${String(count + 1001).padStart(5, '0')}`;
    }
    // Auto-calculate remaining balance
    if (this.isModified('totalCost') || this.isModified('paidAmount')) {
        this.remainingBalance = this.totalCost - this.paidAmount;
    }
    next();
});
// Auto-block vehicle on booking confirmation
BookingSchema.post('save', async function (doc) {
    // If booking status was just changed to CONFIRMED and a vehicle is assigned
    if (doc.status === constants_1.BookingStatus.CONFIRMED && doc.assignedVehicleId) {
        try {
            // Check if block already exists for this booking
            const existingBlock = await mongoose_1.default.models.VehicleBlock.findOne({ bookingId: doc._id });
            if (!existingBlock) {
                await mongoose_1.default.models.VehicleBlock.create({
                    vehicleId: doc.assignedVehicleId,
                    from: doc.dates.from,
                    to: doc.dates.to,
                    reason: constants_1.VehicleBlockReasons.BOOKING,
                    bookingId: doc._id
                });
            }
        }
        catch (error) {
            console.error("Error auto-blocking vehicle:", error);
        }
    }
    // Free up vehicle if booking is cancelled
    if (doc.status === constants_1.BookingStatus.CANCELLED) {
        try {
            await mongoose_1.default.models.VehicleBlock.deleteMany({ bookingId: doc._id });
        }
        catch (error) {
            console.error("Error un-blocking vehicle:", error);
        }
    }
});
BookingSchema.index({ bookingNo: 1 }, { unique: true });
BookingSchema.index({ status: 1, 'dates.from': 1 });
BookingSchema.index({ phone: 1 });
exports.default = mongoose_1.default.models.Booking ||
    mongoose_1.default.model('Booking', BookingSchema);
