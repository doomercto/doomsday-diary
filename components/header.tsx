'use client';

import { CircleUserRound, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { AdminContext } from '@/providers/admin-provider';

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface PageDefiniton {
  name: string;
  path: string;
}

const PAGES: ReadonlyArray<PageDefiniton> = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Feed',
    path: '/feed',
  },
  {
    name: 'About',
    path: '/about',
  },
];

function isPageActive(currentPath: string, routePath: string) {
  return routePath === '/'
    ? currentPath === routePath
    : currentPath.startsWith(routePath);
}

export default function Header() {
  const { data: session } = useSession();

  const [sheetOpen, setSheetOpen] = useState(false);

  const [pages, setPages] = useState<ReadonlyArray<PageDefiniton>>(PAGES);

  const pathname = usePathname();

  const isAdmin = useContext(AdminContext);

  useEffect(() => {
    if (isAdmin) {
      setPages(prevPages => {
        if (prevPages.find(page => page.path === '/admin')) {
          return prevPages;
        }
        return [
          ...prevPages,
          {
            name: 'Admin',
            path: '/admin',
          },
        ];
      });
    } else {
      setPages(prevPages => prevPages.filter(page => page.path !== '/admin'));
    }
  }, [isAdmin]);

  const homeLink = (
    <Link
      href="/"
      className="flex items-center gap-2 text-lg font-semibold md:text-base"
    >
      <Avatar>
        <AvatarImage src="/icon.png" alt="Home" />
        <AvatarFallback />
      </Avatar>
      <span className="sr-only">Home</span>
    </Link>
  );

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/70 px-4 md:px-6 backdrop-blur z-30">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        {homeLink}
        {pages.map(route => (
          <Link
            key={route.path}
            href={route.path}
            className={cn(
              'text-muted-foreground transition-colors hover:text-foreground',
              { 'text-foreground': isPageActive(pathname, route.path) }
            )}
          >
            {route.name}
          </Link>
        ))}
      </nav>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetContent aria-describedby={undefined} side="left">
          <nav className="grid gap-6 text-lg font-medium">
            {homeLink}
            {pages.map(route => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  'text-muted-foreground transition-colors hover:text-foreground',
                  { 'text-foreground': isPageActive(pathname, route.path) }
                )}
                onClick={() => setSheetOpen(false)}
              >
                {route.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 flex-initial">
          <Image
            src="/doomeronbase.png"
            alt="Doomer"
            width={0}
            height={0}
            sizes="100vw"
            className="w-auto h-8 min-[400px]:h-10 md:h-12 invert dark:invert-0"
            priority
          />
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                {session?.user?.image && (
                  <AvatarImage
                    src={session.user.image}
                    alt={session.user.name ?? ''}
                  />
                )}
                <AvatarFallback>
                  <CircleUserRound />
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {session?.user?.name ? (
              <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
            ) : (
              <DropdownMenuLabel>Anonymous</DropdownMenuLabel>
            )}
            <DropdownMenuSeparator />
            {session?.user?.email ? (
              <DropdownMenuItem onClick={() => signOut()}>
                Sign out
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => signIn('coinbase')}>
                Sign in
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
