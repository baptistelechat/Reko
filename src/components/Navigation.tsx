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
import { usePathname, useRouter } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";

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
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              <div className="w-8 h-8 bg-linear-to-r from-primary to-orange-500 rounded-lg flex items-center justify-center">
                <Film className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent">
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
                        ? "bg-linear-to-r from-primary to-orange-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden lg:block">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 bg-orange-500 text-white text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      {/* Navigation Mobile */}
      <div className="md:hidden">
        {/* Header Mobile */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              <div className="w-8 h-8 bg-linear-to-r from-primary to-orange-500 rounded-lg flex items-center justify-center">
                <Film className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                REKO
              </span>
            </div>

            {/* Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
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
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Navigation
            </h2>

            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={item.active ? "default" : "ghost"}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full justify-start gap-3 h-12 ${
                    item.active
                      ? "bg-linear-to-r from-primary to-orange-500 text-white"
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
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
              <h3 className="text-sm font-medium text-gray-700">
                Statistiques
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-primary">
                    {watchlist.length}
                  </div>
                  <div className="text-xs text-gray-600">À regarder</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 h-16">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`flex flex-col items-center justify-center space-y-1 relative ${
                  item.active
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge > 99 ? "99+" : item.badge}
                  </div>
                )}
                {item.active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-linear-to-r from-primary to-orange-500 rounded-b-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
      {/* Spacer pour le contenu */}
      <div className="h-16 md:h-16" />
      <div className="h-16 md:h-0" /> {/* Bottom nav spacer mobile only */}
    </>
  );
}
