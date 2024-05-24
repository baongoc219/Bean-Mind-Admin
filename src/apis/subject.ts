import { TSubject } from 'types/subject';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getSubjects = (params?: any) => request.get('/admin/subjects', { params });

const getSubjectById = (id: number, params?: any) =>
  request.get<TSubject>(`/admin/subjects/${id}`, { params });

const remove = (id: number) => request.delete(`/admin/subjects/${id}`);

const add = (data: any) => request.post('/admin/subjects', data);

const update = (data: TSubject) => request.put(`/admin/subjects`, data);

const subjectApi = {
  ...generateAPIWithPaging<TSubject>('admin/subjects'),
  getSubjects,
  getSubjectById,
  remove,
  add,
  update,
};

export default subjectApi;
