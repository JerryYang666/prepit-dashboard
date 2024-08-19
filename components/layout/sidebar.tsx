"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { usePrepitUserSession } from "@/contexts/PrepitUserSessionContext";

export default function Sidebar() {
  const { userCanManageWorkspace } = usePrepitUserSession();

  const filteredNavItems = navItems.filter(
    (item) => !item.teacherOnly || (item.teacherOnly && userCanManageWorkspace),
  );

  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-16 lg:block w-72`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
              Menu
            </h2>
            <DashboardNav items={filteredNavItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
