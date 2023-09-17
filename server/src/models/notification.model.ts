import mongoose, { Model, Schema } from 'mongoose';

type Status = 'unread' | 'read';

export interface INotification extends Document {
  title: string;
  message: string;
  status: Status;
  userId: string;
}

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'unread',
    },
  },
  { timestamps: true },
);
const NotificationModel = mongoose.model('Notification', notificationSchema);
export default NotificationModel;
