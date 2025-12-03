"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const stats_routes_1 = __importDefault(require("./routes/stats.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/tasks', task_routes_1.default);
app.use('/api/stats', stats_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.get('/', (req, res) => {
    res.send('API is running...');
});
exports.default = app;
