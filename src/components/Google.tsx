import React, { useRef } from 'react';
import useGoogle from './useGoogle';
// import useGoogle from './useGoogle';

interface GoogleProps {
  clientId: string;
  onSuccess: (res: any) => void;
  className: string;
}

const Google = ({ clientId, onSuccess }: GoogleProps) => {
  const { login } = useGoogle({ clientId, onSuccess });
  const buttonRef = useRef(null);

  return (
    <>
      <button id="buttonDiv" ref={buttonRef}></button>
    </>
  );
};

export default Google;
