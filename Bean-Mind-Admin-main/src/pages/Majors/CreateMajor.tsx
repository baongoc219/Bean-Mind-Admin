import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { TCourse } from 'types/course';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { PATH_DASHBOARD } from 'routes/paths';
import {
  Autocomplete,
  Button,
  Card,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  styled,
  TextField,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { isBefore } from 'date-fns';
import {
  RHFTextField,
  RHFEditor,
  RHFUploadMultiFile,
  RHFSwitch,
  RHFRadioGroup,
  RHFSelect,
  RHFUploadSingleFile,
  RHFUploadAvatar,
} from 'components/hook-form';
import { LoadingButton, MobileDateTimePicker, DateTimePicker } from '@mui/lab';
import useLocales from 'hooks/useLocales';
import { useQuery } from 'react-query';
import subjectApi from 'apis/subject';
import { AutoCompleteField, SelectField } from 'components/form';
import request from 'utils/axios';
import Page from 'components/Page';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import courseApi from 'apis/course';
import majorApi from 'apis/major';
import { get, unionBy } from 'lodash';
import ModalSubjectForm from './components/ModalSubjectForm';
import { TMajor } from 'types/major';
import LoadingAsyncButton from 'components/LoadingAsyncButton';
import AddSubjectTable from './components/AddSubjectTable';

// ----------------------------------------------------------------------

const CardTitle = styled(Typography)({
  display: 'inline-block',
  textAlign: 'left',
  marginBottom: '0px',
  fontSize: '24px',
});

function CreateMajor() {
  const navigate = useNavigate();

  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    // subjects: yup
    //   .array()
    //   .min(1, 'Vui lòng có ít nhất một sản phẩm')
    //   .of(
    //     yup.object().shape({
    //       position: yup.string().required('Vui lòng chọn giá trị'),
    //     })
    //   ),
  });

  const methods = useForm<any>({
    defaultValues: {
      name: '',
      imageUrl: '',
    },
    resolver: yupResolver(schema),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const subjects = watch('subjects');
  const setSubjects = (subjects: any[]) => {
    setValue('subjects', subjects);
  };

  const onSubmit = async (major: any) => {
    try {
      await majorApi
        .add(major!)
        .then(() =>
          enqueueSnackbar(`Thêm thành công`, {
            variant: 'success',
          })
        )
        .then(() => navigate(PATH_DASHBOARD.courses.list))
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

  const handleAddProd = (ids: number[], selectedProds: any[]) => {
    const allSelectedProds = unionBy(subjects, selectedProds, 'id');
    const updateSelectedProds = allSelectedProds
      .filter(({ id }: { id: number }) => ids.includes(id))
      .map((p, idx) => ({ ...p }));
    setSubjects([...updateSelectedProds]);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'imageUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <>
      <FormProvider {...methods}>
        <Page
          title={`Khoá học`}
          isTable
          content={
            <HeaderBreadcrumbs
              heading=""
              links={[
                { name: `${translate('dashboard')}`, href: PATH_DASHBOARD.root },
                {
                  name: `Chuyên ngành`,
                  href: PATH_DASHBOARD.courses.root,
                },
                { name: `Tạo chuyên ngành` },
              ]}
            />
          }
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ py: 2, px: 3 }}>
                <CardTitle pb={2} variant="subtitle1">
                  Thêm chuyên ngành
                </CardTitle>
                <Box sx={{ mb: 5 }}>
                  <RHFUploadAvatar
                    name="imageUrl"
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDrop}
                  />
                </Box>
              </Card>
              <Card sx={{ p: 3, my: 3 }}>
                <Stack spacing={3}>
                  <RHFTextField name="name" label="Tên chuyên ngành" />
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <Stack
                    spacing={1}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <CardTitle mb={2} variant="subtitle1">
                      Môn học
                    </CardTitle>
                    <ModalSubjectForm
                      selected={subjects?.map((id: any) => id)}
                      onSubmit={handleAddProd}
                      trigger={<Button variant="outlined">Thêm môn học</Button>}
                    />
                  </Stack>
                  <Box mt={2}>
                    <AddSubjectTable control={control} />
                  </Box>
                </Card>

                <LoadingAsyncButton
                  disabled={!isDirty}
                  onClick={handleSubmit(onSubmit, console.log)}
                  type="submit"
                  variant="contained"
                >
                  Lưu
                </LoadingAsyncButton>
              </Stack>
            </Grid>
          </Grid>
        </Page>
      </FormProvider>
    </>
  );
}

export default CreateMajor;
