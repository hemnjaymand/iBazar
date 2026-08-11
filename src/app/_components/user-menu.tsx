
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Package,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface UserMenuProps {
  name?: string | null;
  image?: string | null;
  role?: string | null;
}

export function UserMenu({
  name,
  image,
  role,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = name?.trim() || "حساب کاربری";
  const isAdmin = role === "ADMIN";

  /*
   * Close menu when clicking outside.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * Close menu with Escape.
   */
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function toggleMenu() {
    setOpen((current) => !current);
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* ==================== TRIGGER ==================== */}
      <button
        type="button"
        onClick={toggleMenu}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="منوی حساب کاربری"
        className="
          flex items-center gap-2
          rounded-xl
          border border-gray-200
          p-1.5
          transition-colors
          hover:bg-gray-50
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--color-primary)]
          focus-visible:ring-offset-2
          md:px-3 md:py-1.5
        "
      >
        {/* Avatar */}
        <div
          className="
            relative
            flex h-8 w-8
            shrink-0
            items-center justify-center
            overflow-hidden
            rounded-full
            bg-[var(--color-primary)]/10
            text-[var(--color-primary)]
            md:h-9 md:w-9
          "
        >
          {image ? (
            <Image
              src={image}
              alt={displayName}
              fill
              sizes="36px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>

        {/* Name */}
        <span
          className="
            hidden
            max-w-[120px]
            truncate
            text-xs
            font-semibold
            text-gray-700
            md:inline-block
          "
        >
          {displayName}
        </span>

        {/* Arrow */}
        <ChevronDown
          className={`
            hidden h-4 w-4 text-gray-500
            transition-transform duration-200
            md:block
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* ==================== DROPDOWN ==================== */}
      {open && (
        <div
          role="menu"
          aria-label="منوی حساب کاربری"
          className="
            absolute
            left-0
            top-full
            z-50
            mt-2
            w-56
            overflow-hidden
            rounded-2xl
            border
            border-[var(--color-border)]
            bg-[var(--color-card)]
            py-2
            shadow-xl
            animate-in
            fade-in-0
            zoom-in-95
            duration-150
          "
        >
          {/* User Information */}
          <div className="mb-1 border-b border-[var(--color-border)] px-4 py-3">
            <p className="text-xs text-[var(--color-muted-foreground)]">
              خوش آمدید،
            </p>

            <p className="mt-0.5 truncate text-sm font-bold text-[var(--color-foreground)]">
              {displayName}
            </p>
          </div>

          {/* Profile */}
          <Link
            href="/profile"
            role="menuitem"
            onClick={closeMenu}
            className="
              flex items-center gap-2.5
              px-4 py-2.5
              text-xs text-gray-700
              transition-colors
              hover:bg-[var(--color-muted)]
              focus:bg-[var(--color-muted)]
              focus:outline-none
            "
          >
            <Settings className="h-4 w-4 shrink-0 text-gray-500" />
            <span>پروفایل کاربری</span>
          </Link>

          {/* Orders */}
          <Link
            href="/orders"
            role="menuitem"
            onClick={closeMenu}
            className="
              flex items-center gap-2.5
              px-4 py-2.5
              text-xs text-gray-700
              transition-colors
              hover:bg-[var(--color-muted)]
              focus:bg-[var(--color-muted)]
              focus:outline-none
            "
          >
            <Package className="h-4 w-4 shrink-0 text-gray-500" />
            <span>سفارش‌های من</span>
          </Link>

          {/* ==================== ADMIN ==================== */}
          {isAdmin && (
            <>
              <div className="my-1 border-t border-[var(--color-border)]" />

              <Link
                href="/admin"
                role="menuitem"
                onClick={closeMenu}
                className="
                  flex items-center gap-2.5
                  px-4 py-2.5
                  text-xs font-semibold
                  text-[var(--color-primary)]
                  transition-colors
                  hover:bg-[var(--color-muted)]
                  focus:bg-[var(--color-muted)]
                  focus:outline-none
                "
              >
                <Settings className="h-4 w-4 shrink-0" />
                <span>پنل مدیریت</span>
              </Link>
            </>
          )}

          {/* Divider */}
          <div className="my-1 border-t border-[var(--color-border)]" />

          {/* Logout */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              closeMenu();

              /*
               * TODO:
               * اتصال به signOut مربوط به Auth.js
               */
            }}
            className="
              flex w-full
              items-center gap-2.5
              px-4 py-2.5
              text-right
              text-xs
              text-red-600
              transition-colors
              hover:bg-red-50
              focus:bg-red-50
              focus:outline-none
            "
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>خروج از حساب</span>
          </button>
        </div>
      )}
    </div>
  );
}
