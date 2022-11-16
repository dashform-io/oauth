import React from 'react';
import useGoogle from './useGoogle';
// import useGoogle from './useGoogle';

interface GoogleProps {
  clientId: string;
  onSuccess: (res: any) => void;
}

const Google = ({ clientId, onSuccess }: GoogleProps) => {
  const { user } = useGoogle({ clientId, onSuccess });

  return (
    <>
      <button id="buttonDiv">login</button>
    </>
  );
};

export default Google;
