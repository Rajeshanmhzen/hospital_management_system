import { useEffect, useState } from 'react';
import {
    Grid,
    Container,
    Title,
    Text,
    Paper,
    Stack,
    useMantineTheme,
    SimpleGrid,
    Box,
    useMantineColorScheme,
    Skeleton
} from '@mantine/core';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { StatsCard } from '../components/ui/StatsCard';
import api from '../utils/api';

interface DashboardData {
    stats: {
        totalTenants: number;
        activeTenants: number;
        pendingTenants: number;
        revenueGrowth: number;
        totalTenantsChange: number;
        activeTenantsChange: number;
        pendingTenantsChange: number;
        revenueGrowthChange: number;
        totalTenantsTrend: { value: number }[];
        activeTenantsTrend: { value: number }[];
        pendingTenantsTrend: { value: number }[];
        revenueTrend: { value: number }[];
    };
    charts: {
        barChartData: any[];
        areaChartData: any[];
    };
}

const Dashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/super-admin/stats');
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Container size="xl" py="xl">
                <Stack gap="xl">
                    <Box>
                        <Skeleton height={40} width={300} mb="xs" radius="sm" />
                        <Skeleton height={20} width={400} radius="sm" />
                    </Box>

                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} height={120} radius="md" />
                        ))}
                    </SimpleGrid>

                    <Grid gutter="lg">
                        <Grid.Col span={{ base: 12, md: 8 }}>
                            <Skeleton height={450} radius="lg" />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Skeleton height={450} radius="lg" />
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Container>
        );
    }

    const stats = data?.stats;
    const charts = data?.charts;

    const chartColors = {
        grid: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
        text: isDark ? theme.colors.dark[1] : theme.colors.gray[7],
        tooltipBg: isDark ? theme.colors.dark[6] : theme.white,
        tooltipBorder: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
        tooltipText: isDark ? theme.colors.gray[0] : theme.colors.gray[9]
    };

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <Box>
                    <Title order={1} fw={800} style={{ letterSpacing: '-0.5px' }} c={isDark ? 'white' : 'dark'}>
                        Dashboard Overview
                    </Title>
                    <Text c="dimmed" size="md" fw={500}>Monitor your SaaS ecosystem performance at a glance.</Text>
                </Box>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                    <StatsCard
                        title="Total Tenants"
                        value={stats?.totalTenants.toString() || '0'}
                        diff={stats?.totalTenantsChange || 0}
                        data={stats?.totalTenantsTrend || []}
                        color="blue"
                    />
                    <StatsCard
                        title="Active Tenants"
                        value={stats?.activeTenants.toString() || '0'}
                        diff={stats?.activeTenantsChange || 0}
                        data={stats?.activeTenantsTrend || []}
                        color="teal"
                    />
                    <StatsCard
                        title="Pending Approval"
                        value={stats?.pendingTenants.toString() || '0'}
                        diff={stats?.pendingTenantsChange || 0}
                        data={stats?.pendingTenantsTrend || []}
                        color="orange"
                    />
                    <StatsCard
                        title="Revenue Growth"
                        value={`$${stats?.revenueGrowth.toLocaleString() || '0'}`}
                        diff={stats?.revenueGrowthChange || 0}
                        data={stats?.revenueTrend || []}
                        color="indigo"
                    />
                </SimpleGrid>

                <Grid gutter="lg">
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Paper withBorder p="xl" radius="lg" shadow="sm" h={450}>
                            <Title order={4} mb="xl" fw={700}>Revenue Growth (Last 6 Months)</Title>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart data={charts?.areaChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.colors.blue[6]} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={theme.colors.blue[6]} stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorEnterprise" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.colors.indigo[6]} stopOpacity={0.2} />
                                            <stop offset="95%" stopColor={theme.colors.indigo[6]} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                                    <XAxis
                                        dataKey="name"
                                        fontSize={13}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: chartColors.text }}
                                        dy={10}
                                    />
                                    <YAxis
                                        fontSize={13}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: chartColors.text }}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: chartColors.tooltipBg,
                                            borderColor: chartColors.tooltipBorder,
                                            borderRadius: '12px',
                                            boxShadow: theme.shadows.lg,
                                            color: chartColors.tooltipText
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke={theme.colors.blue[6]}
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                        name="Total Revenue"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="enterprise"
                                        stroke={theme.colors.indigo[6]}
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorEnterprise)"
                                        name="Enterprise"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Paper withBorder p="xl" radius="lg" shadow="sm" h={450}>
                            <Title order={4} mb="xl" fw={700}>Plan Distribution</Title>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={charts?.barChartData} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={chartColors.grid} />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        fontSize={13}
                                        tickLine={false}
                                        axisLine={false}
                                        width={80}
                                        tick={{ fill: chartColors.text }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: chartColors.tooltipBg,
                                            borderColor: chartColors.tooltipBorder,
                                            borderRadius: '12px',
                                            boxShadow: theme.shadows.lg,
                                            color: chartColors.tooltipText
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        height={36}
                                        wrapperStyle={{ color: chartColors.text }}
                                    />
                                    <Bar dataKey="basic" stackId="a" fill={theme.colors.blue[6]} radius={[0, 0, 0, 0]} barSize={20} name="Basic" />
                                    <Bar dataKey="standard" stackId="a" fill={theme.colors.indigo[6]} radius={[0, 0, 0, 0]} barSize={20} name="Standard" />
                                    <Bar dataKey="enterprise" stackId="a" fill={theme.colors.teal[6]} radius={[0, 6, 6, 0]} barSize={20} name="Enterprise" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Container>
    );
};

export default Dashboard;
