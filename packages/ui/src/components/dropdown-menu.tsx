"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";

interface DropdownContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within a Dropdown provider");
  }
  return context;
}

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function DropdownMenu({ className, children, ...props }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        const target = event.target as Node;
        const dropdown = triggerRef.current.nextElementSibling;
        if (dropdown && !dropdown.contains(target)) {
          setIsOpen(false);
        }
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div className={cn("relative inline-block", className)} {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export interface DropdownMenuTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: ReactNode;
}

export function DropdownMenuTrigger({
  className,
  children,
  ...props
}: DropdownMenuTriggerProps) {
  const { isOpen, setIsOpen, triggerRef } = useDropdownContext();

  return (
    <button
      ref={triggerRef}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      onClick={() => setIsOpen(!isOpen)}
      className={cn("inline-flex items-center", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
}

export function DropdownMenuContent({
  className,
  align = "start",
  side = "bottom",
  children,
  ...props
}: DropdownMenuContentProps) {
  const { isOpen } = useDropdownContext();

  if (!isOpen) return null;

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      className={cn(
        "z-50 min-w-[180px] rounded-md border border-border bg-card p-1 shadow-md",
        side === "bottom" && "mt-1",
        side === "top" && "mb-1",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DropdownMenuItemProps extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  onSelect?: () => void;
}

export function DropdownMenuItem({
  className,
  disabled,
  onSelect,
  children,
  ...props
}: DropdownMenuItemProps) {
  const { setIsOpen } = useDropdownContext();

  const handleClick = () => {
    onSelect?.();
    setIsOpen(false);
  };

  return (
    <button
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-card-foreground",
        "transition-colors duration-instant",
        "focus-visible:outline-none focus-visible:bg-accent",
        "hover:bg-accent",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface DropdownMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
