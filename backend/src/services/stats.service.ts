import { Task, TaskStatus } from '../models/task.model';

class StatsService {
  async getPlatformStats() {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$platform',
          totalTasks: { $sum: 1 },
          publishedTasks: {
            $sum: {
              $cond: [{ $eq: ['$status', TaskStatus.PUBLISHED] }, 1, 0],
            },
          },
          totalPrice: {
            $sum: {
              $cond: [{ $eq: ['$status', TaskStatus.PUBLISHED] }, '$price', 0],
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

export default new StatsService();
