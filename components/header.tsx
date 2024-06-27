'use client';

import { CircleUserRound, Menu, NotebookPen, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

import { cn } from '@/lib/utils';

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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

export default function Header() {
  const { data: session } = useSession();

  const [sheetOpen, setSheetOpen] = useState(false);

  const pathname = usePathname();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/70 px-4 md:px-6 backdrop-blur z-30">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <NotebookPen className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </Link>
        {PAGES.map(route => (
          <Link
            key={route.path}
            href={route.path}
            className={cn(
              'text-muted-foreground transition-colors hover:text-foreground',
              { 'text-foreground': route.path === pathname }
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
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
              onClick={() => setSheetOpen(false)}
            >
              <NotebookPen className="h-6 w-6" />
              <span className="sr-only">Home</span>
            </Link>
            {PAGES.map(route => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  'text-muted-foreground transition-colors hover:text-foreground',
                  { 'text-foreground': route.path === pathname }
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
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUserRound className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {session?.user?.name && (
              <>
                <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            {session?.user?.email && session.user.email !== 'anonymous' ? (
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
