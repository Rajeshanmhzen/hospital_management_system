import { Paper, Text, Group, Box, useMantineTheme, rem } from '@mantine/core';
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
        <Paper withBorder p="md" radius="lg" style={{
            flex: 1,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
        }} className="stats-card">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                {title}
            </Text>

            <Group align="flex-end" gap="xs" mt={4}>
                <Text fw={800} size="xl" style={{ fontSize: rem(28), lineHeight: 1.2 }}>{value}</Text>
                <Group gap={2} mb={4}>
                    <Text c={diff > 0 ? 'teal' : 'red'} size="sm" fw={700}>
                        {diff > 0 ? '+' : ''}{diff}%
                    </Text>
                    <DiffIcon size={16} stroke={2.5} color={diff > 0 ? theme.colors.teal[6] : theme.colors.red[6]} />
                </Group>
            </Group>

            <Box h={45} mt="md">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.colors[color][6]} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={theme.colors[color][6]} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={theme.colors[color][6]}
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill={`url(#gradient-${title})`}
                            isAnimationActive={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}
