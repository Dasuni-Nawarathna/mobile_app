"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomPlanStatus = exports.DistrictPlaceCategories = exports.GalleryPostTypes = exports.NotificationVisibility = exports.NotificationTypes = exports.SupportTicketStatus = exports.InvoiceStatus = exports.PaymentTypes = exports.PaymentMethods = exports.PartnerServiceUnits = exports.PartnerStatus = exports.PartnerTypes = exports.ServiceBlockReasons = exports.VehicleBlockReasons = exports.VehicleStatus = exports.VehicleTypes = exports.BookingStatus = exports.BookingTypes = exports.UserStatus = exports.UserRoles = void 0;
exports.UserRoles = {
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
    USER: 'USER',
    VEHICLE_OWNER: 'VEHICLE_OWNER',
    HOTEL_OWNER: 'HOTEL_OWNER',
};
exports.UserStatus = {
    ACTIVE: 'ACTIVE',
    DISABLED: 'DISABLED',
    PENDING_APPROVAL: 'PENDING_APPROVAL',
    REJECTED: 'REJECTED',
};
exports.BookingTypes = {
    PACKAGE: 'PACKAGE',
    VEHICLE: 'VEHICLE',
    CUSTOM: 'CUSTOM',
};
exports.BookingStatus = {
    NEW: 'NEW',
    PAYMENT_PENDING: 'PAYMENT_PENDING',
    CONTACTED: 'CONTACTED',
    ADVANCE_PAID: 'ADVANCE_PAID',
    CONFIRMED: 'CONFIRMED',
    ASSIGNED: 'ASSIGNED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
};
exports.VehicleTypes = {
    CAR: 'CAR',
    VAN: 'VAN',
    SUV: 'SUV',
    BUS: 'BUS',
    MINIBUS: 'MINIBUS',
    TUK_TUK: 'TUK_TUK',
};
exports.VehicleStatus = {
    AVAILABLE: 'AVAILABLE',
    MAINTENANCE: 'MAINTENANCE',
    UNAVAILABLE: 'UNAVAILABLE',
    PENDING_APPROVAL: 'PENDING_APPROVAL',
    REJECTED: 'REJECTED',
};
exports.VehicleBlockReasons = {
    BOOKING: 'BOOKING',
    MAINTENANCE: 'MAINTENANCE',
    PERSONAL: 'PERSONAL',
    OTHER: 'OTHER',
};
exports.ServiceBlockReasons = {
    BOOKING: 'BOOKING',
    RENOVATION: 'RENOVATION',
    PERSONAL: 'PERSONAL',
    OTHER: 'OTHER',
};
exports.PartnerTypes = {
    GUIDE: 'GUIDE',
    HOTEL: 'HOTEL',
    DRIVER: 'DRIVER',
    RESTAURANT: 'RESTAURANT',
    OTHER: 'OTHER',
};
exports.PartnerStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    PENDING_APPROVAL: 'PENDING_APPROVAL',
    REJECTED: 'REJECTED',
};
exports.PartnerServiceUnits = {
    PER_DAY: 'PER_DAY',
    PER_TRIP: 'PER_TRIP',
    PER_PERSON: 'PER_PERSON',
    PER_NIGHT: 'PER_NIGHT',
    FLAT: 'FLAT',
};
exports.PaymentMethods = {
    CASH: 'CASH',
    BANK: 'BANK',
    CARD_OTHER: 'CARD_OTHER',
    ONLINE: 'ONLINE',
};
exports.PaymentTypes = {
    PAYMENT: 'PAYMENT',
    REFUND: 'REFUND',
};
exports.InvoiceStatus = {
    DRAFT: 'DRAFT',
    FINAL: 'FINAL',
    VOID: 'VOID',
};
exports.SupportTicketStatus = {
    OPEN: 'OPEN',
    REPLIED: 'REPLIED',
    CLOSED: 'CLOSED',
};
exports.NotificationTypes = {
    OFFER: 'OFFER',
    UPDATE: 'UPDATE',
    ALERT: 'ALERT',
};
exports.NotificationVisibility = {
    CUSTOMERS: 'CUSTOMERS',
    STAFF: 'STAFF',
    ALL: 'ALL',
};
exports.GalleryPostTypes = {
    IMAGE: 'IMAGE',
    BLOG: 'BLOG',
};
exports.DistrictPlaceCategories = {
    TEMPLE: 'TEMPLE',
    BEACH: 'BEACH',
    NATURE: 'NATURE',
    HERITAGE: 'HERITAGE',
    WILDLIFE: 'WILDLIFE',
    ADVENTURE: 'ADVENTURE',
    CITY: 'CITY',
    FOOD: 'FOOD',
    OTHER: 'OTHER',
};
exports.CustomPlanStatus = {
    DRAFT: 'DRAFT',
    SAVED: 'SAVED',
};
