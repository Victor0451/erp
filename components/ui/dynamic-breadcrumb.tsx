"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  // No mostrar breadcrumbs en la raíz del dashboard.
  if (pathSegments.length <= 1) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const isLast = index === pathSegments.length - 1;
          const capitalizedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? <BreadcrumbPage>{capitalizedSegment}</BreadcrumbPage> : <BreadcrumbLink asChild><Link href={href}>{capitalizedSegment}</Link></BreadcrumbLink>}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}