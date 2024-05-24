import { TOrder } from 'types/order';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getOrders = (params?: any) => request.get('/admin/orders', { params });

const orderApi = {
  ...generateAPIWithPaging<TOrder>('admin/orders'),
  getOrders,
};

export default orderApi;
