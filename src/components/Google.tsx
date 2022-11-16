import React, { useRef } from 'react';
import useGoogle from './useGoogle';
// import useGoogle from './useGoogle';

interface GoogleProps {
  clientId: string;
  onSuccess: (res: any) => void;
  className: string;
}

const onFailure = (res: any) => {
  console.log(res);
};

const Google = ({ clientId, onSuccess }: GoogleProps) => {
  const { login } = useGoogle({ clientId, onSuccess, onFailure });
  const buttonRef = useRef(null);

  return (
    <>
      <button
        onClick={async () => {
          const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
          url.search = new URLSearchParams({
            client_id:
              '917460552947-9ouhuaqmj487vls7bti3kh2ka5p9beeu.apps.googleusercontent.com',
            response_type: 'code',
            redirect_uri: 'http://localhost:3000/dashboard',
            scope: 'openid email',
          }).toString();
          login(
            'https://accounts.google.com/o/oauth2/v2/auth?client_id=917460552947-9ouhuaqmj487vls7bti3kh2ka5p9beeu.apps.googleusercontent.com&response_type=code&scope=openid email&redirect_uri=http://localhost:3000/dashboard'
          );
        }}
      >
        Login with Google
      </button>
    </>
  );
};

export default Google;
