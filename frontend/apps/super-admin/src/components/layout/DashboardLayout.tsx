import { Box } from '@mantine/core';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

export function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--mantine-color-body)' }}>
            <Sidebar collapsed={collapsed} />
            <main style={{
                flex: 1,
                marginLeft: collapsed ? '80px' : '280px',
                padding: '0',
                transition: 'margin-left 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--mantine-color-body)'
            }}>
                <Header onToggle={() => setCollapsed(!collapsed)} />

                <Box p="24px" style={{ flex: 1 }}>
                    <Outlet />
                </Box>
            </main>
        </div>
    );
}
