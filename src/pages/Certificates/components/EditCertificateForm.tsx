import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
import certificateApi from 'apis/certificate';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import Label from 'components/ResoTable/components/Label';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { TUpdateCertificate } from 'types/certificate';
import { CERTIFICATE_STATUS } from 'types/constant';

// ----------------------------------------------------------------------

function CertificateEditForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams();

  const { data: certificate } = useQuery(
    ['user', id],
    () => certificateApi.getCertificateById(Number(id)),
    {
      select: (res) => res.data,
    }
  );

  const onSubmit = async (status: number) => {
    const updateCertificate: TUpdateCertificate = { id: Number(id), status: status };
    try {
      await certificateApi
        .update(updateCertificate!)
        .then(() =>
          enqueueSnackbar(`Cập nhât thành công`, {
            variant: 'success',
          })
        )
        .then(() => navigate(PATH_DASHBOARD.certificates.list))
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
    <Page
      title={`Chi tiết chứng chỉ`}
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
            { name: `${certificate?.name}` },
          ]}
        />
      }
    >
      <Grid container spacing={3}>
        <Grid spacing={3} item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Box>
              <Typography variant="h6">Tên chứng chỉ : {certificate?.name}</Typography>
              <Typography variant="h6">
                Tên Mentor : {certificate?.mentor?.fullName ?? ' '}
              </Typography>
              <Typography variant="h6">
                Tên Môn học : {certificate?.subject?.name ?? ' '}
              </Typography>
              <Stack direction="row">
                <Typography variant="h6">Trạng thái :</Typography>
                {certificate?.status === CERTIFICATE_STATUS.Approved ? (
                  <Label color="success"> Đã được duyệt</Label>
                ) : certificate?.status === CERTIFICATE_STATUS.Denied ? (
                  <Label color="error">Bị từ chối</Label>
                ) : (
                  <Label color="info">Đang đợi duyệt</Label>
                )}
              </Stack>

              {certificate?.status === CERTIFICATE_STATUS.Pending ? (
                <Stack spacing={3} direction="row-reverse" alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    onClick={() => onSubmit(CERTIFICATE_STATUS.Approved)}
                    variant="contained"
                    loading={isSubmitting}
                  >
                    {'Duyệt'}
                  </LoadingButton>
                  <LoadingButton
                    onClick={() => onSubmit(CERTIFICATE_STATUS.Denied)}
                    color="error"
                    type="submit"
                    variant="outlined"
                    loading={isSubmitting}
                  >
                    {'Từ chối'}
                  </LoadingButton>
                </Stack>
              ) : (
                <Box />
              )}
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <CardHeader sx={{ mb: 2 }} title="Hình ảnh chứng chỉ" />
            <CardMedia component="img" image={certificate?.imageUrl} alt="Chứng chỉ" />
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
}

export default CertificateEditForm;
