'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { LoaderCircle, Plus, X } from 'lucide-react';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

import { createPost } from '@/actions/createPost';
import { getErrorMessage } from '@/lib/utils';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from './ui/use-toast';
import UploadImagePopover from './upload-image-popover';
import { Switch } from './ui/switch';

const ETH_ADDRESS_REGEX = new RegExp(/^(0x)?[0-9a-fA-F]{40}$/);

const DESCRIPTION_MAX_LENGTH = 2048;

export const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(256),
  body: z.string().max(DESCRIPTION_MAX_LENGTH).optional(),
  anonymous: z.boolean().optional(),
  image: z.string().max(1024).optional(),
  wallet: z
    .string()
    .refine(value => !value || ETH_ADDRESS_REGEX.test(value), {
      message: 'Invalid wallet address',
    })
    .optional(),
  display_name: z
    .string()
    .min(1, 'Enter a display name or post anonymously')
    .max(100)
    .optional(),
});

export default function PostForm({
  className,
  onPost,
}: { className?: string; onPost?: () => void } = {}) {
  const { data: session } = useSession();

  const [saving, setSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      body: '',
      anonymous: true,
      wallet: '',
    },
  });

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    setSaving(true);
    try {
      const response = await createPost(data);
      if (response?.status !== 'success') {
        throw new Error();
      }
      onPost?.();
      form.reset();
      toast({ title: 'Posted, pending approval' });
    } catch (err) {
      toast({
        title: 'Failed to create post',
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }

  const isAnonymousSession = !session?.user?.email;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Share your DOOM story</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* prevent implicit form submission */}
            <button
              type="submit"
              disabled
              className="hidden"
              aria-hidden="true"
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Title of diary entry</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of your DOOM story</FormLabel>
                  <FormControl>
                    <Textarea {...field} maxLength={DESCRIPTION_MAX_LENGTH} />
                  </FormControl>
                  {!!field?.value?.length &&
                    field.value.length > DESCRIPTION_MAX_LENGTH / 2 && (
                      <FormDescription>
                        {field.value.length} / {DESCRIPTION_MAX_LENGTH}
                      </FormDescription>
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  {field.value ? (
                    <>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Image
                            src={field.value}
                            alt="Uploaded image"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-auto h-auto max-h-[10rem] max-w-[10rem] rounded-md"
                          />
                          <Button
                            className="p-0 h-6 w-6"
                            variant="ghost"
                            onClick={() => {
                              form.setValue('image', '');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                    </>
                  ) : (
                    <FormControl>
                      <UploadImagePopover
                        onUpload={url => {
                          form.setValue('image', url);
                        }}
                        trigger={
                          <Button variant="link" className="p-0">
                            <Plus className="h-4 w-4 mr-2" />
                            <FormLabel>Add image</FormLabel>
                          </Button>
                        }
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wallet"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Wallet address (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="anonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Switch
                      disabled={isAnonymousSession}
                      checked={field.value}
                      onCheckedChange={checked => {
                        field.onChange(checked);
                        if (!checked) {
                          form.setValue(
                            'display_name',
                            session?.user?.name || ''
                          );
                          form.clearErrors('display_name');
                        } else {
                          form.setValue('display_name', undefined);
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel>Post anonymously</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues('anonymous') === false && (
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button disabled={saving} type="submit">
              {saving && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
