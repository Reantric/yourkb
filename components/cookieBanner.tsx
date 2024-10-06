'use client'

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already responded
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Set consent in localStorage
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Set declined consent in localStorage
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className='fixed bottom-0 w-full text-center p-10 z-1000 bg-background border border-border max-w-5xl'>
      <p className='pb-5'>We use cookies to improve your experience on our site. By using our site, you agree to our use of necessary cookies for authentication and authorization. You may also choose to accept or deny other non-essential cookies. See <u><Link href='/policies/privacy'>our privacy policy</Link></u> for more details.</p>
      <span className='space-x-5'>
        <Button size="sm" variant={"outline"} onClick={handleAccept}>
          Accept
        </Button>
        <Button size="sm" variant={"outline"} onClick={handleDecline}>
          Decline
        </Button>
      </span>
    </div>
  );
};

export default CookieConsentBanner;