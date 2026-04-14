import { useState } from "react";
import {
    Button,
    Group,
    Loader,
    Modal,
    NumberInput,
    Stack,
    Switch,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import api from "../../utils/api";

interface AddPricingPlanModalProps {
    opened: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function AddPricingPlanModal({ opened, onClose, onSuccess }: AddPricingPlanModalProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            name: "",
            description: "",
            monthlyPrice: 0,
            yearlyPrice: 0,
            maxUsers: 10,
            maxPatients: 100,
            featuresText: "",
            isActive: true,
            isPublic: true,
            displayOrder: 0,
        },
        validate: {
            name: (value) => (value.trim().length < 2 ? "Plan name is required" : null),
            description: (value) => (value.trim().length < 5 ? "Description is required" : null),
            monthlyPrice: (value) => (value <= 0 ? "Monthly price must be greater than 0" : null),
            yearlyPrice: (value) => (value <= 0 ? "Yearly price must be greater than 0" : null),
            maxUsers: (value) => (value <= 0 ? "Max users must be greater than 0" : null),
            maxPatients: (value) => (value <= 0 ? "Max patients must be greater than 0" : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            const features = values.featuresText
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            await api.post("/pricing-plans/add", {
                name: values.name,
                description: values.description,
                monthlyPrice: values.monthlyPrice,
                yearlyPrice: values.yearlyPrice,
                maxUsers: values.maxUsers,
                maxPatients: values.maxPatients,
                features,
                isActive: values.isActive,
                isPublic: values.isPublic,
                displayOrder: values.displayOrder,
            });

            notifications.show({
                title: "Success",
                message: "Pricing plan added successfully",
                color: "green",
            });

            form.reset();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error: any) {
            notifications.show({
                title: "Error",
                message: error?.response?.data?.message || "Failed to add pricing plan",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Add Pricing Plan"
            centered
            size="lg"
            overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <TextInput label="Plan Name" required {...form.getInputProps("name")} />
                    <Textarea label="Description" required minRows={2} {...form.getInputProps("description")} />

                    <Group grow>
                        <NumberInput
                            label="Monthly Price"
                            min={0}
                            decimalScale={2}
                            fixedDecimalScale
                            required
                            {...form.getInputProps("monthlyPrice")}
                        />
                        <NumberInput
                            label="Yearly Price"
                            min={0}
                            decimalScale={2}
                            fixedDecimalScale
                            required
                            {...form.getInputProps("yearlyPrice")}
                        />
                    </Group>

                    <Group grow>
                        <NumberInput label="Max Users" min={1} required {...form.getInputProps("maxUsers")} />
                        <NumberInput label="Max Patients" min={1} required {...form.getInputProps("maxPatients")} />
                    </Group>

                    <TextInput
                        label="Features"
                        placeholder="feature-a, feature-b, feature-c"
                        description="Comma separated"
                        {...form.getInputProps("featuresText")}
                    />

                    <Group grow>
                        <Switch
                            label="Active"
                            checked={form.values.isActive}
                            onChange={(event) => form.setFieldValue("isActive", event.currentTarget.checked)}
                        />
                        <Switch
                            label="Public"
                            checked={form.values.isPublic}
                            onChange={(event) => form.setFieldValue("isPublic", event.currentTarget.checked)}
                        />
                    </Group>

                    <NumberInput label="Display Order" min={0} {...form.getInputProps("displayOrder")} />

                    <Group justify="flex-end" mt="sm">
                        <Button variant="default" onClick={onClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" disabled={loading} leftSection={loading ? <Loader size="xs" /> : null}>
                            {loading ? "Adding..." : "Add Pricing Plan"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}

export default AddPricingPlanModal;
