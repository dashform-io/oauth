import React from 'react';
import useGoogle from './useGoogle';
// import useGoogle from './useGoogle';

interface GoogleProps {
  clientId: string;
  onSuccess: (res: any) => void;
}

const Google = ({ clientId, onSuccess }: GoogleProps) => {
  const { login } = useGoogle({ clientId, onSuccess });

  return (
    <>
      <button onClick={login}>login</button>
    </>
  );
};

export default Google;
