"use client";

import * as React from "react";
import {
  IconDashboardFilled,
  IconInnerShadowTop,
  IconListDetails,
  IconListTree,
  IconPlus,
  IconSquarePlus,
} from "@tabler/icons-react";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboardFilled,
    },
    {
      title: "Blogs List",
      url: "/dashboard/list-blog",
      icon: IconListDetails,
    },
    {
      title: "Add Blog",
      url: "/dashboard/create-new",
      icon: IconPlus,
    },
    {
      title: "Categories",
      url: "/dashboard/category",
      icon: IconListTree,
    },
    {
      title: "Add Category",
      url: "/dashboard/category/create-new",
      icon: IconSquarePlus,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user?.name || data.user.name,
            email: session?.user?.email || data.user.email,
            avatar: session?.user?.image || data.user.avatar,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
