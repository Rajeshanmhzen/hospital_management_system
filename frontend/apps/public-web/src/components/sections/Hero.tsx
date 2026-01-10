'use client';

import { Button, Badge, Title, Text } from '@mantine/core';
import { IconPlayerPlay } from '@tabler/icons-react';
import { useMantineColorScheme } from '@mantine/core';

export default function Hero() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <section className={isDark ? 'bg-gray-900' : 'bg-[#f9fbfd]'}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          <div>
            <Badge
              size="md"
              radius="xl"
              className="mb-6 bg-cyan-50 text-cyan-600"
            >
              ● New: AI-Powered Analytics 2.0
            </Badge>

            <Title className={`text-[48px] font-extrabold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Smart Hospital Management{' '}
              <span className="text-cyan-500">Made Simple</span>
            </Title>

            <Text className={`mt-6 max-w-xl text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Streamline operations with our all-in-one platform. Automate
              patient records, billing, and scheduling so you can focus on what
              matters most—patient care.
            </Text>

            <div className="flex gap-4 mt-8">
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 px-8"
              >
                Get Started
              </Button>

              <Button
                size="lg"
                variant="outline"
                leftSection={<IconPlayerPlay size={18} />}
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
                Request Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <span className="text-cyan-500 font-bold">✔</span>
                <Text size="sm" fw={500}>HIPAA Compliant</Text>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-yellow-400">★</span>
                <Text size="sm" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  4.9/5 from 500+ clinics
                </Text>
              </div>
            </div>
          </div>

            <div className=" relative overflow-hidden">
              <img
                src="/images/hero.png"
                alt="Dashboard"
                className="w-[500px] h-[400px] object-cover rounded-2xl"
              />
            
            {/* Floating Card */}
            <div className="absolute bottom-8 left-11 bg-white rounded-xl shadow-xl p-4 w-64">
              <div className="flex items-center justify-between mb-3">
                <Text fw={600} size="sm">Daily Appointments</Text>
                <Badge size="xs" className="bg-green-100 text-green-700">
                  On Track
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold">
                      JD
                    </div>
                    <Text size="sm" className="text-gray-600">09:00 AM</Text>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-semibold">
                      AS
                    </div>
                    <Text size="sm" className="text-gray-600">10:30 AM</Text>
                  </div>
                </div>
              </div>
            </div>
            </div>
        </div>
      </div>
    </section>
  );
}
