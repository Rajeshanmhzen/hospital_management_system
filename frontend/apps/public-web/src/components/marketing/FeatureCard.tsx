'use client';

import { Title } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import React from 'react';

interface FeatureCardProps{
    icons:React.ReactNode;
    title:string;
    description:string;
    iconsColor?:string;
};

export function FeatureCard({icons, title, description, iconsColor}:FeatureCardProps) {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    
    const getIconColors = (color: string) => {
        const colors = {
            blue: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600',
            green: isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600',
            purple: isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600',
            orange: isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600'
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };
    
    return(
        <div className={`p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                getIconColors(iconsColor || 'blue')
            }`}>
                {icons}
            </div>
            <Title order={4} className={`mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</Title>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
        </div>
    )
};
