/* eslint-disable camelcase */
import plusFill from '@iconify/icons-eva/plus-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import { Icon } from '@iconify/react';
// material
import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import { InputField, SelectField } from 'components/form';
import Label from 'components/Label';
import Page from 'components/Page';
import ResoTable from 'components/ResoTable/ResoTable';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
// components
import { useNavigate } from 'react-router-dom';
import orderApi from 'apis/order';
import { PATH_DASHBOARD } from 'routes/paths';
import { TOrder } from 'types/order';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Iconify from 'components/Iconify';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import LoadingAsyncButton from 'components/LoadingAsyncButton';
import { TabContext, TabList } from '@mui/lab';
import { type } from 'os';
import request from 'utils/axios';

const STATUS_OPTIONS = ['Tất cả', 'Đã duyệt', 'Chờ duyệt', 'Đã huỷ'];

enum STATUS {
  Draft = 1, //Mentor tạo khóa học nháp
  Pending = 2, //Mentor đã submit khóa học, chờ duyệt
  Waiting = 3, //Khóa học đã được duyệt chờ đủ mentee
  CancelNotEnough = 4, //Khóa học kết thúc do không đủ thành viên
  Start = 5,
  End = 6,
}

function groupBy(list: any, keyGetter: any) {
  const map = new Map();
  list?.forEach((item: any) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

const OrderListPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [currentItem, setCurrentItem] = useState<TOrder | null>(null);
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();

  const { data: allData } = useQuery('courses', () => request.get('/courses'), {
    select: (res) => res.data.data,
  });
  console.log(allData);
  const result = groupBy(allData, (data: any) => data.status);
  console.log(result.get(5)?.length);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    ref.current?.formControl.setValue(
      'status',
      newValue === '2'
        ? STATUS.Start
        : newValue === '3'
        ? STATUS.Pending
        : newValue === '4'
        ? STATUS.CancelNotEnough
        : ''
    );
    setActiveTab(newValue);
    ref.current?.formControl.setValue('tabindex', newValue);
  };

  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();
  console.log(id);

  const deleteSubjectHandler = () =>
    orderApi
      .delete(currentItem?.id!)
      .then(() => setCurrentItem(null))
      .then(() => ref.current?.reload)
      .then(() =>
        enqueueSnackbar(`Xóa thành công`, {
          variant: 'success',
        })
      )
      .catch((err: any) => {
        const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
        enqueueSnackbar(errMsg, {
          variant: 'error',
        });
      });

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true,
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
    },
    {
      title: 'Học viên',
      dataIndex: 'mentee.fullName',
    },
    {
      title: 'Khoá học',
      dataIndex: 'course.name',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      hideInSearch: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createDate',
      valueType: 'datetime',
      hideInSearch: true,
    },
  ];

  return (
    <Page
      title={`Order`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `Order`,
              href: PATH_DASHBOARD.courses.root,
            },
            { name: `${translate('list')}` },
          ]}
        />
      }
      actions={() => [
        <DeleteConfirmDialog
          key={''}
          open={Boolean(currentItem)}
          onClose={() => setCurrentItem(null)}
          onDelete={deleteSubjectHandler}
          title={
            <>
              {translate('common.confirmDeleteTitle')} <strong>{currentItem?.orderCode}</strong>
            </>
          }
        />,
      ]}
    >
      <Stack spacing={2}>
        <ResoTable
          rowKey="id"
          ref={ref}
          // onEdit={(course: any) => {
          //   navigate(`${PATH_DASHBOARD.courses.root}/${course.id}`);
          //   setIsUpdate(true);
          // }}
          // onView={(course: any) => navigate(`${PATH_DASHBOARD.courses.root}/${course.id}/view`)}
          getData={orderApi.getOrders}
          // onDelete={setCurrentItem}
          columns={columns}
        />
      </Stack>
    </Page>
  );
};

export default OrderListPage;
