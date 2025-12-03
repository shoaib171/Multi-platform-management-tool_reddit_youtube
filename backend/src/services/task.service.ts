import { Task, RedditTask, YoutubeTask, TrustpilotTask, TaskPlatform, ITask } from '../models/task.model';

class TaskService {
  async createTask(data: any) {
    const { platform } = data;
    
    let task;
    switch (platform) {
      case TaskPlatform.REDDIT:
        task = new RedditTask(data);
        break;
      case TaskPlatform.YOUTUBE:
        task = new YoutubeTask(data);
        break;
      case TaskPlatform.TRUSTPILOT:
        task = new TrustpilotTask(data);
        break;
      default:
        throw new Error('Invalid platform');
    }
    
    return await task.save();
  }

  async getTasks(query: any) {
    const { status, platform, page = 1, limit = 10 } = query;
    const filter: any = {};

    if (status) filter.status = status;
    if (platform) filter.platform = platform;

    const skip = (Number(page) - 1) * Number(limit);

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('assignedTo', 'name email');

    const total = await Task.countDocuments(filter);

    return {
      tasks,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async getTaskById(id: string) {
    return await Task.findById(id).populate('assignedTo', 'name email');
  }

  async updateTask(id: string, data: any) {
    // Note: The pre-hook in the model handles publishedAt update
    return await Task.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new TaskService();
