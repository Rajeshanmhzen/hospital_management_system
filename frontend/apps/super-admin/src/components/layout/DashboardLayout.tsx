import { Box } from '@mantine/core';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

export function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000000' }}>
            <Sidebar collapsed={collapsed} />
            <main style={{
                flex: 1,
                marginLeft: collapsed ? '80px' : '280px',
                padding: '0',
                transition: 'margin-left 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Header onToggle={() => setCollapsed(!collapsed)} />

                <Box p="24px" style={{ flex: 1 }}>
                    <Outlet />
                </Box>
            </main>
        </div>
    );
}
