import courseApi from 'apis/course';
import { useQuery } from 'react-query';
/** Get list root categories */
const useCourses = (params?: any) =>
  useQuery(['courses', params], () => courseApi.get(params).then((res) => res.data.items), {
    refetchOnWindowFocus: false,
  });

export default useCourses;
