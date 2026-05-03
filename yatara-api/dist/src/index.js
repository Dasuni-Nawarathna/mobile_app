"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./config/db"));
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const packages_1 = __importDefault(require("./routes/packages"));
const vehicles_1 = __importDefault(require("./routes/vehicles"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const finance_1 = __importDefault(require("./routes/finance"));
// Load environment variables
dotenv_1.default.config({ path: '../.env.local' });
// Connect to MongoDB
(0, db_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// Static folder for file uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/packages', packages_1.default);
app.use('/api/vehicles', vehicles_1.default);
app.use('/api/bookings', bookings_1.default);
app.use('/api/finance', finance_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
});
