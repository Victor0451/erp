"use client";

import { signOut, useSession } from "next-auth/react";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavUser() {
  const { data: session } = useSession();
  const { isMobile } = useSidebar();

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U"; // User
    const nameParts = name.split(" ").filter(Boolean);
    if (nameParts.length === 0) return "U";
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    const firstInitial = nameParts[0][0];
    const lastInitial = nameParts[nameParts.length - 1][0];
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const user = session?.user;
  console.log("Session user:", user?.role);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.name || "Usuario"}
                </span>
                <span className="truncate text-xs">{user?.email || ""}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name || "Usuario"}
                  </span>
                  <span className="truncate text-xs">{user?.email || ""}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user?.role === "admin" ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    <Link href="/admin">Panel Administrador</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            ) : null}

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <LayoutDashboard />
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Perfil
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
