import { useCallback, useState } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import UploadImage from './upload-image';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { DialogTitle } from './ui/dialog';

import type { ReactNode } from 'react';

export default function UploadImagePopover({
  trigger,
  onUpload,
}: {
  trigger: ReactNode;
  onUpload: (url: string) => void;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [open, setOpen] = useState(false);

  const handleUpload = useCallback(
    (url: string) => {
      setOpen(false);
      setTimeout(() => {
        onUpload(url);
      }, 100);
    },
    [onUpload]
  );

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="mb-8">
          <DialogTitle className="px-6 py-4">Upload Image</DialogTitle>
          <UploadImage onUpload={handleUpload} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-90 mx-4">
        <UploadImage onUpload={handleUpload} />
      </PopoverContent>
    </Popover>
  );
}
