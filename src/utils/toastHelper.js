import { toast } from 'react-toastify';

export const toastError = msg => {
  toast.error(msg, { position: toast.POSITION.TOP_CENTER });
};

export const toastSuccess = msg => {
  toast.success(msg, { position: toast.POSITION.TOP_CENTER });
};
