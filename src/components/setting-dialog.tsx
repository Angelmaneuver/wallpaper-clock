import { zodResolver } from '@hookform/resolvers/zod';
import { invoke } from '@tauri-apps/api/tauri';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createGlobalStyle } from 'styled-components';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const BodyStyle = createGlobalStyle<{ url?: string }>`
body {
  background-image:    ${(props) =>
    props.url ? `url("${props.url}")` : 'none'};
  background-size:     cover;
  background-position: center;
  background-repeat:   no-repeat;
}

body::before {
  content:    '';
  background: inherit;
  filter:     brightness(.85);;
  position:   absolute;
  top:        0;
  right:      0;
  bottom:     0;
  left:       0;
  z-index:   -1;
}

`;

const formSchema = z.object({
  image_path: z.string().url({ message: '有効なURLではありません。' }),
});

type Settings = {
  image_path: string;
};

type SettingDialogProps = Required<
  Pick<React.ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>
>;

function SettingDialog({ open, onOpenChange }: SettingDialogProps) {
  const [url, setUrl] = useState('');

  async function get_settings(): Promise<Settings> {
    return await invoke('get_settings');
  }

  async function set_image_path(image_path: string) {
    return invoke('set_image_path', { newImagePath: image_path });
  }

  const defaultValues = get_settings();

  defaultValues.then((settings) => setUrl(settings.image_path));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setUrl(values.image_path);

    set_image_path(values.image_path);

    onOpenChange(false);
  }

  return (
    <>
      <BodyStyle url={url} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>壁紙</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="image_path"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder="画像ファイルのパス"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">変更を保存する</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SettingDialog;
