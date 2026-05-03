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
const DestinationSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, required: true },
    longDescription: String,
    location: String,
    images: [String],
    isPublished: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    // Luxury premium fields
    region: { type: String, index: true },
    shortTagline: String,
    luxuryLabel: String,
    heroImage: String,
    thumbnailImage: String,
    gallery: [String],
    highlights: [String],
    bestSeason: String,
    idealNights: String,
    travelTimeFromColombo: String,
    travelStyleTags: [String],
    experiences: [
        {
            title: String,
            description: String,
            image: String,
        },
    ],
    itinerary: [
        {
            dayTitle: String,
            activities: [String],
        },
    ],
    stayStyles: [
        {
            title: String,
            description: String,
            image: String,
        },
    ],
    nearestAirport: String,
    elevation: String,
    coordinates: {
        lat: Number,
        lng: Number,
    },
    priority: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String,
}, { timestamps: true });
DestinationSchema.index({ slug: 1 }, { unique: true });
exports.default = mongoose_1.default.models.Destination ||
    mongoose_1.default.model('Destination', DestinationSchema);
