import React, { useRef } from 'react';
import useGoogle from './useGoogle';
import { v4 as uuidv4 } from 'uuid';
import GoogleLogo from '../assets/google.svg';
import './Google.css';

interface GoogleProps {
  clientId: string;
  redirectUri: string;
  onSuccess?: (res: any) => void;
  className?: string;
  render?: React.FC;
}

const onFailure = (res: any) => {
  console.log(res);
};

const Google = ({
  clientId,
  redirectUri,
  onSuccess,
  className,
  render,
}: GoogleProps) => {
  const { login } = useGoogle({ clientId, onSuccess, onFailure });

  const handleClick = () => {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.search = new URLSearchParams({
      client_id: clientId,
      response_type: 'token id_token',
      redirect_uri: redirectUri,
      scope: 'openid email profile',
      nonce: uuidv4(),
    }).toString();
    login(url.toString());
  };

  if (render !== undefined) {
    return render({ onClick: handleClick });
  }

  return (
    <button id="googleButton" onClick={handleClick} className={className}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={GoogleLogo} /> Sign in with Google
      </div>
    </button>
  );
};

export default Google;
