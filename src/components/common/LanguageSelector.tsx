import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageItem } from '../../i18n/languages';

interface LanguageSelectorProps {
  variant?: 'header' | 'footer';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { language, setLanguage, languages, currentLanguageItem } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!dropdownRef.current) return;
    const rect = dropdownRef.current.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const dropdownWidth = 256;
    const naturalLeft = rect.right - dropdownWidth;
    let shiftX = 0;
    if (naturalLeft < 12) {
      shiftX = 12 - naturalLeft;
    } else if (rect.right > screenWidth - 12) {
      shiftX = (screenWidth - 12) - rect.right;
    }

    setDropdownStyle({
      transform: shiftX !== 0 ? `translateX(${shiftX}px)` : undefined,
    });
  };

  const toggleOpen = () => {
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      calculatePosition();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', calculatePosition);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isOpen]);

  const filteredLanguages = languages.filter((l: LanguageItem) => 
    l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        id={`language-selector-btn-${variant}`}
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Chọn ngôn ngữ (Đang chọn: ${currentLanguageItem.nativeName})`}
        className={`flex items-center gap-1.5 rounded-xl transition-all cursor-pointer select-none ${
          variant === 'header'
            ? 'px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700/70 hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs scale-95 origin-center'
            : 'px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-700/60'
        }`}
      >
        <span className="text-sm">{currentLanguageItem.flag}</span>
        <span className="hidden sm:inline font-medium">{currentLanguageItem.nativeName}</span>
        <span className="sm:hidden font-mono uppercase text-[11px]">{currentLanguageItem.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu (16 Major Languages) */}
      {isOpen && (
        <div 
          id="header-language-dropdown"
          role="listbox"
          style={dropdownStyle}
          className="absolute right-0 bottom-auto mt-2 w-64 max-w-[calc(100vw-1.5rem)] max-h-80 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header / Search input */}
          <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 language-search-header">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                id="language-search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`${languages.length} languages...`}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Languages List */}
          <div className="overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
            {filteredLanguages.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                {language === 'vi' ? 'Không tìm thấy ngôn ngữ' : 'No language found'}
              </div>
            ) : (
              filteredLanguages.map((langItem) => {
                const isSelected = langItem.code === language;
                return (
                  <button
                    key={langItem.code}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setLanguage(langItem.code as any);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`language-option-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'is-selected bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base shrink-0">{langItem.flag}</span>
                      <div className="text-left">
                        <div className="lang-native-name font-semibold leading-tight">{langItem.nativeName}</div>
                        <div className={`lang-sub-name text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                          {langItem.name}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer of Dropdown */}
          <div className="language-dropdown-footer px-3 py-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{languages.length} {language === 'vi' ? 'Ngôn ngữ' : 'Languages'}</span>
            <span className="font-mono">AC Studio i18n</span>
          </div>
        </div>
      )}
    </div>
  );
};
