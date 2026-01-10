'use client';

import React from 'react'
import { Text } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';

const TrustedBy = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
      <section className={`py-8 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container px-5 mx-auto">
          <div className="text-center mb-12">
            <Text className={`text-sm mb-8 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
              Trusted by leading healthcare institutions
            </Text>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            <div className={`flex items-center gap-2 text-xl font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <span className="material-symbols-outlined">cardiology</span> CardioCare
            </div>
            <div className={`flex items-center gap-2 text-xl font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <span className="material-symbols-outlined">dentistry</span> DentalPlus
            </div>
            <div className={`flex items-center gap-2 text-xl font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <span className="material-symbols-outlined">psychology</span> MindWell
            </div>
            <div className={`flex items-center gap-2 text-xl font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <span className="material-symbols-outlined">medication</span> PharmaLink
            </div>
            <div className={`flex items-center gap-2 text-xl font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <span className="material-symbols-outlined">emergency</span> RapidHealth
            </div>
          </div>
        </div>
      </section>
  )
}

export default TrustedBy