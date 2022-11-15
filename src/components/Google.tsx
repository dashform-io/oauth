import React, { useEffect } from 'react';
import useGoogle from './useGoogle';

interface GoogleProps {
  clientId: string;
}

const Google = ({ clientId }: GoogleProps) => {
  const googleHook = useGoogle();

  useEffect(() => {
    console.log(clientId);
    console.log(googleHook);
  });

  return <button>Sign In with Google</button>;
};

export default Google;
