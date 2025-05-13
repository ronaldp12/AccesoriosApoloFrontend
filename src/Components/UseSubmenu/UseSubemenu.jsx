import { useState, useRef, useEffect } from 'react';

export const useSubmenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const submenuRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 820);

  // Detectar clicks fuera del submenu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detectar cambio de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 820);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHover = (value) => {
    if (isDesktop) {
      setIsOpen(value);
    }
  };

  const handleClick = () => {
    if (!isDesktop) {
      setIsOpen(prev => !prev);
    }
  };

  const close = () => setIsOpen(false);

  return {
    isOpen,
    submenuRef,
    isDesktop,
    handleHover,
    handleClick,
    close,
  };
};
