import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';

import { getErrorMessage, mergeRefs } from '@/lib/utils';

import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

const imageUploadForm = z.object({
  image: z.any().refine(file => file),
});

export default function UploadImage({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const form = useForm<z.infer<typeof imageUploadForm>>({
    resolver: zodResolver(imageUploadForm),
    defaultValues: {
      image: '',
    },
  });

  async function handleSubmit(_data: z.infer<typeof imageUploadForm>) {
    setUploading(true);

    try {
      if (!inputRef.current?.files) {
        throw new Error('No file selected');
      }
      const requestData = new FormData();
      requestData.append('image', inputRef.current.files[0]);
      const result = await fetch('/api/image', {
        method: 'POST',
        body: requestData,
      });

      const resultJson = await result.json().catch(() => ({}));
      if (resultJson?.error) {
        throw new Error(resultJson.error.message ?? resultJson.error);
      }
      if (!result.ok || !resultJson?.url) {
        throw new Error();
      }
      onUpload(resultJson.url);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to upload image',
        description: getErrorMessage(err),
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          className="px-4 py-2 flex flex-col gap-4"
          onSubmit={event => {
            event.stopPropagation();
            event.preventDefault();
            form.handleSubmit(handleSubmit)();
          }}
        >
          <div className="px-2">
            Images hosted by{' '}
            <Link
              className="text-blue-500 dark:text-blue-400"
              target="_blank"
              href="https://imgbb.com"
            >
              imgbb.com
            </Link>
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    ref={mergeRefs(field.ref, inputRef)}
                    type="file"
                    accept="image/*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="grow-0" type="submit" disabled={uploading}>
            {uploading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Upload now
          </Button>
        </form>
      </Form>
    </div>
  );
}
