import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
    id: string;
    label: string;
    icon?: React.ElementType;
    leftContent?: React.ReactNode;
    description?: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    label,
    placeholder = 'Select an option',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.id === value);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-xs font-bold uppercase text-stone-500 mb-2">
                    {label}
                </label>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${isOpen
                        ? 'border-purple-500 ring-2 ring-purple-500/20'
                        : 'border-stone-200 dark:border-stone-700 hover:border-purple-400'
                    } bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 shadow-sm`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {selectedOption ? (
                        <>
                            {selectedOption.icon && (
                                <selectedOption.icon size={18} className="text-purple-500 shrink-0" />
                            )}
                            {selectedOption.leftContent && (
                                <div className="shrink-0">{selectedOption.leftContent}</div>
                            )}
                            <span className="truncate font-medium">
                                {selectedOption.label}
                            </span>
                        </>
                    ) : (
                        <span className="text-stone-400">{placeholder}</span>
                    )}
                </div>
                <ChevronDown
                    size={16}
                    className={`text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full left-0 right-0 mt-2 z-[60] bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xl max-h-64 overflow-y-auto custom-scrollbar"
                    >
                        <div className="p-2 space-y-1">
                            {options.map((option) => {
                                const isSelected = option.id === value;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            onChange(option.id);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${isSelected
                                                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                                : 'hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {option.icon && (
                                                <option.icon
                                                    size={18}
                                                    className={isSelected ? 'text-purple-500' : 'text-stone-400'}
                                                />
                                            )}
                                            {option.leftContent && (
                                                <div className="shrink-0">{option.leftContent}</div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium truncate">{option.label}</div>
                                                {option.description && (
                                                    <div className="text-[10px] opacity-70 truncate max-w-[200px]">
                                                        {option.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {isSelected && <Check size={14} className="text-purple-500 shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
