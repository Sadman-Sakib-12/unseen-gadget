'use client';

import { Toaster as SonnerToaster } from 'sonner';

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-gray-500',
          actionButton:
            'group-[.toast]:bg-black group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };