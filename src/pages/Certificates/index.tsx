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
import certificateApi from 'apis/certificate';
import { CERTIFICATE_STATUS } from 'types/constant';

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

const CertificateListPage = () => {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [currentItem, setCurrentItem] = useState<TUser | null>(null);
  const [activeTab, setActiveTab] = useState('1');
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();

  const { data: allData } = useQuery('certificates', () => certificateApi.getCertificates(), {
    select: (res) => res.data.data,
  });

  const result = groupBy(allData, (data: any) => data.status);
  console.log(result);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    ref.current?.formControl.setValue(
      'status',
      newValue === '2'
        ? CERTIFICATE_STATUS.Pending
        : newValue === '3'
        ? CERTIFICATE_STATUS.Approved
        : newValue === '4'
        ? CERTIFICATE_STATUS.Denied
        : newValue === '1'
        ? null
        : ''
    );
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
      title: 'Tên chứng chỉ',
      dataIndex: 'name',
    },
    {
      title: 'Mentor',
      dataIndex: 'mentor.fullName',
    },
    {
      title: 'Môn học',
      dataIndex: 'subject.name',
    },
    // {s
    //   title: 'Thứ hạng',
    //   dataIndex: 'badge',
    //   render: (badge: any) => (
    //     <Label color={badge === 1 ? 'info' : badge === 2 ? 'primary' : 'default'}>
    //       {badge === 1 ? 'Senior' : badge === 2 ? 'Junior' : 'Fresher'}
    //     </Label>
    //   ),
    //   hideInSearch: true,
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: any) => (
        <Label color={status === 3 ? 'error' : status === 2 ? 'success' : 'warning'}>
          {status === 3 ? 'Bị từ chối' : status === 2 ? 'Đã duyệt' : 'Đợi duyệt'}
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
      title={`Chứng chỉ`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `Chứng chỉ`,
              href: PATH_DASHBOARD.certificates.root,
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
                icon={<Label color={'info'}> {allData?.length} </Label>}
                value="1"
                sx={{ px: 2 }}
              />
              <Tab
                disableRipple
                label={'Đợi duyệt'}
                icon={<Label color={'warning'}> {result.get(1)?.length || 0} </Label>}
                value="2"
                sx={{ px: 2 }}
              />
              <Tab
                disableRipple
                label={'Đã duyệt'}
                icon={<Label color={'success'}> {result.get(2)?.length || 0} </Label>}
                value="3"
                sx={{ px: 2 }}
              />
              <Tab
                disableRipple
                label={'Bị từ chối'}
                icon={<Label color={'error'}> {result.get(3)?.length || 0} </Label>}
                value="4"
                sx={{ px: 2 }}
              />
            </TabList>
          </Box>
          <Stack spacing={2}>
            <ResoTable
              rowKey="id"
              // defaultFilters={{
              //   'role-id': 1,
              // }}
              ref={ref}
              onEdit={(certificate: any) => {
                navigate(`${PATH_DASHBOARD.certificates.root}/${certificate.id}`);
                setIsUpdate(true);
              }}
              getData={certificateApi.getCertificates}
              // onDelete={setCurrentItem}
              columns={columns}
            />
          </Stack>
        </TabContext>
      </Card>
    </Page>
  );
};

export default CertificateListPage;
