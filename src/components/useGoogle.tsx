import { useEffect, useState } from 'react';
import { useAuth } from './UserContext';
import jwt from 'jsonwebtoken';

// const loadScript = () => {};

interface HookProps {
  clientId: string;
  //   onFailure: (err: any) => void;
  onSuccess: (res: any) => void;
  //   onRequest: () => void;
  //   responseType: string;
  //   prompt: gapi.auth2.OfflineAccessOptions;
  //   accessType: string;
  //   apiKey: string;
}

const useGoogle = ({
  clientId,
  onSuccess,
}: //   onFailure = (err: any) => {},
//   onSuccess = () => {},
//   onRequest = () => {},
//   responseType,
//   prompt,
//   accessType,
//   apiKey,
HookProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>();
  const userContext = useAuth();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    script.onload = () => {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById('buttonDiv') as HTMLElement,
        {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          width: '400px',
        } // customization attributes
      );
      // google.accounts.id.prompt(); // also display the One Tap dialog
    };
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function handleCredentialResponse(response: any) {
    userContext.login(response.credential);
    document.cookie = `jwt=${response.credential}`;
    onSuccess(response);
  }

  const login = () => {
    google.accounts.id.prompt();
  };

  return { login, loading };
};

export default useGoogle;
