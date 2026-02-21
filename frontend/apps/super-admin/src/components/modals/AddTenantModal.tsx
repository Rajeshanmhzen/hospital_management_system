import { Modal, TextInput, Select, PasswordInput, Button, Stack, Group, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import api from '../../utils/api';

interface AddTenantModalProps {
    opened: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function AddTenantModal({ opened, onClose, onSuccess }: AddTenantModalProps) {
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState<{ value: string; label: string }[]>([]);

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
    }, [opened]);

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

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            await api.post('/super-admin/tenants/add', values);
            notifications.show({ title: 'Success', message: 'Tenant created successfully', color: 'green' });
            if (onSuccess) onSuccess();
            form.reset();
            onClose();
        } catch (error: any) {
            notifications.show({ title: 'Error', message: error.response?.data?.message || 'Failed to create tenant', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Add New Tenant"
            centered
            size="lg"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            {/* LoadingOverlay removed */}
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
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
                    <PasswordInput label="Password" placeholder="Strong password" required {...form.getInputProps('password')} />

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
                        <Button variant="default" onClick={onClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" disabled={loading} leftSection={loading && <Loader size="xs" />}>
                            {loading ? 'Creating...' : 'Create Tenant'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
