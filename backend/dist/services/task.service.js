"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_model_1 = require("../models/task.model");
class TaskService {
    async createTask(data) {
        const { platform } = data;
        let task;
        switch (platform) {
            case task_model_1.TaskPlatform.REDDIT:
                task = new task_model_1.RedditTask(data);
                break;
            case task_model_1.TaskPlatform.YOUTUBE:
                task = new task_model_1.YoutubeTask(data);
                break;
            case task_model_1.TaskPlatform.TRUSTPILOT:
                task = new task_model_1.TrustpilotTask(data);
                break;
            default:
                throw new Error('Invalid platform');
        }
        return await task.save();
    }
    async getTasks(query) {
        const { status, platform, page = 1, limit = 10 } = query;
        const filter = {};
        if (status)
            filter.status = status;
        if (platform)
            filter.platform = platform;
        const skip = (Number(page) - 1) * Number(limit);
        const tasks = await task_model_1.Task.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('assignedTo', 'name email');
        const total = await task_model_1.Task.countDocuments(filter);
        return {
            tasks,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        };
    }
    async getTaskById(id) {
        return await task_model_1.Task.findById(id).populate('assignedTo', 'name email');
    }
    async updateTask(id, data) {
        // Note: The pre-hook in the model handles publishedAt update
        return await task_model_1.Task.findByIdAndUpdate(id, data, { new: true });
    }
}
exports.default = new TaskService();
