import SignIn from '@/components/auth/SignIn'
import React from 'react'

interface SigninpageProps {
  searchParams: {
    callbackUrl?: string;
  };
}

const Signinpage = ({ searchParams: { callbackUrl } }: SigninpageProps) => {
  return <SignIn callbackUrl={callbackUrl || '/'} />;
};

export default Signinpage