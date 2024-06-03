import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { Box, Button, Dialog, IconButton, Paper, Stack, Typography } from '@mui/material';
import { SelectField } from 'components/form';
import Iconify from 'components/Iconify';
import Label from 'components/Label';
import useLocales from 'hooks/useLocales';
import { productColumns } from 'pages/Products/config';
import React from 'react';
import { getAllProduct } from 'redux/product/api';
import LoadingAsyncButton from '../LoadingAsyncButton/LoadingAsyncButton';
import ResoTable from '../ResoTable/ResoTable';

const ModalSubjectForm = ({ trigger, onSubmit, selected = [], type = 'checkbox' }) => {
  const [open, setOpen] = React.useState(false);

  const [selectedProductIds, setSelectedProductIds] = React.useState(selected);
  const [selectedProducts, setSelectedProduct] = React.useState([]);

  const { translate } = useLocales();

  const handleClick = () => {
    setOpen((o) => !o);
  };

  const handleSubmit = () =>
    Promise.resolve(onSubmit && onSubmit(selectedProductIds, selectedProducts)).then(() =>
      setOpen(false)
    );

  const handleChangeSelection = React.useCallback((ids, data) => {
    setSelectedProductIds(ids);
    setSelectedProduct(data);
  }, []);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true,
    },
    {
      title: 'Tên môn học',
      dataIndex: 'subjectName',
    },
    {
      title: 'Xác thực',
      dataIndex: 'isVerified',
      hideInSearch: true,
      render: (isVeri) => (
        <Iconify
          icon={isVeri ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
          sx={{
            width: 20,
            height: 20,
            color: 'success.main',
            ...(!isVeri && { color: 'warning.main' }),
          }}
        />
      ),
    },
    {
      title: 'Ngày',
      // dataIndex: 'createdAt',
      valueType: 'date',
      hideInTable: true,
    },
    {
      title: 'Giờ',
      // dataIndex: 'createdAt',
      valueType: 'time',
      hideInTable: true,
    },
    // {
    //   title: 'Ngày update',
    //   dataIndex: 'updatedDate',
    //   valueType: 'datetime',
    //   hideInSearch: true
    // },
    // {
    //   title: 'Ngày phát hành',
    //   dataIndex: 'publishedDate',
    //   valueType: 'datetime',
    //   hideInSearch: true
    // },
    {
      title: translate('common.table.isAvailable'),
      dataIndex: 'isAvailable',
      render: (isAvai) => (
        <Label color={isAvai ? 'success' : 'default'}>
          {isAvai ? translate('common.available') : translate('common.notAvailable')}
        </Label>
      ),
      renderFormItem: () => (
        <SelectField
          fullWidth
          sx={{ minWidth: '150px' }}
          options={[
            {
              label: translate('common.all'),
              value: '',
            },
            {
              label: translate('common.available'),
              value: 'true',
            },
            {
              label: translate('common.unAvailable'),
              value: 'false',
            },
          ]}
          name="is-available"
          size="small"
          label={translate('common.table.isAvailable')}
        />
      ),
    },
  ];

  return (
    <>
      {React.cloneElement(trigger, { onClick: handleClick })}
      <Dialog maxWidth="md" anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box display="flex" flexDirection="column" maxHeight="80vh">
          <Paper>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              pt={0}
              borderBottom={1}
              borderColor="grey.300"
              textAlign="right"
            >
              <Typography variant="h6">Thêm sản phẩm vào thực đơn</Typography>
              <IconButton aria-label="close" onClick={() => setOpen(false)} size="large">
                <Icon icon={closeFill} />
              </IconButton>
            </Box>
          </Paper>
          <Box p={1} sx={{ flex: 1, overflowY: 'auto' }}>
            <Stack spacing={2}>
              <ResoTable
                checkboxSelection={{
                  selection: selectedProductIds,
                  type: type,
                }}
                showAction={false}
                scroll={{ y: '50%', x: '100%' }}
                rowKey="product_id"
                getData={getAllProduct}
                onChangeSelection={handleChangeSelection}
                columns={columns}
              />
            </Stack>
          </Box>
          <Box
            p={2}
            borderTop={1}
            borderColor="grey.300"
            component={Paper}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1">
              Đã chọn <strong>{selectedProductIds.length}</strong> sản phẩm
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <LoadingAsyncButton onClick={handleSubmit} variant="contained">
                Thêm
              </LoadingAsyncButton>
            </Stack>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ModalSubjectForm;
