/* eslint-disable react/prop-types */
import { Avatar, Box, Button, Card, Stack } from '@mui/material';
// import confirm from 'components/Modal/confirm';
import ModalSubjectForm from './ModalSubjectForm';
import ResoTable from 'components/ResoTable/ResoTable';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useRef } from 'react';
import { TSubjectMajor } from 'types/major';
import subjectApi from 'apis/subject';
import majorApi from 'apis/major';

// eslint-disable-next-line react/prop-types
const ProductMajorForm = ({ id, onAddProduct }: any) => {
  const { translate } = useLocales();
  const tableRef = useRef<any>();

  const { enqueueSnackbar } = useSnackbar();

  const onDelete = (currentDeleteItem: TSubjectMajor) =>{};
    // confirm({
    //   title: 'Xác nhận xoá',
    //   content: 'Xoá tuỳ chỉnh này sẽ tác động tới các sản phẩm đang được áp dụng',
    //   onOk: async () => {
    //     try {
    //     //   await majorApi.removeSubjectMajor(Number(currentDeleteItem!.product_id));
    //     //   enqueueSnackbar(translate('common.201'), {
    //     //     variant: 'success'
    //     //   });
    //       tableRef.current?.reload();
    //     } catch (error) {
    //       enqueueSnackbar(translate('common.error'), {
    //         variant: 'error'
    //       });
    //     }
    //   },
    //   onCancle: () => {}
    // });

  const addProductToCollection = async (ids: number[], data: any) => {
    try {
      await majorApi.addSubjectMajor(data);
      enqueueSnackbar('common.201', {
        variant: 'success'
      });
      tableRef.current?.reload();
    } catch (err) {
      console.log(`err.response`, err as any);
      const errMsg = get(err as any, ['message'], `Có lỗi xảy ra. Vui lòng thử lại`);
      enqueueSnackbar(errMsg, {
        variant: 'error'
      });
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true,
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
    },
  ];

  return (
    <Box flex={1}>
      <Box component={Card} p={2}>
        <Stack justifyContent="flex-end" mb={2} direction="row" spacing={2}>
          <ModalSubjectForm
            onSubmit={addProductToCollection}
            trigger={<Button variant="outlined">Thêm sản phẩm</Button>}
          />
        </Stack>
        <ResoTable
          ref={tableRef}
          showSettings={false}
          columns={columns}
          rowKey="subject_id"
          onDelete={onDelete}
          // onEdit={(values: TModifier) => updateForm.reset(normalizeModifier(values))}
          // renderEdit={(dom: ReactNode, modifier: TModifier) => (
          //   <ModalForm
          //     onOk={async () => {
          //       try {
          //         return true;
          //       } catch (error) {
          //         return false;
          //       }
          //     }}
          //     title={<Typography variant="h3">Cập nhật sản phẩm trong bộ sưu tập</Typography>}
          //     trigger={dom}
          //   >
          //     <FormProvider {...updateForm}>
          //       <InputField name="position" label="Thứ tự" />
          //     </FormProvider>
          //   </ModalForm>
          // )}
          getData={subjectApi.getSubjects}
        />
      </Box>
    </Box>
  );
};

export default ProductMajorForm;
