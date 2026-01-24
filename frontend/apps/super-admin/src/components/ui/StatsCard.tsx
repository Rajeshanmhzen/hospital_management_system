import { Paper, Text, Group, Box, useMantineTheme } from '@mantine/core';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

interface StatsCardProps {
    title: string;
    value: string;
    diff: number;
    data: { value: number }[];
    color?: string;
}

export function StatsCard({ title, value, diff, data, color = 'blue' }: StatsCardProps) {
    const theme = useMantineTheme();
    const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
        <Paper withBorder p="md" radius="lg" style={{ flex: 1 }}>
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                {title}
            </Text>

            <Group align="flex-end" gap="xs" mt={4}>
                <Text fw={700} size="xl" style={{ fontSize: rem(28) }}>{value}</Text>
                <Text c={diff > 0 ? 'teal' : 'red'} size="sm" fw={500} mb={4}>
                    <DiffIcon size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    <span>{diff}%</span>
                </Text>
            </Group>

            <Box h={40} mt="md">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.colors[color][6]} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={theme.colors[color][6]} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={theme.colors[color][6]}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#gradient-${title})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}

function rem(px: number) {
    return `${px / 16}rem`;
}
