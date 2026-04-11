import { Modal, TextInput, Select, PasswordInput, Button, Stack, Group, Loader, Alert, Progress, Text, Badge, ActionIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import api from '../../utils/api';
import { IconInfoCircle, IconWand } from '@tabler/icons-react';

interface AddTenantModalProps {
    opened: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function AddTenantModal({ opened, onClose, onSuccess }: AddTenantModalProps) {
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState<{ value: string; label: string }[]>([]);
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobState, setJobState] = useState<string | null>(null);
    const [progressPercent, setProgressPercent] = useState(0);
    const [progressStage, setProgressStage] = useState<string>('Waiting to start');
    const pollingRef = useRef<number | null>(null);

    const form = useForm({
        initialValues: {
            name: '',
            subdomain: '',
            ownerName: '',
            ownerEmail: '',
            password: '',
            planId: '',
            billingCycle: 'MONTHLY'
        },
        validate: {
            name: (val: any) => (val.length < 2 ? 'Name is too short' : null),
            subdomain: (val: any) => (/^[a-z0-9-]+$/.test(val) ? null : 'Invalid subdomain (lowercase, numbers, hyphens only)'),
            ownerEmail: (val: any) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val: any) => (val.length < 6 ? 'Password must be at least 6 characters' : null),
        },
    });

    useEffect(() => {
        if (opened) {
            fetchPlans();
        }

        if (!opened && pollingRef.current) {
            window.clearInterval(pollingRef.current);
            pollingRef.current = null;
        }

        return () => {
            if (pollingRef.current) {
                window.clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [opened]);

    const resetJobState = () => {
        setJobId(null);
        setJobState(null);
        setProgressPercent(0);
        setProgressStage('Waiting to start');
        if (pollingRef.current) {
            window.clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    };

    const pollJobStatus = (newJobId: string) => {
        if (pollingRef.current) {
            window.clearInterval(pollingRef.current);
        }

        pollingRef.current = window.setInterval(async () => {
            try {
                const res = await api.get(`/super-admin/jobs/${newJobId}`);
                const job = res?.data?.data;
                if (!job) return;

                const progress = job.progress || {};
                setJobState(job.state || null);
                setProgressPercent(typeof progress.percent === 'number' ? progress.percent : 0);
                setProgressStage(progress.stage || job.state || 'Processing');

                if (job.state === 'completed') {
                    if (pollingRef.current) {
                        window.clearInterval(pollingRef.current);
                        pollingRef.current = null;
                    }
                    setLoading(false);
                    notifications.show({
                        title: 'Tenant Ready',
                        message: 'Tenant database and admin account created successfully',
                        color: 'green'
                    });
                    if (onSuccess) onSuccess();
                    form.reset();
                    resetJobState();
                    onClose();
                }

                if (job.state === 'failed') {
                    if (pollingRef.current) {
                        window.clearInterval(pollingRef.current);
                        pollingRef.current = null;
                    }
                    setLoading(false);
                    notifications.show({
                        title: 'Provisioning Failed',
                        message: job.failedReason || 'Tenant provisioning failed',
                        color: 'red'
                    });
                }
            } catch (error) {
                // Keep polling; transient network/API errors can happen.
            }
        }, 1500);
    };

    const fetchPlans = async () => {
        try {
            // Using admin list to see all plans
            const res = await api.get('/pricing-plans/admin/list');
            // Backend returns plain array OR { data: [] } structure. Handle both.
            let plansList = [];
            if (Array.isArray(res.data)) {
                plansList = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                plansList = res.data.data;
            }

            if (plansList.length > 0) {
                setPlans(plansList.map((p: any) => ({
                    value: p.id,
                    label: p.name
                })));
            }
        } catch (error) {
            console.error('Failed to fetch plans', error);
            // Fallback to public list if admin fails
            try {
                const res = await api.get('/pricing-plans/list');
                let plansList = [];
                if (Array.isArray(res.data)) {
                    plansList = res.data;
                } else if (res.data && Array.isArray(res.data.data)) {
                    plansList = res.data.data;
                }

                if (plansList.length > 0) {
                    setPlans(plansList.map((p: any) => ({
                        value: p.id,
                        label: `${p.name}`
                    })));
                }
            } catch (e) { }
        }
    };

    const generate14DigitsPassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
        let password = '';
        for (let i = 0; i < 14; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        resetJobState();
        try {
            const response = await api.post('/super-admin/tenants/add', values);
            const data = response?.data?.data;

            if (data?.jobId) {
                setJobId(data.jobId);
                setJobState('waiting');
                setProgressPercent(3);
                setProgressStage('Tenant provisioning queued');
                notifications.show({ title: 'Started', message: 'Tenant provisioning started', color: 'blue' });
                pollJobStatus(data.jobId);
            } else {
                notifications.show({ title: 'Success', message: 'Tenant created successfully', color: 'green' });
                if (onSuccess) onSuccess();
                form.reset();
                onClose();
            }
        } catch (error: any) {
            notifications.show({ title: 'Error', message: error.response?.data?.message || 'Failed to create tenant', color: 'red' });
            resetJobState();
            setLoading(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Add New Tenant"
            centered
            size="xl"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            {/* LoadingOverlay removed */}
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    {jobId && (
                        <Alert variant="light" color={jobState === 'failed' ? 'red' : 'blue'} icon={<IconInfoCircle size={16} />}>
                            <Group justify="space-between" mb="xs">
                                <Text size="sm" fw={600}>Provisioning Status</Text>
                                <Badge variant="light">{jobState || 'waiting'}</Badge>
                            </Group>
                            <Text size="xs" c="dimmed" mb={6}>Job ID: {jobId}</Text>
                            <Text size="sm" mb={8}>{progressStage}</Text>
                            <Progress value={progressPercent} animated={jobState !== 'completed' && jobState !== 'failed'} />
                        </Alert>
                    )}

                    <TextInput label="Hospital/Clinic Name" placeholder="City Hospital" required {...form.getInputProps('name')} />
                    <TextInput
                        label="Subdomain"
                        placeholder="city-hospital"
                        description="This will be used for the tenant URL (e.g., city-hospital.medflow.com)"
                        required
                        {...form.getInputProps('subdomain')}
                    />
                    <TextInput label="Owner Name" placeholder="John Doe" required {...form.getInputProps('ownerName')} />
                    <TextInput label="Owner Email" placeholder="john@example.com" required {...form.getInputProps('ownerEmail')} />
                    <Group align="end" wrap="nowrap" gap="sm">
                        <PasswordInput
                            label="Password"
                            placeholder="Strong password"
                            required
                            style={{ flex: 1 }}
                            {...form.getInputProps('password')}
                        />
                        <ActionIcon
                            size={42}
                            radius="sm"
                            color="blue"
                            variant="filled"
                            mb={1}
                            onClick={() => form.setFieldValue('password', generate14DigitsPassword())}
                            aria-label="Generate password"
                        >
                            <IconWand size={18} />
                        </ActionIcon>
                    </Group>


                    <Select
                        label="Subscription Plan"
                        placeholder="Select a plan"
                        data={plans}
                        clearable
                        {...form.getInputProps('planId')}
                    />
                    <Select
                        label="Billing Cycle"
                        data={['MONTHLY', 'YEARLY']}
                        {...form.getInputProps('billingCycle')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button
                            variant="default"
                            onClick={() => {
                                resetJobState();
                                onClose();
                            }}
                            disabled={loading && !jobId}
                        >
                            {loading && jobId ? 'Close' : 'Cancel'}
                        </Button>
                        <Button type="submit" disabled={loading} leftSection={loading && <Loader size="xs" />}>
                            {loading ? (jobId ? 'Provisioning...' : 'Creating...') : 'Create Tenant'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
