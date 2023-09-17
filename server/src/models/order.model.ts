import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  courseId: string;
  userId: string;
  payment_info: object;
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
      /* required:true */
    },
  },
  { timestamps: true },
);

export const OrderModal = mongoose.model('Order', orderSchema);
