"use client"
import { useState, useEffect } from "react"
import { PasswordInput, TextInput, Checkbox, Text, Title, Button, Paper, Select } from '@mantine/core';
import { IconLogin } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { UserRole } from '../../../types/types';
import { authService } from '../../../lib/auth';
import { navigateToDashboard } from '../../../lib/navigation';

const LoginPage = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
    userType: UserRole.PATIENT as string,
    tenantId: ""
  });

  const [err, setErr] = useState({
    email: "",
    password: "",
    tenantId: ""
  });

  // Load tenantId from URL params on mount
  useEffect(() => {
    const tenantIdParam = searchParams.get('tenantId');
    if (tenantIdParam) {
      setData(prev => ({ ...prev, tenantId: tenantIdParam }));
    }
  }, [searchParams]);

  const handleChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (err[field as keyof typeof err]) {
      setErr(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    let isValid = true;
    const newErr = { email: "", password: "", tenantId: "" };

    if (!data.email) {
      newErr.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      newErr.email = "Invalid email format";
      isValid = false;
    }

    if (!data.password) {
      newErr.password = "Password is required";
      isValid = false;
    }

    setErr(newErr);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      // Call API
      const response = await authService.login(
        data.email,
        data.password,
        data.userType as UserRole,
        data.tenantId
      );

      if (response.success) {
        authService.setUser(response.data.user);

        notifications.show({
          title: 'Login Successful',
          message: `Welcome back, ${response.data.user.name}!`,
          color: 'green',
        });

        setTimeout(() => {
          navigateToDashboard(response.data.user.role);
        }, 500);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";

      notifications.show({
        title: 'Login Failed',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 p-4 transition-colors duration-300 ease-in-out">

      <Paper className="w-full max-w-md p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out" withBorder>
        <Title order={2}>Welcome back</Title>
        <Text mb={20}>Enter your credentials to access the medical dashboard.</Text>
        <form onSubmit={handleLogin}>



          <TextInput
            my={10}
            label="Email Address"
            withAsterisk
            placeholder="name@hospital.com"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={err.email}
          />
          <PasswordInput
            my={10}
            label="Password"
            withAsterisk
            placeholder="********"
            value={data.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={err.password}
          />    <div className="flex text-center justify-between align-middle my-5">
            <Checkbox
              label="Remember me"
            />
            <a href="/forgot-password" style={{ color: 'var(--mantine-class-blue-3)' }}>Forgot password?</a>
          </div>

          <Button
            fullWidth
            color="blue"
            leftSection={<IconLogin size={16} />}
            type="submit"
            loading={loading}
          >
            Login to Dashboard
          </Button>
          <hr className="my-5" />
          <Text> New to MedFlow? <a
            href="/register" style={{ color: 'var(--mantine-class-blue-3)' }}>Register</a>
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

export default LoginPage