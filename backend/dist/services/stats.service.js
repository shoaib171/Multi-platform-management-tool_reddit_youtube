"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_model_1 = require("../models/task.model");
class StatsService {
    async getPlatformStats() {
        const stats = await task_model_1.Task.aggregate([
            {
                $group: {
                    _id: '$platform',
                    totalTasks: { $sum: 1 },
                    publishedTasks: {
                        $sum: {
                            $cond: [{ $eq: ['$status', task_model_1.TaskStatus.PUBLISHED] }, 1, 0],
                        },
                    },
                    totalPrice: {
                        $sum: {
                            $cond: [{ $eq: ['$status', task_model_1.TaskStatus.PUBLISHED] }, '$price', 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    platform: '$_id',
                    totalTasks: 1,
                    publishedTasks: 1,
                    totalPrice: 1,
                },
            },
        ]);
        return stats;
    }
}
exports.default = new StatsService();
