export enum TaskPlatform {
  REDDIT = 'reddit',
  YOUTUBE = 'youtube',
  TRUSTPILOT = 'trustpilot',
}

export enum TaskStatus {
  DRAFT = 'draft',
  ASSIGNED = 'assigned',
  SUBMITTED = 'submitted',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
}

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface ITask {
  _id: string;
  content: string;
  platform: TaskPlatform;
  status: TaskStatus;
  assignedTo?: IUser;
  price: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Discriminator fields
  threadUrl?: string;
  videoUrl?: string;
  businessUrl?: string;
  reviewTitle?: string;
}

export interface IStats {
  platform: TaskPlatform;
  totalTasks: number;
  publishedTasks: number;
  totalPrice: number;
}
