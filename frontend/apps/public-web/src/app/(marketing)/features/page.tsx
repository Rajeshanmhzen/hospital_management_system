'use client'
import Badge from 'components/common/badge'
import { IconCalendarWeek, IconCircleFilled, IconFileInvoiceFilled, IconUserFilled, IconUsersGroup } from '@tabler/icons-react'
import { FaPrescriptionBottleMedical } from "react-icons/fa6";
import { MdOutlineBarChart } from "react-icons/md";
import { Button, Title, useMantineColorScheme } from '@mantine/core'
import { FeatureCard } from 'components/marketing/FeatureCard'
import Container from 'components/layout/container';


const featureContent = [
  {icons: <IconUserFilled size={24} /> , title:"Patient Management", description:"Digital health records and patient history tracking. Access comprehensive data instantly for better diagnosis.", iconsColor:"blue"},
  {icons: <IconCalendarWeek size={24} /> , title:"Appointment Scheduling", description:"Easy booking system for doctors and patients. Reduce no-shows with automated SMS and email reminders.", iconsColor:"green"},
  {icons: <IconUsersGroup size={24} /> , title:"Doctor &amp; Staff Management", description:"Shift planning and payroll integration. Optimize workforce allocation and manage permissions securely.", iconsColor:"purple"},
  {icons: <IconFileInvoiceFilled size={24} /> , title:"Billing &amp; Invoicing", description:" Automated insurance claims and patient billing. Generate compliant invoices and track payments in real-time.", iconsColor:"orange"},
  {icons: <MdOutlineBarChart  size={24} /> , title:"Reports &amp; Analytics", description:" Real-time insights into hospital performance. Visualize data with interactive dashboards and exportable reports.", iconsColor:"purple"},
  {icons: <FaPrescriptionBottleMedical  size={24} /> , title:"Pharmacy Integration", description:" Inventory tracking and prescription management. Automatically alert when stock is low and manage expirations.", iconsColor:"orange"},
]
const page = () => {
  const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
  return (
    <Container className=' min-h-screen py-10'>
      <div  className='max-w-3xl mx-auto text-center mb-16'>
      <div className='flex justify-center mb-5'>
        <Badge icon={<IconCircleFilled size={8} className="text-blue-700" />} text="NEW FEATURE AVAILABLE" bgColor="bg-blue-300" textColor="text-blue-700" borderRaduis="rounded-full" />
        </div>
          <Title order={2} className={`text-[48px] font-extrabold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Everything you need to <span>run your hospital</span></Title>
          <p className='text-shadow-slate-700 my-5'>Comprehensive tools designed for modern healthcare facilities. Streamline operations, improve patient care, and manage staff with our integrated platform.</p>
          <div className='flex  justify-center items-center gap-5'>
            <Button >View All Features</Button>
            <Button>Contact Sale</Button>
          </div>
      </div>

      {/* feature section */}

      <div className=" mt-15 grid sm:grid-cols-2  lg:grid-cols-3 gap-6">
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
    </Container>
  )
}

export default page
