import React from 'react';

const Github = () => {
  return (
    <button
      onClick={async () => {
        const url = new URL('https://github.com/login/oauth/authorize');
        url.search = new URLSearchParams({
          client_id: 'ce321ad8d86aadbed7d9',
          redirect_uri: 'http://localhost:3001/dashboard',
        }).toString();
        await fetch(url.toString());
      }}
    >
      Login with Github
    </button>
  );
};

export default Github;
