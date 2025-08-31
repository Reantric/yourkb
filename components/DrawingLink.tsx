"use client";

import React from "react";
import { Button } from "./ui/button";

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
    <div className="text-2xl flex flex-col pt-4">
      {id !== -1 ? (
        <Button size="sm" onClick={handleCopyLink}>
          Copy Sharing Link
        </Button>
      ) : (
        <Button variant={"outline"} size="sm">
          <span>Link Error</span>
        </Button>
      )}
    </div>
  );
};

export default CopyLinkButton;
