export type TOrder = {
  id: number;
  orderCode: string;
  totalAmount: number;
  finalAmount: number;
  discount: number;
  checkInDate: string;
  createDate: string;
  status: number;
  menteeId: number;
  courseId: number;
};
