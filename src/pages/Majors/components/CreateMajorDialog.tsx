import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material';
import LoadingAsyncButton from 'components/LoadingAsyncButton';
import useLocales from 'hooks/useLocales';
import React, { useCallback, ReactNode, useEffect, useState } from 'react';
import subjectApi from 'apis/subject';
import { useQuery } from 'react-query';
import { TSubject } from 'types/subject';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation } from 'react-router';
import { TMajor } from 'types/major';
import { RHFTextField, RHFUploadAvatar } from 'components/hook-form';

interface Props extends Omit<Partial<DialogProps>, 'title'> {
  // title: ReactNode;
  // trigger: ReactNode;
  onCancle?: () => void;
  // onOk: () => Promise<any>;
  children?: ReactNode;
  onAdd?: (data: TSubject) => Promise<any>;
  onClose: () => any;
}

const MajorCreateForm: React.FC<Props> = ({
  open,
  onAdd,
  onClose,
  // trigger,
  // onOk: onSubmit,
  // title,
  children,
  ...others
}: Props) => {
  // const [open, setOpen] = useState(false);
  const { translate } = useLocales();

  const { pathname } = useLocation();
  const isNew = pathname.includes('new');

  const schema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên chuyên ngành'),
  });
  const form = useForm<TMajor>({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });
  const { handleSubmit, reset, setValue } = form;

  const submitHandler = (values: any) => {
    console.log('Value', values);
    onAdd!(values).finally(() => {
      if (onClose) {
        onClose();
      }
    });
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
      <Dialog {...others} fullWidth maxWidth="sm" open={open!} onClose={onClose}>
        <DialogTitle>{'Tạo chuyên ngành'}</DialogTitle>
        <DialogContent dividers>
          <RHFTextField name="name" label="Tên chuyên ngành" />
          <Box sx={{ mb: 5 }}>
            <RHFUploadAvatar
              name="imageUrl"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="inherit">
            {'Hủy'}
          </Button>
          <LoadingAsyncButton variant="contained" onClick={handleSubmit(submitHandler)}>
            {'Tạo'}
          </LoadingAsyncButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MajorCreateForm;
