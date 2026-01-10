'use client';

import { Button, Title, Text } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

const CTA = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <section className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className={`rounded-3xl p-12 text-center ${
          isDark 
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600' 
            : 'bg-gradient-to-r from-cyan-400 to-blue-500'
        }`}>
          <Title 
            order={2} 
            className="text-white text-3xl lg:text-4xl font-bold"
          >
            Ready to modernize your hospital?
          </Title>
          
          <Text 
            size="lg" 
            className="text-white/90 max-w-2xl "
            style={{margin: '0 auto'}}
            mt={10}
          >
            Join 500+ clinics that have reduced administrative overhead by 40% with MedFlow.
          </Text>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button 
              size="lg"
              component={Link}
              href="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
            >
              Get started today
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              component={Link}
              href="/contact"
              rightSection={<IconArrowRight size={16} />}
              styles={{
                root: {
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white'
                  }
                }
              }}
            >
              Contact sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;