import {
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
import React, { ReactNode, useEffect, useState } from 'react';
import subjectApi from 'apis/subject';
import { useQuery } from 'react-query';
import { TSubject } from 'types/subject';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation } from 'react-router';

interface Props extends Omit<Partial<DialogProps>, 'title'> {
  // title: ReactNode;
  // trigger: ReactNode;
  onCancle?: () => void;
  // onOk: () => Promise<any>;
  children?: ReactNode;
  subject_id?: number;
  onAdd?: (data: TSubject) => Promise<any>;
  onEdit?: (data: any) => Promise<any>;
  onClose: () => any;
}

const SubjectForm: React.FC<Props> = ({
  subject_id,
  open,
  onAdd,
  onEdit,
  onClose,
  // trigger,
  // onOk: onSubmit,
  // title,
  children,
  ...others
}: Props) => {
  // const [open, setOpen] = useState(false);
  const { translate } = useLocales();

  const isUpdate = !!subject_id;

  const { pathname } = useLocation();
  const isNew = pathname.includes('new');

  const { data, isLoading } = useQuery(
    ['subject', subject_id],
    () => subjectApi.getSubjectById(subject_id!),
    {
      select: (res) => res.data,
    }
  );

  const schema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên môn học'),
  });
  const form = useForm<TSubject>({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    defaultValues: { ...data },
  });

  const { handleSubmit, reset, setValue } = form;

  useEffect(() => {
    if (data) {
      reset(data);
    }
    if (isNew) {
      reset({ name: '' });
    }
  }, [data, isNew, reset, subject_id]);

  const submitHandler = (values: any) => {
    console.log('Value', values);
    (isUpdate ? onEdit!(values) : onAdd!(values)).finally(() => {
      if (onClose) {
        onClose();
      }
    });
  };

  return (
    <>
      {/* <span
        onClick={() => {
          setOpen(true);
        }}
      >setValue('id', data?.id!);
        {trigger}
      </span> */}
      <Dialog {...others} fullWidth maxWidth="sm" open={open!} onClose={onClose}>
        <DialogTitle>{!isUpdate ? 'Tạo môn học' : 'Cập nhật môn học'}</DialogTitle>
        <DialogContent dividers>
          {isLoading ? <CircularProgress /> : <FormProvider {...form}>{children}</FormProvider>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="inherit">
            {'Hủy'}
          </Button>
          <LoadingAsyncButton variant="contained" onClick={handleSubmit(submitHandler)}>
            {isUpdate ? 'Cập nhật' : 'Tạo'}
          </LoadingAsyncButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubjectForm;
