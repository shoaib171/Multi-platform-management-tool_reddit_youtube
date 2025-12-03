"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformStats = void 0;
const stats_service_1 = __importDefault(require("../services/stats.service"));
const getPlatformStats = async (req, res) => {
    try {
        const stats = await stats_service_1.default.getPlatformStats();
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPlatformStats = getPlatformStats;
