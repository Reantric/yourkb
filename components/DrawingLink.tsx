"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { LinkIcon } from "lucide-react";
import { useToast } from "./hooks/use-toast";

export default function CopyLinkButton({
  id,
  compact,
  className,
}: {
  id: number;
  compact?: boolean;
  className?: string;
}) {
  const { toast } = useToast();

  const handleCopyLink = () => {
    if (id !== -1) {
      navigator.clipboard.writeText(`https://yourkb.vercel.app/view/${id}`);
      toast({ title: "Link copied to clipboard!", variant: "success" });
    }
  };

  if (compact) {
    return (
      <Button
        size="sm"
        onClick={handleCopyLink}
        className={cn(className, "p-2.5")}
        title="Copy Sharing Link"
      >
        <LinkIcon className="w-5 h-5" />
      </Button>
    );
  }

  return id !== -1 ? (
    <Button
      size="sm"
      onClick={handleCopyLink}
      className={className}
      title="Copy Sharing Link"
    >
      Copy Sharing Link
    </Button>
  ) : (
    <Button
      variant="destructive"
      disabled={true}
      size="sm"
      className={className}
      title="Link Error"
    >
      Link Error
    </Button>
  );
}
