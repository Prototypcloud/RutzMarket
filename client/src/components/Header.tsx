import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navigationItems } from "@/lib/data";
import { useCartStore } from "@/lib/cartStore";
import { motion, AnimatePresence } from "framer-motion";


export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  const Logo = () => (
    <Link href="/" className="flex-shrink-0 flex items-center">
      <motion.div 
        className="text-2xl font-bold text-forest cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        R<span className="text-sage">Ü</span>TZ
        <span className="text-xs text-gray-600 ml-2">🌿</span>
      </motion.div>
    </Link>
  );

  const Navigation = ({ mobile = false }) => (
    <nav className={mobile ? "flex flex-col space-y-4" : "hidden md:flex space-x-8"}>
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`text-gray-700 hover:text-forest transition-colors font-medium ${
            location === item.href ? "text-forest" : ""
          }`}
          onClick={() => mobile && setIsMobileMenuOpen(false)}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );

  const ActionButtons = ({ mobile = false }) => (
    <div className={`flex items-center ${mobile ? "space-x-6 justify-center" : "space-x-4"}`}>
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-600 hover:text-forest transition-colors"
        data-testid="search-button"
      >
        <Search className="h-5 w-5" />
      </Button>
      

      
      <Button
        variant="ghost"
        size="icon"
        onClick={openCart}
        className="text-gray-600 hover:text-forest transition-colors relative"
        data-testid="cart-button"
      >
        <ShoppingCart className="h-5 w-5" />
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -top-2 -right-2 bg-sage text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={openCart}
        className="text-gray-600 hover:text-forest transition-colors relative"
        data-testid="cart-button"
      >
        <ShoppingCart className="h-5 w-5" />
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -top-2 -right-2 bg-sage text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );

  return (
    <motion.header 
      className="bg-white shadow-lg sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          
          <Navigation />
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex">
              <ActionButtons />
            </div>
            
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-600 hover:text-forest transition-colors"
                  data-testid="mobile-menu-button"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <Logo />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-600 hover:text-forest"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <Navigation mobile />
                  
                  <div className="mt-8 pt-8 border-t">
                    <ActionButtons mobile />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="md:hidden">
              <ActionButtons />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
