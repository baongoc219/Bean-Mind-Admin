import { TMajor, TSubjectMajor } from 'types/major';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getMajors = (params?: any) => request.get('/admin/majors', { params });

const getMajorById = (id: number, params?: any) => request.get(`/admin/majors/${id}`, { params });

const remove = (id: number) => request.delete(`/admin/majors/${id}`);

const add = (data: TMajor) => request.post('/admin/majors', data);

const update = (data: TMajor) => request.put(`/admin/majors`, data);

const addSubjectMajor = (data: TSubjectMajor) => request.post(`/admin/majors/subject-major`, data);
const removeSubjectMajor = (data: TSubjectMajor) =>
  request.delete(`/admin/majors/subject-major`, { data });

const majorApi = {
  ...generateAPIWithPaging<TMajor>('/admin/majors'),
  getMajors,
  getMajorById,
  remove,
  add,
  update,
  addSubjectMajor,
  removeSubjectMajor,
};

export default majorApi;
