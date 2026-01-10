"use client"
import { useState } from "react"
import { PasswordInput,TextInput,Checkbox,Text,Title, Button, Paper } from '@mantine/core';
import { IconLogin } from '@tabler/icons-react';

const page = () => {
    const [data,setData] = useState({
        email:"",
        password:""
    })
    const [err,setErr] = useState({
        email:"",
        password:""
    })
    
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 p-4 transition-colors duration-300 ease-in-out">
      
      <Paper className="w-full max-w-md p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out" withBorder>
        <Title order={2}>Welcome back</Title>
        <Text mb={20}>Enter your crendentilas to access the medical dashboard.</Text>
        <form>
            <TextInput
            my={10}
      label="Email Address"
      withAsterisk
      placeholder="name@hospital.com"
    />
            <PasswordInput
            my={10}
      label="Password"
      withAsterisk
      placeholder="********"
    />

    <div className="flex text-center justify-between align-middle my-5">
         <Checkbox
      label="Remember me"
    />
    <a  href="/forgot-password" style={{ color: 'var(--mantine-color-blue-3)' }}>Forgot password?</a>
    </div>
          <Button 
            fullWidth 
            color="blue" 
            leftSection={<IconLogin size={16} />}
          >
            Login to Dashboard
          </Button>
          <hr className="my-5"/>
    <Text> New to MedFlow? <a
        href="/register" style={{ color: 'var(--mantine-color-blue-3)' }}>Register</a>
    </Text>
        </form>
      </Paper>
      

      <div className="w-full max-w-md">
        <Paper className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out" >
            <div className="w-full h-64">
                <img src="/images/labotory.png" alt="Laboratory" className="w-full h-full object-cover" />
            </div>
            
          <Paper withBorder p={15}>
              <Title order={3} className="mb-3">
                  Secure Patient Management
              </Title>
              <Text c="dimmed" className="mb-6">Our industry-leading encryption ensures all medical records and patient data remain confidential and secure at all times.</Text>
          </Paper>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <Paper className="p-4 rounded-lg transition-all duration-300 ease-in-out hover:shadow-md" withBorder>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <Text size="sm" fw={600} className="mb-1">HIPAA Compliant</Text>
                  <Text size="xs" c="dimmed">Full regulatory adherence.</Text>
                </Paper>
                
                <Paper className="p-4 rounded-lg transition-all duration-300 ease-in-out hover:shadow-md" withBorder>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <Text size="sm" fw={600} className="mb-1">Real-time Sync</Text>
                  <Text size="xs" c="dimmed">Instant data updates.</Text>
                </Paper>
              </div>
            
        </Paper>
      </div>
    </div>
  )
}

export default page