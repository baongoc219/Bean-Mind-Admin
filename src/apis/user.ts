import { TUser } from 'types/user';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getUsers = (params?: any) => request.get('/admin/users', { params });

const getUserById = (id: number, params?: any) => request.get(`/admin/users/${id}`, { params });

const remove = (id: number) => request.delete(`/admin/users/${id}`);

const add = (data: any) => request.post('/admin/users', data);

const update = (data: TUser) => request.put(`/admin/users`, data);

const userApi = {
  ...generateAPIWithPaging<TUser>('courses'),
  getUsers,
  getUserById,
  remove,
  add,
  update,
};

export default userApi;
