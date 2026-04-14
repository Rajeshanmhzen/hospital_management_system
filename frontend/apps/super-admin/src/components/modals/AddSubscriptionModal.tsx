import { Alert, Button, Loader, Modal, Select, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import api from "../../utils/api";

interface AddSubscriptionModalProps {
	opened: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

interface SelectOption {
	value: string;
	label: string;
}

interface TenantListResponse {
	data?: Array<{
		id: string;
		name: string;
		subdomain: string;
	}>;
}

interface PricingPlanResponse {
	id: string;
	name: string;
}

export function AddSubscriptionModal({ opened, onClose, onSuccess }: AddSubscriptionModalProps) {
	const [loading, setLoading] = useState(false);
	const [optionsLoading, setOptionsLoading] = useState(false);
	const [tenantOptions, setTenantOptions] = useState<SelectOption[]>([]);
	const [planOptions, setPlanOptions] = useState<SelectOption[]>([]);
	const [loadError, setLoadError] = useState<string | null>(null);

	const form = useForm({
		initialValues: {
			tenantId: "",
			planId: "",
			billingCycle: "MONTHLY",
		},
		validate: {
			tenantId: (value) => (value ? null : "Tenant is required"),
			planId: (value) => (value ? null : "Pricing plan is required"),
			billingCycle: (value) => (value ? null : "Billing cycle is required"),
		},
	});

	useEffect(() => {
		if (!opened) return;

		const fetchOptions = async () => {
			setOptionsLoading(true);
			setLoadError(null);
			try {
				const [tenantRes, planRes] = await Promise.all([
					api.get<TenantListResponse>("/super-admin/tenants/list", {
						params: { page: 1, limit: 200 },
					}),
					api.get<PricingPlanResponse[] | { data?: PricingPlanResponse[] }>("/pricing-plans/admin/list"),
				]);

				const tenants = tenantRes?.data?.data || [];
				const plansRaw = planRes?.data;
				const plans = Array.isArray(plansRaw)
					? plansRaw
					: Array.isArray(plansRaw?.data)
						? plansRaw.data
						: [];

				setTenantOptions(
					tenants.map((tenant) => ({
						value: tenant.id,
						label: `${tenant.name} (${tenant.subdomain})`,
					}))
				);

				setPlanOptions(
					plans.map((plan) => ({
						value: plan.id,
						label: plan.name,
					}))
				);
			} catch (error: any) {
				setLoadError(error?.response?.data?.message || "Failed to load tenants/plans");
			} finally {
				setOptionsLoading(false);
			}
		};

		fetchOptions();
	}, [opened]);

	const handleSubmit = async (values: typeof form.values) => {
		setLoading(true);
		try {
			await api.post("/subscriptions/add", {
				tenantId: values.tenantId,
				planId: values.planId,
				billingCycle: values.billingCycle,
			});

			notifications.show({
				title: "Success",
				message: "Subscription added successfully",
				color: "green",
			});

			form.reset();
			if (onSuccess) onSuccess();
			onClose();
		} catch (error: any) {
			notifications.show({
				title: "Error",
				message: error?.response?.data?.message || "Failed to add subscription",
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
			title="Add Subscription"
			centered
			size="lg"
			overlayProps={{
				backgroundOpacity: 0.55,
				blur: 3,
			}}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack>
					{loadError && (
						<Alert color="red" icon={<IconInfoCircle size={16} />}>
							<Text size="sm">{loadError}</Text>
						</Alert>
					)}

					<Select
						label="Tenant"
						placeholder={optionsLoading ? "Loading tenants..." : "Select tenant"}
						data={tenantOptions}
						searchable
						disabled={optionsLoading}
						nothingFoundMessage="No tenant found"
						{...form.getInputProps("tenantId")}
					/>

					<Select
						label="Pricing Plan"
						placeholder={optionsLoading ? "Loading plans..." : "Select pricing plan"}
						data={planOptions}
						searchable
						disabled={optionsLoading}
						nothingFoundMessage="No plan found"
						{...form.getInputProps("planId")}
					/>

					<Select
						label="Billing Cycle"
						data={[
							{ value: "MONTHLY", label: "Monthly" },
							{ value: "YEARLY", label: "Yearly" },
						]}
						{...form.getInputProps("billingCycle")}
					/>

					<Button type="submit" disabled={loading || optionsLoading} leftSection={loading ? <Loader size="xs" /> : null}>
						{loading ? "Adding..." : "Add Subscription"}
					</Button>
				</Stack>
			</form>
		</Modal>
	);
}

export default AddSubscriptionModal;
