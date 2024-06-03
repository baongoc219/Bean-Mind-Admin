import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, styled, Typography } from '@mui/material';
import majorApi from 'apis/major';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { RHFTextField, RHFUploadAvatar } from 'components/hook-form';
import LoadingAsyncButton from 'components/LoadingAsyncButton';
import Page from 'components/Page';
import { storage } from 'config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { TMajor, TSubjectMajor } from 'types/major';
import { TSubject } from 'types/subject';
import * as yup from 'yup';
import AddSubjectTable from './components/AddSubjectTable';
import SubjectMajorCard from './components/SubjectMajorCard';

// ----------------------------------------------------------------------

const CardTitle = styled(Typography)({
  display: 'inline-block',
  textAlign: 'left',
  marginBottom: '0px',
  fontSize: '24px',
});

function UpdateMajorPage() {
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const { translate } = useLocales();
  const { id } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { data: major } = useQuery(['major', Number(id)], () => majorApi.getMajorById(Number(id)), {
    select: (res) => res.data,
  });
  console.log('major', major);
  const majorMethod = useForm<any>({
    defaultValues: {
      ...major,
    },
  });
  const majorDetail: TMajor = major as TMajor;
  console.log('majorDetail', majorDetail);

  React.useEffect(() => {
    if (major) {
      majorMethod.reset(major);
    }
  }, [major, majorMethod]);

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

  const subjectMethods = useForm<TSubjectMajor>({
    defaultValues: {
      subjectId: 0,
      majorId: Number(id),
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
  } = majorMethod;

  //   const subjects = watch('subjectId');
  //   const setSubjects = (subjects: any[]) => {
  //     setValue('subjects', subjects);
  //   };

  const onSubmit = async (major: any) => {
    try {
      await majorApi
        .update(major!)
        .then(() =>
          enqueueSnackbar(`Thêm thành công`, {
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

  // const handleAddProd = (ids: number[], selectedProds: any[]) => {
  //   const allSelectedProds = unionBy(subjects, selectedProds, 'id');
  //   const updateSelectedProds = allSelectedProds
  //     .filter(({ id }: { id: number }) => ids.includes(id))
  //     .map((p, idx) => ({ ...p }));
  //   setSubjects([...updateSelectedProds]);
  // };

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
      <FormProvider {...majorMethod}>
        <Page
          title={`Chuyên ngành`}
          isTable
          content={
            <HeaderBreadcrumbs
              heading=""
              links={[
                { name: `${translate('dashboard')}`, href: PATH_DASHBOARD.root },
                {
                  name: `Chuyên ngành`,
                  href: PATH_DASHBOARD.majors.root,
                },
                { name: `Chi tiết chuyên ngành` },
              ]}
            />
          }
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ py: 2, px: 3 }}>
                <CardTitle pb={2} variant="subtitle1">
                  Chi tiết chuyên ngành
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
              <LoadingAsyncButton
                disabled={!isDirty}
                onClick={handleSubmit(onSubmit, console.log)}
                type="submit"
                variant="contained"
              >
                Lưu
              </LoadingAsyncButton>
            </Grid>
            <SubjectMajorCard subjects={majorDetail?.subjects} id={Number(id)} />
          </Grid>
        </Page>
      </FormProvider>
    </>
  );
}

export default UpdateMajorPage;
// import roundReceipt from '@iconify/icons-ic/round-receipt';
// import { Icon } from '@iconify/react';
// import { Box, Button, Stack, Tab, Tabs } from '@mui/material';
// import Page from 'components/Page';
// import useLocales from 'hooks/useLocales';
// import { get } from 'lodash';
// import { useSnackbar } from 'notistack';
// import React from 'react';
// import { FormProvider, useForm } from 'react-hook-form';
// import { useQuery } from 'react-query';
// import { useLocation, useParams } from 'react-router-dom';
// import { getCollectionById, updateCollection } from 'redux/collections/api';
// import { TMajor } from 'types/major';
// import majorApi from 'apis/major';
// import CollectionInfoTab from './tabs/CollectionInfoTab';
// import ProductInCollectionTab from './tabs/ProductInCollectionTab';
// import ModalSubjectForm from './components/ModalSubjectForm';

// enum TabType {
//   COLLECTION_INFO = 'COLLETION_INFO',
//   PRODUCT_COLLECTION = 'PRODUCT_COLLECTION'
// }

// function TabPanel(props: any) {
//   const { children, hidden, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={hidden}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       <Box sx={{ py: 2 }}>{children}</Box>
//     </div>
//   );
// }

// const UpdateMajorPage = () => {
//   const { translate } = useLocales();
//   const { state } = useLocation();
//   const { id } = useParams();
//   const [currentTab, setCurrentTab] = React.useState<TabType>(TabType.COLLECTION_INFO);
//   const { enqueueSnackbar } = useSnackbar();

//   const { data: major } = useQuery(['major', Number(id)], () =>
//     majorApi.getMajorById(Number(id))
//   );
//   const form = useForm<TMajor>({
//     defaultValues: {
//       ...major
//     }
//   });

//   React.useEffect(() => {
//     if (major) {
//       form.reset(major);
//     }
//   }, [major]);

//   const onUpdateCollection = (values: TMajor) =>
//     updateCollection(+id!, values)
//       .then(() =>
//         enqueueSnackbar(translate('common.200'), {
//           variant: 'success'
//         })
//       )
//       .catch((err: any) => {
//         const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
//         enqueueSnackbar(errMsg, {
//           variant: 'error'
//         });
//       });

//   const MENU_TABS = [
//     {
//       value: TabType.COLLECTION_INFO,
//       label: translate('collections.collectionInfoTab'),
//       icon: <Icon icon={roundAccountBox} width={20} height={20} />,
//       component: (
//         <Stack>
//           <CollectionInfoTab onSubmit={form.handleSubmit(onUpdateCollection)} />
//         </Stack>
//       )
//     },
//     {
//       value: TabType.PRODUCT_COLLECTION,
//       label: translate('collections.productTab'),
//       icon: <Icon icon={roundReceipt} width={20} height={20} />,
//       component: <ProductInCollectionTab id={id} onSubmit={form.handleSubmit(onUpdateCollection)} />
//     }
//   ];

//   return (
//     <FormProvider {...form}>
//       <Page
//         title={translate('collections.editTitle')}
//         actions={() => [
//           <Button key="delete-collection" size="small" color="error" variant="outlined">
//             {translate('common.delete')}
//           </Button>
//         ]}
//       >
//         <Box mx="auto">
//           <Tabs
//             value={currentTab}
//             scrollButtons="auto"
//             variant="scrollable"
//             allowScrollButtonsMobile
//             onChange={(e, value) => setCurrentTab(value)}
//           >
//             {MENU_TABS.map((tab) => (
//               <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
//             ))}
//           </Tabs>
//           <Box mt={2}>
//             {MENU_TABS.map((tab, index) => {
//               const isMatched = tab.value === currentTab;
//               return (
//                 <TabPanel key={tab.value} index={index} hidden={!isMatched}>
//                   {tab.component}
//                 </TabPanel>
//               );
//             })}
//           </Box>
//         </Box>
//       </Page>
//     </FormProvider>
//   );
// };

// export default UpdateMajorPage;
