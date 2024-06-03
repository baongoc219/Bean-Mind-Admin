import { TCourse } from 'types/course';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';
import { TCertificate, TUpdateCertificate } from 'types/certificate';

const getCertificates = (params?: any) => request.get('/admin/certificates', { params });

const getCertificateById = (id: number, params?: any) => request.get<TCertificate>(`/admin/certificates/${id}`, { params });

// const remove = (id: number) => request.delete(`/admin/courses/${id}`);

// const add = (data: any) => request.post('/admin/courses', data);

const update = (data: TUpdateCertificate) => request.put(`/admin/certificates`, data);

const certificateApi = {
    ...generateAPIWithPaging<TCertificate>('certificates'),
    getCertificates,
    getCertificateById,
    update,
};

export default certificateApi;