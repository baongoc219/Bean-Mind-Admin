import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { Box, Button, Dialog, IconButton, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import subjectApi from 'apis/subject';
import ResoTable from 'components/ResoTable/ResoTable';
import LoadingAsyncButton from 'components/LoadingAsyncButton';

const ModalSubjectForm = ({ trigger, onSubmit, selected = [], type = 'checkbox' }: any) => {
  const [open, setOpen] = React.useState(false);

  const [selectedSubjectIds, setSelectedSubjectIds] = React.useState(selected);
  const [selectedSubjects, setSelectedSubject] = React.useState([]);

  const handleClick = () => {
    setOpen((o) => !o);
  };

  const handleSubmit = () =>
    Promise.resolve(onSubmit && onSubmit(selectedSubjectIds, selectedSubjects)).then(() =>
      setOpen(false)
    );

  const handleChangeSelection = React.useCallback((ids, data) => {
    setSelectedSubjectIds(ids);
    setSelectedSubject(data);
  }, []);

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
    <>
      {React.cloneElement(trigger, { onClick: handleClick })}
      <Dialog maxWidth="md" open={open} onClose={() => setOpen(false)}>
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
              <Typography variant="h6">Thêm môn học vào chuyên ngành</Typography>
              <IconButton aria-label="close" onClick={() => setOpen(false)} size="large">
                <Icon icon={closeFill} />
              </IconButton>
            </Box>
          </Paper>
          <Box p={1} sx={{ flex: 1, overflowY: 'auto' }}>
            <Stack spacing={2}>
              <ResoTable
                checkboxSelection={{
                  selection: selectedSubjectIds,
                  type: type,
                }}
                showAction={false}
                scroll={{ y: '50%', x: '100%' }}
                rowKey="id"
                getData={subjectApi.getSubjects}
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
              Đã chọn <strong>{selectedSubjectIds.length}</strong> môn học
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
