import React from 'react';
import Alert from '@mui/material/Alert';

const Error = ({ error, success }) => {
  return (
    <div>
      {error && (
        <Alert severity="error">
          {error.error} {error.detail}
        </Alert>
      )}
      {success && (
        <Alert severity="success">{success.success}</Alert>
      )}
    </div>
  );
};

export default Error;