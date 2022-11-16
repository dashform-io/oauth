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
      // google.accounts.id.renderButton(
      //   document.getElementById('buttonDiv') as HTMLElement,
      //   {
      //     theme: 'outline',
      //     size: 'large',
      //     type: 'standard',
      //   } // customization attributes
      // );
      google.accounts.id.prompt(); // also display the One Tap dialog
    };
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function login() {
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params: any = {
      client_id: clientId,
      redirect_uri: 'http://localhost:3001',
      response_type: 'token',
      scope: 'http://localhost:3001',
      include_granted_scopes: 'true',
      state: 'pass-through value',
    };

    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }

  function handleCredentialResponse(response: any) {
    console.log('Encoded JWT ID token: ' + response.credential);
    userContext.login(response.credential);
    console.log(userContext);
    document.cookie = `jwt=${response.credential}`;
    onSuccess(response);
  }

  return { login, user, loading };
};

export default useGoogle;
