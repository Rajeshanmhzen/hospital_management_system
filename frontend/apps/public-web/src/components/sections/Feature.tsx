'use client';

import { Title } from "@mantine/core"
import { IconCreditCard, IconUser, IconCalendar, IconChartBar } from '@tabler/icons-react';
import { useMantineColorScheme } from '@mantine/core';
import { FeatureCard } from "components/marketing/FeatureCard";

const featureContent=[
    {icons: <IconCreditCard size={24} />, title:"Automated Billing", description:"Reduce erros and get paid faster with samrt invoicing and insurance claim processing.", iconsColor: "blue"},
    {icons: <IconUser size={24} />, title:"Patient Portal", description:"Secure access for patients to view records, lab resultsm and book appointments online.", iconsColor: "green"},
    {icons: <IconCalendar size={24} />, title:"Staff Scheduling", description:"Optimize shifts with AI assistance to prevent burnoit and ensure 24/7 coverage.", iconsColor: "purple"},
    {icons: <IconChartBar size={24} />, title:"Analytics & Reporting", description:"Real-time insights into hospital performance, patient flow, nad financial health.", iconsColor: "orange"},
];

const Feature = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <div className={`py-16 px-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <Title order={2} className={`mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Everything you need to run your hospital
                </Title>
                <p className={`max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Comprehensive tools designed for modern healthcare facilities. Our modular system grows with your practice</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               { 
               featureContent.map((feature, index)=>(
                    <FeatureCard
                        key={index}
                        icons={feature.icons}
                        title={feature.title}
                        description={feature.description}
                        iconsColor={feature.iconsColor}
                    />
                ))
                }
            </div>
        </div>
      
    </div>
  )
};

export default Feature
