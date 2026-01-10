'use client';

import { Button } from '@mantine/core';
import { IconLogin, IconUserPlus, IconSun, IconMoon } from '@tabler/icons-react';
import { useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  title?: string;
}
const navlink= [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Features',
    href: '/features',
  },
  {
    title: 'Solutions',
    href: '/solutions',
  },
  {
    title: 'Pricing',
    href: '/pricing',
  },

]

export function Header({ title = "MedFlow" }: HeaderProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const pathname = usePathname();
  
  return (
    <header className={`shadow-sm top-0 z-50 sticky ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <a href="/">
            <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
          </a>
          <nav className="flex gap-2">
            {
              navlink.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Button 
                    key={index}
                    variant='subtle' 
                    component={Link} 
                    href={link.href}
                    styles={{
                      root: {
                        color: isActive ? '#3b82f6' : (isDark ? '#e5e7eb' : '#374151'),
                        fontWeight: isActive ? 600 : 400,
                        '&:hover': {
                          backgroundColor: '#3b82f6',
                          color: '#ffffff'
                        }
                      }
                    }}
                  >
                    {link.title}
                  </Button>
                );
              })
            }
          </nav>
          <div className="flex gap-3 items-center">
            <Button 
              variant="subtle"
              onClick={() => toggleColorScheme()}
              styles={{
                root: {
                  color: isDark ? '#e5e7eb' : '#374151',
                  '&:hover': {
                    backgroundColor: isDark ? '#374151' : '#f3f4f6'
                  }
                }
              }}
            >
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </Button>
            <Button 
              component={Link} 
              href="/login" 
              variant="outline" 
              leftSection={<IconLogin size={16} />}
              styles={{
                root: {
                  borderColor: isDark ? '#6b7280' : '#d1d5db',
                  color: isDark ? '#e5e7eb' : '#374151',
                  '&:hover': {
                    backgroundColor: isDark ? '#374151' : '#f9fafb'
                  }
                }
              }}
            >
              Sign In
            </Button>
            <Button 
              component={Link} 
              href="/register" 
              variant="filled" 
              leftSection={<IconUserPlus size={16} />}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Register for Free
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}