import { useEffect, useState } from 'react';
import { useAuth } from './DashformContext';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// const loadScript = () => {};

interface HookProps {
  clientId: string;
  onFailure?: (err: any) => void;
  onSuccess?: (res: any) => void;
}

const useGoogle = ({
  clientId,
  onFailure = () => {},
  onSuccess = () => {},
}: HookProps) => {
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
    const w = 500;
    const h = 700;
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
          console.log(popup.location.hash);
          if (popup.location.hash) {
            const query = new URLSearchParams(popup.location.hash);

            const token = query.get('id_token');

            closeDialog();
            userContext.login(token!);
            return onSuccess(token!);
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

  return { login, loading };
};

export default useGoogle;
