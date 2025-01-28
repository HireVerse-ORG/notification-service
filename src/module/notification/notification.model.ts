import mongoose, { Schema, Document } from "mongoose";

export enum NotificationType {
  PUSH = "push",
  IN_APP = "inApp",
  EMAIL = "email"
}

export enum NotificationStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}


export interface INotification extends Document {
  userId: string;
  title: string; 
  message: string; 
  recipient: string | null; 
  type: NotificationType; 
  sentAt?: Date; 
  readAt?: Date;
  status: NotificationStatus; 
  metadata?: Record<string, any>; 
  createdAt?: Date; 
  updatedAt?: Date; 
}

const NotificationSchema: Schema = new Schema<INotification>(
  {
    userId: { type: String, required: true},
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    recipient: { type: String, required: true, default: null },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    sentAt: { type: Date },
    readAt: { type: Date },
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.SENT,
    },
    metadata: { type: Object }, 
  },
  {
    timestamps: true, 
  }
);

NotificationSchema.virtual('id').get(function () {
    return this._id;
});

NotificationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);

export default NotificationModel;
