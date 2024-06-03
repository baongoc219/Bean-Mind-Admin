import { TCourse } from 'types/course';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getCourses = (params?: any) => request.get('/courses', { params });

const getCourseById = (id: number, params?: any) => request.get(`/courses/${id}`, { params });

const remove = (id: number) => request.delete(`/admin/courses/${id}`);

const add = (data: any) => request.post('/courses', data);

const update = (id: number, data: TCourse) => request.put(`/admin/courses/${id}`, data);

const courseApi = {
  ...generateAPIWithPaging<TCourse>('courses'),
  getCourses,
  getCourseById,
  remove,
  add,
  update,
};

export default courseApi;
