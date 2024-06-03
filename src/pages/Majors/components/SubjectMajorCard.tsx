import { TSubjectMajor } from 'types/major';
import { TSubject } from 'types/subject';
import { Box, Card, Grid, Stack, styled, Typography } from '@mui/material';
import { FormProvider, RHFSelect } from 'components/hook-form';
import LoadingAsyncButton from 'components/LoadingAsyncButton';
import { useForm } from 'react-hook-form';
import majorApi from 'apis/major';
import { useSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { get } from 'lodash';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import subjectApi from 'apis/subject';
import { AutoCompleteField } from 'components/ResoTable/components/form';
import { useState } from 'react';
// import RHFSelect from 'components/hook-form/RHFSelect';

const CardTitle = styled(Typography)({
  display: 'inline-block',
  textAlign: 'left',
  marginBottom: '0px',
  fontSize: '24px',
});
type Props = {
  subjects: TSubject[];
  id: number;
};
const SubjectMajorCard = ({ subjects, id }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { data: listSubject } = useQuery(['subject'], () => subjectApi.getSubjects(), {
    select: (res) => res.data.data,
  });
  const [isView, setIsView] = useState(false);
  const subjectOptions = listSubject?.map((c: any) => ({ label: c.name, value: c.id }));
  const getSubject = (option: any) => {
    if (!option) return option;
    if (!option.value) return subjectOptions?.find((opt: any) => opt.value === option);
    return option;
  };
  const subjectMethods = useForm<TSubjectMajor>({
    defaultValues: {
      subjectId: 0,
      majorId: Number(id),
    },
  });
  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = subjectMethods;

  console.log('listSubject', listSubject);
  const onSubmit = async (subject: TSubjectMajor) => {
    try {
      await majorApi
        .addSubjectMajor(subject)
        .then(() =>
          enqueueSnackbar(`Cập nhât thành công`, {
            variant: 'success',
          })
        )
        .then(() => navigate(PATH_DASHBOARD.majors.list))
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

  return (
    <Box>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <FormProvider
              methods={subjectMethods}
              onSubmit={handleSubmit(onSubmit)}
              {...subjectMethods}
            >
              <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="center">
                <CardTitle mb={2} variant="subtitle1">
                  Môn học
                </CardTitle>
                {/* <ModalSubjectForm
                selected={subjects?.map((id: any) => id)}
                onSubmit={handleAddProd}
                trigger={<Button variant="outlined">Thêm môn học</Button>}
              /> */}

                <AutoCompleteField
                  options={listSubject}
                  getOptionLabel={(value: any) => getSubject(value)?.label || ''}
                  isOptionEqualToValue={(option: any, value: any) => {
                    if (!option) return option;
                    return option.value === getSubject(value)?.value;
                  }}
                  transformValue={(opt: any) => opt?.value}
                  size="large"
                  type="text"
                  label={'Chọn môn học'}
                  name="subjectId"
                  fullWidth
                  disabled={isView}
                />
                <LoadingAsyncButton
                  disabled={!isDirty}
                  onClick={handleSubmit(onSubmit, console.log)}
                  type="submit"
                  variant="contained"
                >
                  Lưu
                </LoadingAsyncButton>
              </Stack>
            </FormProvider>
            <Box mt={2}>{/* <AddSubjectTable control={control} /> */}</Box>
          </Card>
        </Stack>
      </Grid>
    </Box>
  );
};
export default SubjectMajorCard;
