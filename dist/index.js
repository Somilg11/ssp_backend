"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const adRequest_1 = __importDefault(require("./routes/adRequest"));
const dsp_1 = __importDefault(require("./routes/dsp"));
const analytics_1 = __importDefault(require("./routes/analytics")); // Import analytics route
dotenv_1.default.config();
const app = (0, express_1.default)();
// Allow CORS requests from your frontend URL (e.g., http://localhost:3000 for local development)
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions)); // Apply CORS settings
app.use(express_1.default.json());
app.use('/ad-request', adRequest_1.default);
app.use('/dsps', dsp_1.default);
app.use('/analytics', analytics_1.default); // Mount the analytics route here
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
