"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, UserPlus, LogIn } from "lucide-react";
import Link from "next/link";

interface ProfileButtonProps {
  isMobile?: boolean;
  onMobileNavClose?: () => void;
}

export function ProfileButton({ isMobile = false, onMobileNavClose }: ProfileButtonProps) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    if (isMobile && onMobileNavClose) {
      onMobileNavClose();
    }
    setOpen(false);
  };

  const handleItemClick = () => {
    setOpen(false);
    if (isMobile && onMobileNavClose) {
      onMobileNavClose();
    }
  };

  // For mobile version
  if (isMobile) {
    return status === "authenticated" ? (
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session.user?.image || undefined}
              alt={session.user?.name || "User"}
            />
            <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{session.user?.name || "User"}</p>
            <p className="text-muted-foreground truncate text-xs">{session.user?.email}</p>
          </div>
        </div>

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleItemClick}
            asChild
          >
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleItemClick}
            asChild
          >
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="text-destructive w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </Button>
        </div>
      </div>
    ) : (
      <div className="space-y-1">
        <Button variant="ghost" className="w-full justify-start" onClick={handleItemClick} asChild>
          <Link href="/auth/login">
            <LogIn className="mr-2 h-4 w-4" />
            <span>Sign in</span>
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={handleItemClick} asChild>
          <Link href="/auth/register">
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Create account</span>
          </Link>
        </Button>
      </div>
    );
  }

  // For desktop version
  return status === "authenticated" ? (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className="hidden sm:flex">
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="User profile">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session.user?.image || undefined}
              alt={session.user?.name || "User"}
            />
            <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {session.user?.name && <p className="font-medium">{session.user.name}</p>}
            {session.user?.email && (
              <p className="text-muted-foreground w-[200px] truncate text-sm">
                {session.user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild onClick={handleItemClick}>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={handleItemClick}>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button
      variant="ghost"
      size="icon"
      className="hidden rounded-full sm:flex"
      aria-label="User profile"
      asChild
    >
      <Link href="/auth/login">
        <User className="h-5 w-5" />
      </Link>
    </Button>
  );
}
