"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import {
  Eye,
  Film,
  Heart,
  Home,
  LucideProps,
  Menu,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

const DISABLE_TOGGLE = false

type Link = {
  label: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  active: boolean;
  badge?: number;
};

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { watchlist, favorites } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems: Link[] = [
    {
      label: "Accueil",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      label: "Explorer",
      href: "/explore",
      icon: Search,
      active: pathname === "/explore" || pathname === "/results",
    },
    {
      label: "Watchlist",
      href: "/watchlist",
      icon: Eye,
      active: pathname === "/watchlist",
      badge: watchlist.length,
    },
    {
      label: "Favoris",
      href: "/favorites",
      icon: Heart,
      active: pathname === "/favorites",
      badge: favorites.length,
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Navigation Desktop */}
      <nav className="fixed top-0 right-0 left-0 z-50 hidden bg-white/80 shadow-sm backdrop-blur-sm md:block">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div
              className="flex cursor-pointer items-center space-x-2"
              onClick={() => handleNavigation("/")}
            >
              <Image src="/icon.svg" alt="REKO logo" width={32} height={32} />
              <span className="from-primary bg-linear-to-r to-orange-500 bg-clip-text text-xl font-bold text-transparent">
                REKO
              </span>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant={item.active ? "default" : "ghost"}
                    onClick={() => handleNavigation(item.href)}
                    className={`relative flex items-center gap-2 ${
                      item.active
                        ? "from-primary bg-linear-to-r to-orange-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden lg:block">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 bg-orange-500 text-xs text-white"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                );
              })}

              {/* Theme Toggler */}
              {!DISABLE_TOGGLE && <AnimatedThemeToggler />}
            </div>
          </div>
        </div>
      </nav>
      {/* Navigation Mobile */}
      <div className="md:hidden">
        {/* Header Mobile */}
        <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4">
            {/* Logo */}
            <div
              className="flex cursor-pointer items-center space-x-2"
              onClick={() => handleNavigation("/")}
            >
              <div className="from-primary flex size-8 items-center justify-center rounded-lg bg-linear-to-r to-orange-500">
                <Film className="text-white" size={20} />
              </div>
              <span className="from-primary bg-linear-to-r to-orange-500 bg-clip-text text-xl font-bold text-transparent">
                REKO
              </span>
            </div>

            {/* Menu Button */}
            <div className="flex items-center space-x-2">
              {!DISABLE_TOGGLE && <AnimatedThemeToggler />}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </header>

        {/* Menu Mobile Overlay */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Menu Mobile */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isMenuOpen ? 0 : "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-16 right-0 bottom-0 z-50 w-80 bg-white shadow-xl"
        >
          <div className="space-y-4 p-6">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
              Navigation
            </h2>

            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={item.active ? "default" : "ghost"}
                  onClick={() => handleNavigation(item.href)}
                  className={`h-12 w-full justify-start gap-3 ${
                    item.active
                      ? "from-primary bg-linear-to-r to-orange-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-orange-500 text-white"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}

            {/* Statistiques */}
            <div className="mt-8 space-y-3 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-700">
                Statistiques
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="text-primary text-lg font-semibold">
                    {watchlist.length}
                  </div>
                  <div className="text-xs text-gray-600">À regarder</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="text-lg font-semibold text-orange-500">
                    {favorites.length}
                  </div>
                  <div className="text-xs text-gray-600">Favoris</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Bottom Navigation Mobile */}
      <nav className="fixed right-0 bottom-0 left-0 z-40 border-t border-gray-200 bg-white md:hidden">
        <div className="grid h-16 grid-cols-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`relative flex flex-col items-center justify-center space-y-1 ${
                  item.active
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </div>
                )}
                {item.active && (
                  <div className="from-primary absolute top-0 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-b-full bg-linear-to-r to-orange-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
