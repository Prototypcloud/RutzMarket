import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useTranslation, type Language } from "@/lib/i18n";

export function LanguageSelector() {
  const { currentLanguage, changeLanguage, languages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-sage/10"
        data-testid="language-selector-button"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <Globe className="w-4 h-4" />
        <span className="hidden md:inline">{currentLang?.code.toUpperCase()}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 z-50"
            >
              <Card className="w-48 shadow-lg border border-sage/20">
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {languages.map((language) => (
                      <Button
                        key={language.code}
                        variant={currentLanguage === language.code ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          changeLanguage(language.code);
                          setIsOpen(false);
                        }}
                        className="w-full justify-start space-x-3 h-10"
                        data-testid={`language-option-${language.code}`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">{language.nativeName}</span>
                          <span className="text-xs text-gray-500">{language.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}