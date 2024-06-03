/* eslint-disable camelcase */
import plusFill from '@iconify/icons-eva/plus-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import { Icon } from '@iconify/react';
// material
import {
  Avatar,
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
import userApi from 'apis/user';
import { PATH_DASHBOARD } from 'routes/paths';
import { TUser } from 'types/user';
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
import axios from 'axios';
import request from 'utils/axios';

const STATUS_OPTIONS = ['Tất cả', 'Đã duyệt', 'Chờ duyệt', 'Đã huỷ'];

enum ROLE {
  Mentee = 1,
  Mentor = 2,
  Admin = 3,
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

const UserListPage = () => {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [currentItem, setCurrentItem] = useState<TUser | null>(null);
  const [activeTab, setActiveTab] = useState('1');
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();

  const { data: allData } = useQuery('users', () => request.get('/admin/users?role-id=1'), {
    select: (res) => res.data.data,
  });
  const pending = groupBy(allData, (data: any) => data.isPending);
  const roleID = groupBy(allData, (data: any) => data.roleId);
  console.log(roleID);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    ref.current?.formControl.setValue('is-pending', newValue === '2' ? 'true' : '');
    setActiveTab(newValue);
    ref.current?.formControl.setValue('tabindex', newValue);
  };

  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();

  const schema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên khoá học'),
  });
  const courseForm = useForm<TUser>({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    // defaultValues: { ...data },
  });

  const { handleSubmit, control, reset } = courseForm;

  // useEffect(() => {
  //   if (data) {
  //     reset(data);
  //   }
  // }, [data, reset]);

  const deleteSubjectHandler = () =>
    userApi
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

  const updateCourseHandler = (user: TUser) =>
    userApi
      .update(user!)
      .then(() => ref.current?.reload)
      .then(() =>
        enqueueSnackbar(`Cập nhât thành công`, {
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
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      hideInSearch: true,
      render: (src: any, { title }: any) => (
        <Avatar alt={title} src={src} style={{ width: '54px', height: '54px' }} />
      ),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
    {
      title: 'Thứ hạng',
      dataIndex: 'badge',
      render: (badge: any) => (
        <Label color={badge === 1 ? 'info' : badge === 2 ? 'primary' : 'default'}>
          {badge === 1 ? 'Senior' : badge === 2 ? 'Junior' : 'Fresher'}
        </Label>
      ),
      hideInSearch: true,
    },
    {
      title: 'Vai trò',
      dataIndex: 'roleId',
      render: (role: any) => (
        <Label color={role === 1 ? 'info' : role === 2 ? 'primary' : 'default'}>
          {role === 1 ? 'Học viên' : role === 2 ? 'Giảng viên' : 'Admin'}
        </Label>
      ),
      hideInSearch: true,
    },
    // {
    //   title: translate('common.table.isAvailable'),
    //   dataIndex: 'status',
    //   render: (status: any) => (
    //     <Label
    //       color={
    //         status === 5
    //           ? 'secondary'
    //           : status === 2
    //           ? 'error'
    //           : status === 3
    //           ? 'warning'
    //           : status === 6
    //           ? 'success'
    //           : 'default'
    //       }
    //     >
    //       {status === 5
    //         ? translate('common.available')
    //         : status === 2
    //         ? 'Chờ duyệt'
    //         : status === 3
    //         ? 'Chờ đủ mentee'
    //         : status === 6
    //         ? 'Đã hoàn thành'
    //         : 'Đã huỷ'}
    //     </Label>
    //   ),
    //   renderFormItem: () => (
    //     <SelectField
    //       fullWidth
    //       sx={{ minWidth: '150px' }}
    //       options={[
    //         {
    //           label: 'Đang diễn ra',
    //           value: '5',
    //         },
    //         {
    //           label: 'Chờ đủ mentee',
    //           value: '3',
    //         },
    //         {
    //           label: 'Đã kết thúc',
    //           value: '6',
    //         },
    //       ]}
    //       name="status"
    //       size="small"
    //       label={translate('common.table.isAvailable')}
    //     />
    //   ),
    //   hideInSearch: activeTab === '2' ? false : true,
    // },
    // {
    //   title: 'Xác thực',
    //   dataIndex: 'isVerified',
    //   hideInSearch: true,
    //   render: (isVeri: any) => (
    //     <Iconify
    //       icon={isVeri ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
    //       sx={{
    //         width: 20,
    //         height: 20,
    //         color: 'success.main',
    //         ...(!isVeri && { color: 'warning.main' }),
    //       }}
    //     />
    //   ),
    // },
    // {
    //   title: 'Ngày sinh',
    //   dataIndex: 'dayOfBirth',
    //   valueType: 'datetime',
    //   hideInSearch: true,
    // },
    // {
    //   title: 'Giờ',
    //   dataIndex: 'createdAt',
    //   valueType: 'time',
    //   hideInTable: true,
    // },
    // {
    //   title: 'Ngày bắt đầu',
    //   dataIndex: 'startDate',
    //   valueType: 'datetime',
    //   hideInSearch: true,
    // },
    // {
    //   title: 'Ngày kết thúc',
    //   dataIndex: 'finishDate',
    //   valueType: 'datetime',
    //   hideInSearch: true,
    // },
    // {
    //   title: 'Ngày cập nhật',
    //   dataIndex: 'updateDate',
    //   valueType: 'datetime',
    //   hideInSearch: true,
    // },
    // {
    //   title: 'Ngày tạo',
    //   dataIndex: 'createDate',
    //   valueType: 'datetime',
    //   hideInSearch: true,
    // },
  ];

  return (
    <Page
      title={`Người dùng`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `Người dùng`,
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
              {translate('common.confirmDeleteTitle')} <strong>{currentItem?.fullName}</strong>
            </>
          }
        />,
      ]}
    >
      <Card>
        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              sx={{ px: 2, bgcolor: 'background.neutral' }}
              variant="scrollable"
            >
              <Tab
                disableRipple
                label={'Tất cả'}
                icon={<Label color={'success'}> {allData?.length} </Label>}
                value="1"
                sx={{ px: 2 }}
              />
              <Tab
                disableRipple
                label={'Đăng ký làm giảng viên'}
                icon={<Label color={'warning'}> {pending.get('true')?.length || 0} </Label>}
                value="2"
                sx={{ px: 2 }}
              />
            </TabList>
          </Box>
          <Stack spacing={2}>
            <ResoTable
              rowKey="id"
              defaultFilters={{
                'role-id': 1,
              }}
              ref={ref}
              onEdit={(user: any) => {
                navigate(`${PATH_DASHBOARD.users.root}/${user.id}`);
                setIsUpdate(true);
              }}
              getData={userApi.getUsers}
              onDelete={setCurrentItem}
              columns={columns}
            />
          </Stack>
        </TabContext>
      </Card>
    </Page>
  );
};

export default UserListPage;
