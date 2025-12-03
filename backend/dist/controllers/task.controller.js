"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const task_service_1 = __importDefault(require("../services/task.service"));
const createTask = async (req, res) => {
    try {
        const task = await task_service_1.default.createTask(req.body);
        res.status(201).json(task);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createTask = createTask;
const getTasks = async (req, res) => {
    try {
        const result = await task_service_1.default.getTasks(req.query);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res) => {
    try {
        const task = await task_service_1.default.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTaskById = getTaskById;
const updateTask = async (req, res) => {
    try {
        const task = await task_service_1.default.updateTask(req.params.id, req.body);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateTask = updateTask;
