import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
    return (
        <Toaster
            position="top-center"
            containerStyle={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                position: 'fixed',
                width: '400px',       // increase width
                height: 'auto',       // height adapts
                maxWidth: '90vw',
            }}
            toastOptions={{
                style: {
                    fontSize: '20px',
                    padding: '40px 38px', // more padding for bigger toast
                    borderRadius: '12px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                    minWidth: '400px',
                    maxWidth: '90vw',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',

                },
            }}
        />
    );
};

export default ToastProvider;
