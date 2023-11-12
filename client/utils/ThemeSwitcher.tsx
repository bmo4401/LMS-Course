'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { BiMoon, BiSun } from 'react-icons/bi';
type Theme = 'dark' | 'light' | 'system';
const ThemeSwitcher = () => {
  const [isMounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <div className="flex items-center justify-center mx-4">
      {theme === 'light' ? (
        <BiMoon
          className="cursor-pointer"
          fill="back"
          size={25}
          onClick={() => setTheme('dark')}
        />
      ) : (
        <BiSun
          className="cursor-pointer"
          fill="white"
          size={25}
          onClick={() => setTheme('light')}
        />
      )}
    </div>
  );
};
export default ThemeSwitcher;
