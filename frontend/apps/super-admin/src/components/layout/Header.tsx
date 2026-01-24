import { Group, ActionIcon, Button } from '@mantine/core';
import { IconBell, IconPlus, IconLayoutSidebar } from '@tabler/icons-react';
import Breadcrum from '../ui/Breadcrum';

interface HeaderProps {
    onToggle: () => void;
}

export function Header({ onToggle }: HeaderProps) {
    return (
        <header style={{
            padding: '16px 24px',
            backgroundColor: '#000000',
            borderBottom: '1px solid #1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
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
                <ActionIcon variant="subtle" color="gray" size="lg">
                    <IconBell size={20} />
                </ActionIcon>
                <Button
                    leftSection={<IconPlus size={16} />}
                    variant="filled"
                    color="blue"
                    radius="md"
                    size="sm"
                >
                    Add Tenant
                </Button>
            </Group>
        </header>
    );
}
