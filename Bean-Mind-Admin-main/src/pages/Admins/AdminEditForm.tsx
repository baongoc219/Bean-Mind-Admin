import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import userApi from 'apis/user';
import { AutoCompleteField } from 'components/form';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { FormProvider, RHFTextField, RHFUploadAvatar } from 'components/hook-form';
import Page from 'components/Page';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { TAdmin } from 'types/user';
import { fData } from 'utils/formatNumber';
import * as yup from 'yup';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from 'config';

// ----------------------------------------------------------------------

type Props = {
  isEdit: boolean;
};

function AdminEditForm() {
  const [percent, setPercent] = useState(0);
  const navigate = useNavigate();

  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams();

  const schema = yup.object().shape({
    // name: yup.string().required('Name is required'),
    // minQuantity: yup.number().required('Min quantity is required.'),
    // maxQuantity: yup
    //   .number()
    //   .required('Max quantity is required.')
    //   .when('minQuantity', (minQuantity, maxQuantity): any => {
    //     if (Number(maxQuantity) < Number(minQuantity)) {
    //       return yup.string().required('Max must be larger than Min');
    //     }
    //   }),
    // description: yup.string().required('Description is required'),
    // images: yup.array().min(1, 'Images is required'),
    // price: yup.number().moreThan(0, 'Price should not be $0.00'),
  });

  const { data: user } = useQuery(['user', id], () => userApi.getUserById(Number(id)), {
    select: (res) => res.data,
  });

  const methods = useForm<TAdmin>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...user,
    },
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const genders = [
    {
      id: 1,
      name: 'Nam',
    },
    {
      id: 2,
      name: 'Nữ',
    },
  ];
  const genderOptions = genders?.map((c: any) => ({ label: c.name, value: c.id }));
  const getGender = (option: any) => {
    if (!option) return option;
    if (!option.value) return genderOptions?.find((opt: any) => opt.value === option);
    return option;
  };

  const roles = [
    {
      id: 1,
      name: 'Học viên',
    },
    {
      id: 2,
      name: 'Giảng viên',
    },
    {
      id: 3,
      name: 'Admin',
    },
  ];
  const roleOptions = roles?.map((c: any) => ({ label: c.name, value: c.id }));
  const getRole = (option: any) => {
    if (!option) return option;
    if (!option.value) return roleOptions?.find((opt: any) => opt.value === option);
    return option;
  };

  const ranks = [
    {
      id: 1,
      name: 'Fresher',
    },
    {
      id: 2,
      name: 'Junior',
    },
    {
      id: 3,
      name: 'Senior',
    },
  ];
  const rankOptions = ranks?.map((c: any) => ({ label: c.name, value: c.id }));
  const getRank = (option: any) => {
    if (!option) return option;
    if (!option.value) return rankOptions?.find((opt: any) => opt.value === option);
    return option;
  };

  const onSubmit = async (user: TAdmin) => {
    try {
      await userApi
        .update(user!)
        .then(() =>
          enqueueSnackbar(`Cập nhât thành công`, {
            variant: 'success',
          })
        )
        .then(() => navigate(PATH_DASHBOARD.users.list))
        .catch((err: any) => {
          const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
          enqueueSnackbar(errMsg, {
            variant: 'error',
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const storageRef = ref(storage, `/files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
            setValue('imageUrl', url);
          });
        }
      );
    },
    [setValue]
  );

  return (
    <>
      <FormProvider {...methods} methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                { name: `${user?.fullName}` },
              ]}
            />
          }
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ py: 10, px: 3 }}>
                <Box sx={{ mb: 5 }}>
                  <RHFUploadAvatar
                    name="imageUrl"
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    helperText={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of {fData(3145728)}
                      </Typography>
                    }
                  />
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <RHFTextField name="fullName" label="Họ và tên" />
                  <RHFTextField name="email" label="Email" />
                  <RHFTextField name="phone" label="Số điện thoại" />

                  <RHFTextField name="address" label="Địa chỉ" />
                  <AutoCompleteField
                    options={genderOptions}
                    getOptionLabel={(value: any) => getGender(value)?.label || ''}
                    isOptionEqualToValue={(option: any, value: any) => {
                      if (!option) return option;
                      return option.value === getGender(value)?.value;
                    }}
                    transformValue={(opt: any) => opt?.value}
                    name="gender"
                    size="large"
                    type="text"
                    label="Giới tính"
                    fullWidth
                  />
                  <AutoCompleteField
                    options={roleOptions}
                    getOptionLabel={(value: any) => getRole(value)?.label || ''}
                    isOptionEqualToValue={(option: any, value: any) => {
                      if (!option) return option;
                      return option.value === getRole(value)?.value;
                    }}
                    transformValue={(opt: any) => opt?.value}
                    name="roleId"
                    size="large"
                    type="text"
                    label="Vai trò"
                    fullWidth
                  />
                  <AutoCompleteField
                    options={rankOptions}
                    getOptionLabel={(value: any) => getRank(value)?.label || ''}
                    isOptionEqualToValue={(option: any, value: any) => {
                      if (!option) return option;
                      return option.value === getRank(value)?.value;
                    }}
                    transformValue={(opt: any) => opt?.value}
                    name="badge"
                    size="large"
                    type="text"
                    label="Thứ hạng"
                    fullWidth
                  />
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {'Save Changes'}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
          =
        </Page>
      </FormProvider>
    </>
  );
}

export default AdminEditForm;
