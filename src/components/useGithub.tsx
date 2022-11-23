import { useEffect, useState } from 'react';
import { useAuth } from './DashformContext';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// const loadScript = () => {};

interface HookProps {
  clientId: string;
  onFailure: (err: any) => void;
  onSuccess: (res: any) => void;
  // onRequest: () => void;
  //   responseType: string;
  //   prompt: gapi.auth2.OfflineAccessOptions;
  //   accessType: string;
  //   apiKey: string;
}

const useGithub = ({
  clientId,
  onFailure,
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
          theme: 'filled_black',
          size: 'large',
          type: 'standard',
          width: '300px',
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

  const login = async (url: string) => {
    let popup = openPopup();
    popup!.location.href = url;
    polling(popup!);
  };

  const openPopup = () => {
    const w = 400;
    const h = 600;
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;

    return window.open(
      '',
      '',
      'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
        w +
        ', height=' +
        h +
        ', top=' +
        top +
        ', left=' +
        left
    );
  };

  const polling = (popup: Window) => {
    const polling = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(polling);
        onFailure(new Error('Popup has been closed by user'));
      }

      const closeDialog = () => {
        clearInterval(polling);
        popup.close();
      };

      try {
        if (
          !popup.location.hostname.includes('accounts.google.com') &&
          popup.location.hostname !== ''
        ) {
          if (popup.location.search) {
            const query = new URLSearchParams(popup.location.search);

            const code = query.get('code');

            closeDialog();
            return getOauthToken(code!);
          } else {
            closeDialog();
            return onFailure(
              new Error(
                'OAuth redirect has occurred but no query or hash parameters were found. ' +
                  'They were either not set during the redirect, or were removed—typically by a ' +
                  'routing library—before Twitter react component could read it.'
              )
            );
          }
        }
      } catch (error) {
        // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
        // A hack to get around same-origin security policy errors in IE.
      }
    }, 500);
  };

  const getOauthToken = async (code: string) => {
    try {
      const res = await fetch(`ce321ad8d86aadbed7d9`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          client_id:
            '917460552947-9ouhuaqmj487vls7bti3kh2ka5p9beeu.apps.googleusercontent.com',
          redirect_uri: 'http://localhost:3001/dashboard',
          grant_type: 'authorization_code',
        }),
      });
      const data = await res.json();
      userContext.login(data.id_token);
      onSuccess(data);
    } catch (err) {
      onFailure(err);
    }
  };

  return { login, loading };
};

export default useGithub;
