import { Link, useLocation } from 'react-router-dom';
import {
    Group,
    Box,
    Text,
    UnstyledButton,
    Stack,
    Avatar,
    ThemeIcon
} from '@mantine/core';
import {
    IconLayoutDashboard,
    IconUsers,
    IconReceipt2,
    IconSettings,
    IconDatabase,
    IconLogout,
    IconStethoscope
} from '@tabler/icons-react';
import classes from './Sidebar.module.css';
import api from '../../utils/api';

const data = [
    { link: '/', label: 'Dashboard', icon: IconLayoutDashboard },
    { link: '/tenants', label: 'Tenants', icon: IconUsers },
    { link: '/billings', label: 'Billings', icon: IconReceipt2 },
    { link: '/settings', label: 'Settings', icon: IconSettings },
    { link: '/logs', label: 'Logs', icon: IconDatabase },
];

interface SidebarProps {
    collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
    const location = useLocation();

    const links = data.map((item) => (
        <UnstyledButton
            component={Link}
            to={item.link}
            className={classes.link}
            data-active={item.link === location.pathname || undefined}
            key={item.label}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            {!collapsed && <span>{item.label}</span>}
        </UnstyledButton>
    ));

    const handleLogout = async () => {
        try {
            // Attempt to call backend logout
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            // Clear local storage and redirect
            localStorage.removeItem('token');
            // Redirect to public login or reload. 
            // Assuming public web handles auth or there's a login redirect.
            window.location.href = '/login';
        }
    };

    return (
        <nav className={classes.navbar} data-collapsed={collapsed || undefined}>
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify="flex-start" px="md">
                    <ThemeIcon size="lg" radius="md" color="white" variant="filled">
                        <IconStethoscope size={20} color="black" />
                    </ThemeIcon>
                    {!collapsed && (
                        <Text fw={700} size="lg" c="white" style={{ letterSpacing: '1px' }}>
                            Med<span style={{ color: '#228be6' }}>Flow</span>
                        </Text>
                    )}
                </Group>

                <Box px="md" mt="xl">
                    {!collapsed && (
                        <Text size="xs" fw={500} c="dimmed" mb="md" tt="capitalize">
                            Main-menu
                        </Text>
                    )}
                    <Stack gap={4}>
                        {links}
                    </Stack>
                </Box>
            </div>

            <div className={classes.footer} style={{ border: 'none' }}>
                <Box className={classes.userCard} mx="md" mb="md">
                    <Group justify={collapsed ? 'center' : 'flex-start'} wrap="nowrap" style={{ cursor: 'pointer' }}>
                        <Avatar src={null} alt="Super Admin" color="gray" radius="md" />
                        {!collapsed && (
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <Text size="sm" fw={500} c="white" truncate>Super Admin</Text>
                                <Text size="xs" c="dimmed" truncate>Superadmin account</Text>
                            </div>
                        )}
                    </Group>
                    <UnstyledButton
                        className={`${classes.link} ${classes.logout}`}
                        mt="md"
                        onClick={handleLogout}
                    >
                        <IconLogout className={classes.linkIcon} stroke={1.5} />
                        {!collapsed && <span>Sign Out</span>}
                    </UnstyledButton>
                </Box>
            </div>
        </nav >
    );
}
