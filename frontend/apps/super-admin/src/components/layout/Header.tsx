import { Group, ActionIcon, Button, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconBell, IconPlus, IconLayoutSidebar, IconSun, IconMoon } from '@tabler/icons-react';
import Breadcrum from '../ui/Breadcrum';
import { useDisclosure } from '@mantine/hooks';
import { AddTenantModal } from '../modals/AddTenantModal';

interface HeaderProps {
    onToggle: () => void;
}

export function Header({ onToggle }: HeaderProps) {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <header style={{
            padding: '16px 24px',
            backgroundColor: 'var(--mantine-color-body)',
            borderBottom: '1px solid var(--mantine-color-default-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 90,
        }}>
            <Group gap="md">
                <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={onToggle}
                    size="lg"
                >
                    <IconLayoutSidebar size={20} />
                </ActionIcon>

                <Breadcrum />
            </Group>

            <Group gap="md">
                <ActionIcon
                    onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                    variant="subtle"
                    color="gray"
                    size="lg"
                    aria-label="Toggle color scheme"
                >
                    {computedColorScheme === 'light' ? (
                        <IconMoon size={20} stroke={1.5} />
                    ) : (
                        <IconSun size={20} stroke={1.5} />
                    )}
                </ActionIcon>

                <ActionIcon variant="subtle" color="gray" size="lg">
                    <IconBell size={20} />
                </ActionIcon>
                <Button
                    leftSection={<IconPlus size={16} />}
                    variant="filled"
                    radius="md"
                    size="sm"
                    onClick={open}
                >
                    Add Tenant
                </Button>
            </Group>

            <AddTenantModal opened={opened} onClose={close} onSuccess={() => {
                // Optionally reload tenants list if we have access to context context, 
                // but usually the page will refresh or the user will navigate.
                // For now just close.
                close();
            }} />
        </header>
    );
}
