"use client";

import React from 'react';
import { Button } from './ui/button';

interface CopyLinkButtonProps {
    id: number;
}

const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ id }) => {
    const handleCopyLink = () => {
        if (id !== -1) {
            navigator.clipboard.writeText(`https://yourkb.vercel.app/view/${id}`);
        }
    };

    return (
        <div className="text-2xl">
            {id !== -1 ? (
              <Button variant={'ghost'}><button 
              onClick={handleCopyLink}
          >
              Copy Sharing Link
          </button></Button>
            ) : (
              <Button variant={'ghost'}><span>Link Error</span></Button>
            )}
        </div>
    );
};

export default CopyLinkButton;