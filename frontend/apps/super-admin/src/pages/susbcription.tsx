import { useEffect, useMemo, useState } from "react";
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Container,
    Group,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
    Tooltip,
    UnstyledButton,
    useMantineColorScheme,
} from "@mantine/core";
import {
    IconArrowsSort,
    IconEdit,
    IconEye,
    IconPlus,
    IconRefresh,
    IconTrash,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import api from "../utils/api";
import AddSubscriptionModal from "../components/modals/AddSubscriptionModal";
import { AppTable, type Column } from "../components/shared/Table";
import { SearchInput } from "../components/shared/SearchInput";
import { PaginationBar } from "../components/shared/Pagination";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import { ConfirmationModal } from "../components/shared/ConfirmationModal";
import { EntityDetailsModal } from "../components/shared/EntityDetailsModal";

type SubscriptionStatus = "ACTIVE" | "INACTIVE" | "CANCELLED" | "EXPIRED" | "TRIAL";
type SortBy = "planName" | "planPrice" | "billingCycle" | "status" | "startDate" | "endDate" | "createdAt";
type SortOrder = "asc" | "desc";

interface Subscription {
    id: string;
    tenantId: string;
    planId: string;
    planName: string;
    planPrice: number;
    billingCycle: string;
    status: SubscriptionStatus;
    maxUsers: number;
    maxPatients: number;
    features: string[];
    startDate: string;
    endDate: string;
    createdAt: string;
    tenant?: {
        name: string;
        subdomain: string;
    };
}

interface SubscriptionListResponse {
    success: boolean;
    data: Subscription[];
    meta?: {
        page?: number;
        currentPage?: number;
        totalPages?: number;
        totalItems?: number;
        totalCount?: number;
    };
}

const SusbcriptionPage = () => {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";

    const pageSize = 10;

    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "ALL">("ALL");
    const [sortBy, setSortBy] = useState<SortBy>("createdAt");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    const {
        value: searchInput,
        setValue: setSearchInput,
        debouncedValue: debouncedSearch,
        clear: clearSearch,
    } = useDebouncedSearch("", 450);

    const [viewOpened, setViewOpened] = useState(false);
    const [editOpened, setEditOpened] = useState(false);
    const [deleteOpened, setDeleteOpened] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [editForm, setEditForm] = useState({
        billingCycle: "MONTHLY",
        status: "ACTIVE" as SubscriptionStatus,
        startDate: "",
        endDate: "",
    });

    const fetchSubscriptions = async (targetPage: number) => {
        setLoading(true);
        try {
            const response = await api.get<SubscriptionListResponse>("/subscriptions/list", {
                params: {
                    page: targetPage,
                    limit: pageSize,
                    search: debouncedSearch || undefined,
                    status: statusFilter !== "ALL" ? statusFilter : undefined,
                    sortBy,
                    sortOrder,
                },
            });

            setSubscriptions(response.data?.data || []);
            setTotalPages(response.data?.meta?.totalPages || 1);
            setTotalItems(response.data?.meta?.totalItems ?? response.data?.meta?.totalCount ?? 0);
            setPage(response.data?.meta?.currentPage ?? response.data?.meta?.page ?? targetPage);
        } catch (error: any) {
            notifications.show({
                title: "Failed",
                message: error?.response?.data?.message || "Unable to fetch subscriptions",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions(page);
    }, [page, debouncedSearch, statusFilter, sortBy, sortOrder]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter, sortBy, sortOrder]);

    const statusColor = (status: SubscriptionStatus) => {
        if (status === "ACTIVE") return "green";
        if (status === "TRIAL") return "blue";
        if (status === "INACTIVE") return "gray";
        if (status === "CANCELLED") return "red";
        return "orange";
    };

    const handleSort = (field: SortBy) => {
        if (sortBy === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            return;
        }
        setSortBy(field);
        setSortOrder("asc");
    };

    const sortHeader = (label: string, field: SortBy) => (
        <UnstyledButton onClick={() => handleSort(field)}>
            <Group gap={4} wrap="nowrap">
                <Text fw={600} size="sm">{label}</Text>
                <IconArrowsSort size={14} />
            </Group>
        </UnstyledButton>
    );

    const openEdit = (item: Subscription) => {
        setSelectedSubscription(item);
        setEditForm({
            billingCycle: item.billingCycle,
            status: item.status,
            startDate: item.startDate?.slice(0, 10) || "",
            endDate: item.endDate?.slice(0, 10) || "",
        });
        setEditOpened(true);
    };

    const saveEdit = async () => {
        if (!selectedSubscription) return;
        setSaveLoading(true);
        try {
            await api.post(`/subscriptions/edit/${selectedSubscription.id}`, {
                billingCycle: editForm.billingCycle,
                status: editForm.status,
                startDate: editForm.startDate ? new Date(editForm.startDate) : undefined,
                endDate: editForm.endDate ? new Date(editForm.endDate) : undefined,
            });

            notifications.show({
                title: "Updated",
                message: "Subscription updated successfully",
                color: "green",
            });

            setEditOpened(false);
            fetchSubscriptions(page);
        } catch (error: any) {
            notifications.show({
                title: "Update Failed",
                message: error?.response?.data?.message || "Unable to update subscription",
                color: "red",
            });
        } finally {
            setSaveLoading(false);
        }
    };

    const openDelete = (item: Subscription) => {
        setSelectedSubscription(item);
        setDeleteOpened(true);
    };

    const confirmDelete = async () => {
        if (!selectedSubscription) return;
        setDeleteLoading(true);
        try {
            await api.delete(`/subscriptions/delete/${selectedSubscription.id}`);
            notifications.show({
                title: "Deleted",
                message: "Subscription deleted successfully",
                color: "green",
            });
            setDeleteOpened(false);
            fetchSubscriptions(page);
        } catch (error: any) {
            notifications.show({
                title: "Delete Failed",
                message: error?.response?.data?.message || "Unable to delete subscription",
                color: "red",
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const clearFilters = () => {
        clearSearch();
        setStatusFilter("ALL");
        setSortBy("createdAt");
        setSortOrder("desc");
        setPage(1);
    };

    const columns: Column<Subscription>[] = useMemo(() => [
        {
            key: "plan",
            title: sortHeader("Plan", "planName"),
            render: (sub) => sub.planName,
        },
        {
            key: "tenant",
            title: "Tenant",
            render: (sub) => sub.tenant?.name || sub.tenantId,
        },
        {
            key: "cycle",
            title: sortHeader("Cycle", "billingCycle"),
            render: (sub) => sub.billingCycle,
        },
        {
            key: "price",
            title: sortHeader("Price", "planPrice"),
            render: (sub) => `$${Number(sub.planPrice).toFixed(2)}`,
        },
        {
            key: "status",
            title: sortHeader("Status", "status"),
            render: (sub) => (
                <Badge variant="light" color={statusColor(sub.status)}>
                    {sub.status}
                </Badge>
            ),
        },
        {
            key: "period",
            title: "Period",
            render: (sub) => `${new Date(sub.startDate).toLocaleDateString()} - ${new Date(sub.endDate).toLocaleDateString()}`,
        },
        {
            key: "actions",
            title: "Actions",
            align: "center",
            render: (sub) => (
                <Group gap="xs" justify="center">
                    <Tooltip label="View" withArrow>
                        <ActionIcon variant="light" color="blue" onClick={() => {
                            setSelectedSubscription(sub);
                            setViewOpened(true);
                        }}>
                            <IconEye size={16} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Edit" withArrow>
                        <ActionIcon variant="light" color="yellow" onClick={() => openEdit(sub)}>
                            <IconEdit size={16} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete" withArrow>
                        <ActionIcon variant="light" color="red" onClick={() => openDelete(sub)}>
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            ),
        },
    ], [sortBy, sortOrder]);

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <Group align="center" wrap="nowrap" justify="space-between">
                    <Box>
                        <Title order={1} fw={800} style={{ letterSpacing: "-0.5px" }} c={isDark ? "white" : "dark"}>
                            Subscription Management
                        </Title>
                        <Text c="dimmed" size="md" fw={500}>Manage your subscriptions and their information.</Text>
                    </Box>
                    <Button leftSection={<IconPlus size={14} />} variant="outline" onClick={() => setOpened(true)}>
                        Add Subscription
                    </Button>
                </Group>

                <Paper withBorder radius="md" p="md">
                    <Group justify="space-between" align="end" mb="md" wrap="wrap">
                        <SearchInput
                            placeholder="Search by plan, tenant or status"
                            value={searchInput}
                            onChange={setSearchInput}
                            minWidth={320}
                        />
                        <Select
                            label="Status"
                            value={statusFilter}
                            onChange={(value) => setStatusFilter((value as SubscriptionStatus | "ALL") || "ALL")}
                            data={[
                                { value: "ALL", label: "All" },
                                { value: "ACTIVE", label: "Active" },
                                { value: "INACTIVE", label: "Inactive" },
                                { value: "TRIAL", label: "Trial" },
                                { value: "EXPIRED", label: "Expired" },
                                { value: "CANCELLED", label: "Cancelled" },
                            ]}
                            w={220}
                        />
                        <Button variant="light" leftSection={<IconRefresh size={14} />} onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </Group>

                    <AppTable
                        columns={columns}
                        data={subscriptions}
                        rowKey={(row) => row.id}
                        loading={loading}
                        loadingVariant="skeleton"
                        skeletonRows={8}
                        emptyText="No subscriptions found"
                    />

                    <PaginationBar
                        page={page}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        onPageChange={setPage}
                    />
                </Paper>
            </Stack>

            <AddSubscriptionModal
                opened={opened}
                onClose={() => setOpened(false)}
                onSuccess={() => fetchSubscriptions(page)}
            />

            <EntityDetailsModal
                opened={viewOpened}
                onClose={() => setViewOpened(false)}
                title="Subscription Details"
            >
                {selectedSubscription ? (
                    <Stack>
                        <Text><b>Plan:</b> {selectedSubscription.planName}</Text>
                        <Text><b>Tenant:</b> {selectedSubscription.tenant?.name || selectedSubscription.tenantId}</Text>
                        <Text><b>Billing Cycle:</b> {selectedSubscription.billingCycle}</Text>
                        <Text><b>Price:</b> ${Number(selectedSubscription.planPrice).toFixed(2)}</Text>
                        <Text><b>Status:</b> {selectedSubscription.status}</Text>
                        <Text><b>Start:</b> {new Date(selectedSubscription.startDate).toLocaleString()}</Text>
                        <Text><b>End:</b> {new Date(selectedSubscription.endDate).toLocaleString()}</Text>
                    </Stack>
                ) : (
                    <Text c="dimmed">No subscription selected.</Text>
                )}
            </EntityDetailsModal>

            <EntityDetailsModal
                opened={editOpened}
                onClose={() => setEditOpened(false)}
                title="Edit Subscription"
            >
                <Stack>
                    <Select
                        label="Billing Cycle"
                        value={editForm.billingCycle}
                        onChange={(value) => setEditForm((prev) => ({ ...prev, billingCycle: value || prev.billingCycle }))}
                        data={[
                            { value: "MONTHLY", label: "Monthly" },
                            { value: "YEARLY", label: "Yearly" },
                        ]}
                    />
                    <Select
                        label="Status"
                        value={editForm.status}
                        onChange={(value) => setEditForm((prev) => ({ ...prev, status: (value as SubscriptionStatus) || prev.status }))}
                        data={[
                            { value: "ACTIVE", label: "Active" },
                            { value: "INACTIVE", label: "Inactive" },
                            { value: "TRIAL", label: "Trial" },
                            { value: "EXPIRED", label: "Expired" },
                            { value: "CANCELLED", label: "Cancelled" },
                        ]}
                    />
                    <TextInput
                        label="Start Date"
                        type="date"
                        value={editForm.startDate}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, startDate: e.currentTarget.value }))}
                    />
                    <TextInput
                        label="End Date"
                        type="date"
                        value={editForm.endDate}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, endDate: e.currentTarget.value }))}
                    />
                    <Group justify="flex-end">
                        <Button variant="default" onClick={() => setEditOpened(false)}>Cancel</Button>
                        <Button loading={saveLoading} onClick={saveEdit}>Save Changes</Button>
                    </Group>
                </Stack>
            </EntityDetailsModal>

            <ConfirmationModal
                opened={deleteOpened}
                title="Delete Subscription"
                message={`Are you sure you want to delete ${selectedSubscription?.planName || "this subscription"}?`}
                confirmLabel="Delete"
                confirmColor="red"
                loading={deleteLoading}
                onCancel={() => setDeleteOpened(false)}
                onConfirm={confirmDelete}
            />
        </Container>
    );
};

export default SusbcriptionPage;
