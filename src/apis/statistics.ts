import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getStatistics = (params?: any) => request.get('/admin/statistics', { params });

const statisticsApi = {
  ...generateAPIWithPaging('admin/statistics'),
  getStatistics,
};

export default statisticsApi;
