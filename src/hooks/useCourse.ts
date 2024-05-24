import courseApi from 'apis/course';
import { useQuery } from 'react-query';
/** Get list root categories */
const useCourses = (params?: any) =>
  useQuery(['courses', params], () => courseApi.get(params).then((res) => res.data.data), {
    refetchOnWindowFocus: false,
  });

export default useCourses;
