import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

export const ToastContainer = () => (
  <Toaster
    position="bottom-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: '#363636',
        color: '#fff',
        direction: 'rtl'
      },
    }}
  />
);

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  custom: (message: string) => toast(message)
}; 