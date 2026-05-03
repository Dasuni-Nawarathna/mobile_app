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
const ItineraryDaySchema = new mongoose_1.Schema({
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    activity: String,
}, { _id: false });
const PackageSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    summary: { type: String, required: true },
    fullDescription: String,
    duration: { type: String, required: true },
    durationDays: { type: Number, min: 1 },
    type: { type: String, enum: ['journey', 'transfer'], default: 'journey', index: true },
    style: { type: String, enum: ['cultural', 'wildlife', 'heritage', 'experiences', 'wellness', 'family', 'luxury', 'adventure', 'beach', 'marine'] },
    itinerary: [ItineraryDaySchema],
    priceMin: { type: Number, required: true, min: 0 },
    priceMax: { type: Number, required: true, min: 0 },
    price: Number,
    originalPrice: Number,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    images: [String],
    highlights: [String],
    inclusions: [String],
    exclusions: [String],
    tags: [String],
    isPublished: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isFeaturedHome: { type: Boolean, default: false, index: true },
    homeRank: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
}, { timestamps: true });
PackageSchema.index({ slug: 1 }, { unique: true });
PackageSchema.index({ tags: 1 });
PackageSchema.index({ priceMin: 1, priceMax: 1 });
PackageSchema.index({ type: 1, style: 1 });
PackageSchema.index({ type: 1, durationDays: 1 });
exports.default = mongoose_1.default.models.Package ||
    mongoose_1.default.model('Package', PackageSchema);
