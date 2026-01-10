'use client';

import { Text, Group } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import { IconBrandTwitter, IconBrandLinkedin, IconBrandGithub } from '@tabler/icons-react';
import Link from 'next/link';

const Footer = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const footerSections = [
    {
      title: 'Solutions',
      links: [
        { label: 'Practice Management', href: '/solutions/practice' },
        { label: 'EHR', href: '/solutions/ehr' },
        { label: 'Telehealth', href: '/solutions/telehealth' },
        { label: 'Patient Engagement', href: '/solutions/engagement' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'API Status', href: '/status' },
        { label: 'Help Center', href: '/help' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'HIPAA Policy', href: '/hipaa' }
      ]
    }
  ];

  return (
    <footer className={`py-12 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} border-t`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
                <Text className="text-white font-bold text-sm">M</Text>
              </div>
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                MedFlow
              </Text>
            </div>
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed`}>
              Empowering healthcare providers with intelligent tools for better patient outcomes.
            </Text>
            <Group gap="sm" mt="md">
              <Link href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                <IconBrandTwitter size={20} />
              </Link>
              <Link href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                <IconBrandLinkedin size={20} />
              </Link>
              <Link href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                <IconBrandGithub size={20} />
              </Link>
            </Group>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <Text className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {section.title}
              </Text>
              <div className="space-y-3">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`block text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2024 MedFlow Inc. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;