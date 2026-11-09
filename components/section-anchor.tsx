"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

import { navigateToSection, sectionHref } from "@/lib/site-nav";

type SectionAnchorProps = {
  id: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

/** Enlace one-page a una sección del landing (`/#id`). */
export function SectionAnchor({ id, className, children, ...rest }: SectionAnchorProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigateToSection(id);
  };

  return (
    <Link href={sectionHref(id)} onClick={onClick} className={className} {...rest}>
      {children}
    </Link>
  );
}
