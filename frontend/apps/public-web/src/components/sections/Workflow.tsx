"use client";

import { Badge, Button, Title, useMantineColorScheme } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const workflowcontent = [
    { title: "Fast Load Times" },
    { title: "Mobile Ready" },
    { title: "Intutive UX" },
];

const Workflow = () => {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";
    const pathname = usePathname();
    const isActive = pathname === '/features';

    return (
        <section className={`py-16 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <Title
                            order={2}
                            className={`mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                            A view into your future workflow
                        </Title>
                        <p
                            className={`max-w-2xl ${isDark ? "text-gray-300" : "text-gray-600"
                                }`}
                        >
                            Experience an interface designed for speed and clarity. Every
                            pixel is crafted to reduce clicks and save time for your medical
                            staff.
                        </p>

                        <div className="mt-6">
                            {workflowcontent.map((item, index) => (
                                <Badge
                                    key={index}
                                    size="md"
                                    radius="xl"
                                    className={`mr-2 mb-2 ${
                                        isDark 
                                            ? 'bg-cyan-900/30 text-cyan-300' 
                                            : 'bg-cyan-50 text-cyan-600'
                                    }`}
                                >
                                    ● {item.title}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <Button
                        variant='subtle'
                        component={Link}
                        rightSection={<IconArrowRight size={16} />}
                        href="/features"
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
                        Explore all feature
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[500px]">
                    {/* Large Item */}
                    <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 group">
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                            style={{ backgroundImage: "url('/images/laptop_with_tea.png')" }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-white text-xl font-bold">Electronic Health Records</h3>
                            <p className="text-gray-200 text-sm mt-1">Access patient history in seconds.</p>
                        </div>
                    </div>
                    
                    {/* Small Item 1 */}
                    <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 group min-h-[240px]">
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                            style={{ backgroundImage: "url('/images/doctor.png')" }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white text-lg font-bold">Mobile Rounds</h3>
                        </div>
                    </div>
                    
                    {/* Small Item 2 */}
                    <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 group min-h-[240px]">
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                            style={{ backgroundImage: "url('/images/room.png')" }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white text-lg font-bold">Reception Management</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Workflow;
