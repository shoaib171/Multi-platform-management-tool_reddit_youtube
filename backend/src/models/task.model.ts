import mongoose, { Schema, Document } from 'mongoose';

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

export interface ITask extends Document {
  content: string;
  platform: TaskPlatform;
  status: TaskStatus;
  assignedTo?: mongoose.Types.ObjectId;
  price: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    platform: {
      type: String,
      enum: Object.values(TaskPlatform),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.DRAFT,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    price: { type: Number, default: 2.5 },
    publishedAt: { type: Date },
  },
  { timestamps: true, discriminatorKey: 'platform' }
);

// Pre-hook to set publishedAt when status changes to 'published'
TaskSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate() as any;
  if (update.status === TaskStatus.PUBLISHED || (update.$set && update.$set.status === TaskStatus.PUBLISHED)) {
    if (update.$set) {
      update.$set.publishedAt = new Date();
    } else {
      update.publishedAt = new Date();
    }
  }
});

export const Task = mongoose.model<ITask>('Task', TaskSchema);

// Discriminators
export const RedditTask = Task.discriminator(
  TaskPlatform.REDDIT,
  new Schema({
    threadUrl: { type: String, required: true },
  })
);

export const YoutubeTask = Task.discriminator(
  TaskPlatform.YOUTUBE,
  new Schema({
    videoUrl: { type: String, required: true },
  })
);

export const TrustpilotTask = Task.discriminator(
  TaskPlatform.TRUSTPILOT,
  new Schema({
    businessUrl: { type: String, required: true },
    reviewTitle: { type: String, required: true },
  })
);
