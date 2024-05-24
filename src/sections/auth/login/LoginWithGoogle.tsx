import { Button, Stack } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import useAuth from 'hooks/useAuth';
import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';

function LoginWithGoogle() {
  const { loginWithGoogle, user, error } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  async function handleLoginGoogle() {
    try {
      await loginWithGoogle?.();
      // window.location.reload();
    } catch (error: any) {
      enqueueSnackbar('Error', {
        variant: 'error',
      });
    }
  }

  useEffect(() => {
    if (error === 'Invalid account') {
      enqueueSnackbar(error, {
        variant: 'error',
      });
    }
    if (error === 'Student is not actived') {
      enqueueSnackbar(error, {
        variant: 'error',
      });
    }
  }, []);

  return (
    <Stack direction="row" spacing={2} justifyContent="center" pt={3}>
      <Button
        variant="outlined"
        color="error"
        startIcon={<GoogleIcon />}
        onClick={handleLoginGoogle}
      >
        Login with google
      </Button>
    </Stack>
  );
}

export default LoginWithGoogle;
