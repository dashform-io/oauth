import { MouseEvent, useEffect, useState } from 'react';

// const loadScript = () => {};

interface HookProps {
  clientId: string;
  onFailure: (err: any) => void;
  onSuccess: (res: any) => void;
  onRequest: () => void;
  responseType: string;
  prompt: gapi.auth2.OfflineAccessOptions;
  accessType: string;
  apiKey: string;
}

const useGoogle = ({
  clientId,
  onFailure = (err: any) => {},
  onSuccess = () => {},
  onRequest = () => {},
  responseType,
  prompt,
  accessType,
  apiKey,
}: HookProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  function handleSigninSuccess(res: any) {
    /*
      offer renamed response keys to names that match use
    */
    const basicProfile = res.getBasicProfile();
    const authResponse = res.getAuthResponse(true);
    res.googleId = basicProfile.getId();
    res.tokenObj = authResponse;
    res.tokenId = authResponse.id_token;
    res.accessToken = authResponse.access_token;
    res.profileObj = {
      googleId: basicProfile.getId(),
      imageUrl: basicProfile.getImageUrl(),
      email: basicProfile.getEmail(),
      name: basicProfile.getName(),
      givenName: basicProfile.getGivenName(),
      familyName: basicProfile.getFamilyName(),
    };
    onSuccess(res);
  }

  const signIn = async (e: MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!loading) {
      const GoogleAuth = window.gapi.auth2.getAuthInstance();
      const options = {
        ...prompt,
      };
      onRequest();
      if (responseType === 'code') {
        try {
          const res = await GoogleAuth.grantOfflineAccess(options);
          onSuccess(res);
        } catch (err) {
          onFailure(err);
        }
      } else {
        try {
          const res = await GoogleAuth.signIn(options);
          handleSigninSuccess(res);
        } catch (err) {
          onFailure(err);
        }
      }
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    let unmounted = false;

    document.body.appendChild(script);

    script.onload = () => {
      gapi.client.init({
        apiKey: apiKey,
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return { loading };
};

export default useGoogle;
