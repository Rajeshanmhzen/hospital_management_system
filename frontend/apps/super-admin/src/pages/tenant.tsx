import { useEffect, useMemo, useState } from "react";
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    TextInput,
    Text,
    Title,
    Timeline,
    Tooltip,
    Select,
    UnstyledButton,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
    IconArrowsSort,
    IconCheck,
    IconDownload,
    IconEdit,
    IconInfoCircle,
    IconRefresh,
    IconSearch,
    IconTrash,
} from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import { AppTable, type Column } from "../components/shared/Table";
import { PaginationBar } from "../components/shared/Pagination";
import { ConfirmationModal } from "../components/shared/ConfirmationModal";
import { EntityDetailsModal } from "../components/shared/EntityDetailsModal";

type TenantStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "INACTIVE";
type TenantFilterStatus = "ALL" | TenantStatus | "CANCELLED";

interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    ownerName: string;
    ownerEmail: string;
    status: TenantStatus;
}

interface TenantDetail extends Tenant {
    createdAt?: string;
    updatedAt?: string;
    ownerPhone?: string | null;
}

type SortBy = "name" | "subdomain" | "ownerName" | "ownerEmail" | "status" | "createdAt";
type SortOrder = "asc" | "desc";

type EditTenantFieldErrors = {
    name?: string;
    subdomain?: string;
    ownerName?: string;
    ownerEmail?: string;
    status?: string;
};

interface TenantListResponse {
    success: boolean;
    data: Tenant[];
    meta?: {
        page?: number;
        currentPage?: number;
        limit: number;
        totalItems?: number;
        totalCount?: number;
        totalPages: number;
    };
}

const TenantPage = () => {
    const pageSize = 10;
    const [searchParams, setSearchParams] = useSearchParams();

    const initialPage = Number(searchParams.get("page") || "1");
    const initialSearch = searchParams.get("search") || "";
    const initialStatus = (searchParams.get("status") as TenantFilterStatus) || "ALL";
    const initialSortBy = (searchParams.get("sortBy") as SortBy) || "createdAt";
    const initialSortOrder = (searchParams.get("sortOrder") as SortOrder) || "desc";

    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(initialPage > 0 ? initialPage : 1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchInput, setSearchInput] = useState(initialSearch);
    const [statusFilter, setStatusFilter] = useState<TenantFilterStatus>(initialStatus);
    const [sortBy, setSortBy] = useState<SortBy>(initialSortBy);
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);
    const [debouncedSearch] = useDebouncedValue(searchInput, 450);
    const [viewOpened, setViewOpened] = useState(false);
    const [editOpened, setEditOpened] = useState(false);
    const [deleteOpened, setDeleteOpened] = useState(false);
    const [bulkConfirmOpened, setBulkConfirmOpened] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [bulkLoading, setBulkLoading] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<TenantDetail | null>(null);
    const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);
    const [editFieldErrors, setEditFieldErrors] = useState<EditTenantFieldErrors>({});
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkStatus, setBulkStatus] = useState<TenantStatus>("ACTIVE");
    const [editForm, setEditForm] = useState({
        name: "",
        subdomain: "",
        ownerName: "",
        ownerEmail: "",
        status: "PENDING" as TenantStatus,
    });

    const fetchTenants = async (targetPage: number) => {
        setLoading(true);
        try {
            const response = await api.get<TenantListResponse>("/super-admin/tenants/list", {
                params: {
                    page: targetPage,
                    limit: pageSize,
                    search: debouncedSearch || undefined,
                    status: statusFilter !== "ALL" ? statusFilter : undefined,
                    sortBy,
                    sortOrder,
                },
            });

            setTenants(response.data?.data || []);
            setTotalPages(response.data?.meta?.totalPages || 1);
            setTotalItems(response.data?.meta?.totalItems ?? response.data?.meta?.totalCount ?? 0);
            setPage(response.data?.meta?.currentPage ?? response.data?.meta?.page ?? targetPage);
            setSelectedIds([]);
        } catch (error: any) {
            notifications.show({
                title: "Failed",
                message: error?.response?.data?.message || "Unable to fetch tenants",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants(page);
    }, [page, debouncedSearch, statusFilter, sortBy, sortOrder]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter, sortBy, sortOrder]);

    useEffect(() => {
        const params: Record<string, string> = {
            page: String(page),
            sortBy,
            sortOrder,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (statusFilter !== "ALL") params.status = statusFilter;

        setSearchParams(params, { replace: true });
    }, [page, debouncedSearch, statusFilter, sortBy, sortOrder, setSearchParams]);

    const statusColor = (status: TenantStatus) => {
        if (status === "ACTIVE") return "green";
        if (status === "PENDING") return "yellow";
        if (status === "SUSPENDED") return "red";
        return "gray";
    };

    const handleView = async (id: string) => {
        setViewLoading(true);
        try {
            const response = await api.get(`/super-admin/tenants/detail/${id}`);
            const tenant = response?.data?.data;
            setSelectedTenant(tenant);
            setViewOpened(true);
        } catch (error: any) {
            notifications.show({
                title: "View Failed",
                message: error?.response?.data?.message || "Unable to load tenant details",
                color: "red",
            });
        } finally {
            setViewLoading(false);
        }
    };

    const handleEdit = async (tenant: Tenant) => {
        setViewLoading(true);
        try {
            const response = await api.get(`/super-admin/tenants/detail/${tenant.id}`);
            const detail = response?.data?.data as TenantDetail;
            setSelectedTenant(detail);
            setEditFieldErrors({});
            setEditForm({
                name: detail?.name || "",
                subdomain: detail?.subdomain || "",
                ownerName: detail?.ownerName || "",
                ownerEmail: detail?.ownerEmail || "",
                status: (detail?.status || "PENDING") as TenantStatus,
            });
            setEditOpened(true);
        } catch (error: any) {
            notifications.show({
                title: "Edit Failed",
                message: error?.response?.data?.message || "Unable to load tenant for editing",
                color: "red",
            });
        } finally {
            setViewLoading(false);
        }
    };

    const handleEditSave = async () => {
        if (!selectedTenant?.id) return;
        setSaveLoading(true);
        setEditFieldErrors({});
        try {
            await api.put(`/super-admin/tenants/edit/${selectedTenant.id}`, editForm);
            notifications.show({
                title: "Updated",
                message: "Tenant updated successfully",
                color: "green",
            });
            setEditOpened(false);
            fetchTenants(page);
        } catch (error: any) {
            const responseData = error?.response?.data;
            const rawErrors = responseData?.errors || responseData?.details;
            const nextFieldErrors: EditTenantFieldErrors = {};

            if (Array.isArray(rawErrors)) {
                rawErrors.forEach((entry: any) => {
                    const key = entry?.path || entry?.field;
                    const message = entry?.message || entry?.msg;
                    if (key && message && key in editForm) {
                        (nextFieldErrors as any)[key] = message;
                    }
                });
            } else if (rawErrors && typeof rawErrors === "object") {
                Object.keys(rawErrors).forEach((key) => {
                    const value = rawErrors[key];
                    if (key in editForm) {
                        (nextFieldErrors as any)[key] = Array.isArray(value) ? value[0] : String(value);
                    }
                });
            }

            if (Object.keys(nextFieldErrors).length > 0) {
                setEditFieldErrors(nextFieldErrors);
            }

            notifications.show({
                title: "Update Failed",
                message: responseData?.message || "Unable to update tenant",
                color: "red",
            });
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = async (tenant: Tenant) => {
        setTenantToDelete(tenant);
        setDeleteOpened(true);
    };

    const toggleTenantStatus = async (tenant: Tenant) => {
        const nextStatus: TenantStatus = tenant.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        const previous = tenants;

        setTenants((prev) =>
            prev.map((item) => (item.id === tenant.id ? { ...item, status: nextStatus } : item))
        );

        try {
            await api.patch(`/super-admin/tenants/${tenant.id}/status`, { status: nextStatus });
            notifications.show({
                title: "Status Updated",
                message: `${tenant.name} is now ${nextStatus}`,
                color: "green",
            });
        } catch (error: any) {
            setTenants(previous);
            notifications.show({
                title: "Status Update Failed",
                message: error?.response?.data?.message || "Failed to update tenant status",
                color: "red",
            });
        }
    };

    const handleBulkStatusApply = async () => {
        if (selectedIds.length === 0) {
            notifications.show({
                title: "No Selection",
                message: "Select at least one tenant",
                color: "yellow",
            });
            return;
        }
        setBulkConfirmOpened(true);
    };

    const confirmBulkStatusApply = async () => {
        setBulkLoading(true);
        try {
            await api.patch("/super-admin/tenants/bulk-status", {
                ids: selectedIds,
                status: bulkStatus,
            });

            setTenants((prev) =>
                prev.map((tenant) =>
                    selectedIds.includes(tenant.id) ? { ...tenant, status: bulkStatus } : tenant
                )
            );

            notifications.show({
                title: "Bulk Update Successful",
                message: `${selectedIds.length} tenants updated to ${bulkStatus}`,
                color: "green",
            });
            setSelectedIds([]);
            setBulkConfirmOpened(false);
            fetchTenants(page);
        } catch (error: any) {
            notifications.show({
                title: "Bulk Update Failed",
                message: error?.response?.data?.message || "Unable to update selected tenants",
                color: "red",
            });
        } finally {
            setBulkLoading(false);
        }
    };

    const handleExportCsv = async () => {
        try {
            const response = await api.get("/super-admin/tenants/export", {
                params: {
                    search: debouncedSearch || undefined,
                    status: statusFilter !== "ALL" ? statusFilter : undefined,
                    sortBy,
                    sortOrder,
                },
            });

            const rows = response?.data?.data || [];
            const headers = ["id", "name", "subdomain", "ownerName", "ownerEmail", "status", "createdAt"];
            const csv = [
                headers.join(","),
                ...rows.map((row: any) =>
                    headers
                        .map((key) => {
                            const value = row?.[key] ?? "";
                            const escaped = String(value).replace(/"/g, '""');
                            return `"${escaped}"`;
                        })
                        .join(",")
                ),
            ].join("\n");

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "tenants_export.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error: any) {
            notifications.show({
                title: "Export Failed",
                message: error?.response?.data?.message || "Unable to export tenants",
                color: "red",
            });
        }
    };

    const clearFilters = () => {
        setSearchInput("");
        setStatusFilter("ALL");
        setSortBy("createdAt");
        setSortOrder("desc");
        setPage(1);
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

    const allSelected = tenants.length > 0 && selectedIds.length === tenants.length;

    const confirmDeleteTenant = async () => {
        if (!tenantToDelete) return;
        setDeleteLoading(true);
        try {
            await api.delete(`/super-admin/tenants/delete/${tenantToDelete.id}`);
            notifications.show({
                title: "Deleted",
                message: `${tenantToDelete.name} deleted successfully`,
                color: "green",
            });
            const remainingItemsAfterDelete = Math.max(totalItems - 1, 0);
            const nextPage = page > 1 && tenants.length === 1 ? page - 1 : page;
            setTotalItems(remainingItemsAfterDelete);
            setPage(nextPage);
            fetchTenants(nextPage);
            setDeleteOpened(false);
            setTenantToDelete(null);
        } catch (error: any) {
            notifications.show({
                title: "Delete Failed",
                message: error?.response?.data?.message || "Unable to delete tenant",
                color: "red",
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const columns: Column<Tenant>[] = useMemo(() => [
            {
                key: "select",
                title: (
                    <Checkbox
                        checked={allSelected}
                        indeterminate={selectedIds.length > 0 && !allSelected}
                        onChange={(event) => {
                            if (event.currentTarget.checked) {
                                setSelectedIds(tenants.map((tenant) => tenant.id));
                            } else {
                                setSelectedIds([]);
                            }
                        }}
                    />
                ),
                align: "center",
                render: (tenant) => (
                    <Checkbox
                        checked={selectedIds.includes(tenant.id)}
                        onChange={(event) => {
                            if (event.currentTarget.checked) {
                                setSelectedIds((prev) => [...prev, tenant.id]);
                            } else {
                                setSelectedIds((prev) => prev.filter((id) => id !== tenant.id));
                            }
                        }}
                    />
                ),
            },
            {
                key: "name",
                title: sortHeader("Tenant", "name"),
                render: (tenant) => tenant.name,
            },
            {
                key: "subdomain",
                title: sortHeader("Subdomain", "subdomain"),
                render: (tenant) => tenant.subdomain,
            },
            {
                key: "ownerName",
                title: sortHeader("Owner", "ownerName"),
                render: (tenant) => tenant.ownerName,
            },
            {
                key: "ownerEmail",
                title: sortHeader("Email", "ownerEmail"),
                render: (tenant) => tenant.ownerEmail,
            },
            {
                key: "status",
                title: sortHeader("Status", "status"),
                render: (tenant) => (
                    <Group gap="xs" wrap="nowrap">
                        <Badge variant="light" color={statusColor(tenant.status)}>
                            {tenant.status}
                        </Badge>
                        <Tooltip label={tenant.status === "ACTIVE" ? "Suspend" : "Activate"} withArrow>
                            <ActionIcon
                                size="sm"
                                variant="subtle"
                                color={tenant.status === "ACTIVE" ? "red" : "green"}
                                onClick={() => toggleTenantStatus(tenant)}
                                aria-label="Toggle tenant status"
                            >
                                <IconCheck size={14} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                ),
            },
            {
                key: "actions",
                title: "Actions",
                align: "center",
                render: (tenant) => (
                    <Group gap="xs" justify="center">
                        <Tooltip label="View" withArrow>
                            <ActionIcon
                                variant="light"
                                color="blue"
                                loading={viewLoading}
                                onClick={() => handleView(tenant.id)}
                                aria-label="View tenant"
                            >
                                <IconInfoCircle size={16} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Edit" withArrow>
                            <ActionIcon
                                variant="light"
                                color="yellow"
                                loading={viewLoading}
                                onClick={() => handleEdit(tenant)}
                                aria-label="Edit tenant"
                            >
                                <IconEdit size={16} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Delete" withArrow>
                            <ActionIcon
                                variant="light"
                                color="red"
                                onClick={() => handleDelete(tenant)}
                                aria-label="Delete tenant"
                            >
                                <IconTrash size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                ),
            },
        ], [allSelected, selectedIds, tenants, sortBy, sortOrder]);

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <Group align="center" wrap="nowrap" justify="space-between">
                    <Box>
                        <Title>Tenant Management</Title>
                        <Text>Manage your tenants and their information.</Text>
                    </Box>
                    <Button leftSection={<IconDownload size={14} />} variant="outline" onClick={handleExportCsv}>
                        Export Tenants
                    </Button>
                </Group>

                <Paper withBorder radius="md" p="md">
                    <Group justify="space-between" align="end" mb="md" wrap="wrap">
                        <TextInput
                            placeholder="Search by tenant, owner, email, subdomain"
                            leftSection={<IconSearch size={16} />}
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.currentTarget.value)}
                            style={{ minWidth: 320, flex: 1 }}
                        />
                        <Select
                            label="Status"
                            value={statusFilter}
                            onChange={(value) => setStatusFilter((value as TenantFilterStatus) || "ALL")}
                            data={[
                                { value: "ALL", label: "All" },
                                { value: "ACTIVE", label: "Active" },
                                { value: "PENDING", label: "Pending" },
                                { value: "SUSPENDED", label: "Suspended" },
                                { value: "INACTIVE", label: "Inactive" },
                                { value: "CANCELLED", label: "Cancelled" },
                            ]}
                            w={220}
                        />
                        <Button variant="light" leftSection={<IconRefresh size={14} />} onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </Group>

                    <Group justify="space-between" align="end" mb="md" wrap="wrap">
                        <Group>
                            <Select
                                label="Bulk Status"
                                value={bulkStatus}
                                onChange={(value) => setBulkStatus((value as TenantStatus) || "ACTIVE")}
                                data={[
                                    { value: "ACTIVE", label: "Active" },
                                    { value: "PENDING", label: "Pending" },
                                    { value: "SUSPENDED", label: "Suspended" },
                                    { value: "INACTIVE", label: "Inactive" },
                                ]}
                                w={180}
                            />
                            <Button onClick={handleBulkStatusApply} disabled={selectedIds.length === 0}>
                                Apply to Selected ({selectedIds.length})
                            </Button>
                        </Group>
                    </Group>

                    <AppTable
                        columns={columns}
                        data={tenants}
                        rowKey={(row) => row.id}
                        loading={loading}
                        loadingVariant="skeleton"
                        skeletonRows={8}
                        emptyText="No tenants found"
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

            <EntityDetailsModal
                opened={viewOpened}
                onClose={() => setViewOpened(false)}
                title="Tenant Details"
            >
                {!selectedTenant ? (
                    <Text c="dimmed">No tenant selected.</Text>
                ) : (
                    <Stack gap="lg">
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <Box>
                                <Text c="dimmed" size="sm">Tenant Name</Text>
                                <Text fw={600}>{selectedTenant.name}</Text>
                            </Box>
                            <Box>
                                <Text c="dimmed" size="sm">Subdomain</Text>
                                <Text fw={600}>{selectedTenant.subdomain}</Text>
                            </Box>
                            <Box>
                                <Text c="dimmed" size="sm">Owner Name</Text>
                                <Text fw={600}>{selectedTenant.ownerName}</Text>
                            </Box>
                            <Box>
                                <Text c="dimmed" size="sm">Owner Email</Text>
                                <Text fw={600}>{selectedTenant.ownerEmail}</Text>
                            </Box>
                            <Box>
                                <Text c="dimmed" size="sm">Status</Text>
                                <Badge variant="light" color={statusColor(selectedTenant.status)}>
                                    {selectedTenant.status}
                                </Badge>
                            </Box>
                            <Box>
                                <Text c="dimmed" size="sm">Created At</Text>
                                <Text fw={600}>
                                    {selectedTenant.createdAt ? new Date(selectedTenant.createdAt).toLocaleString() : "-"}
                                </Text>
                            </Box>
                        </SimpleGrid>

                        <Box>
                            <Text fw={600} mb="xs">Audit Timeline</Text>
                            <Timeline active={2} bulletSize={16} lineWidth={2}>
                                <Timeline.Item title="Tenant Created">
                                    <Text size="sm" c="dimmed">
                                        {selectedTenant.createdAt ? new Date(selectedTenant.createdAt).toLocaleString() : "Unknown"}
                                    </Text>
                                </Timeline.Item>
                                <Timeline.Item title="Profile Updated">
                                    <Text size="sm" c="dimmed">
                                        {selectedTenant.updatedAt ? new Date(selectedTenant.updatedAt).toLocaleString() : "No updates yet"}
                                    </Text>
                                </Timeline.Item>
                                <Timeline.Item title="Current Status">
                                    <Text size="sm" c="dimmed">{selectedTenant.status}</Text>
                                </Timeline.Item>
                            </Timeline>
                        </Box>
                    </Stack>
                )}
            </EntityDetailsModal>

            <EntityDetailsModal
                opened={editOpened}
                onClose={() => setEditOpened(false)}
                title="Edit Tenant"
            >
                <Stack>
                    <TextInput
                        label="Tenant Name"
                        value={editForm.name}
                        error={editFieldErrors.name}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.currentTarget.value }))}
                    />
                    <TextInput
                        label="Subdomain"
                        value={editForm.subdomain}
                        error={editFieldErrors.subdomain}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, subdomain: event.currentTarget.value }))}
                    />
                    <TextInput
                        label="Owner Name"
                        value={editForm.ownerName}
                        error={editFieldErrors.ownerName}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, ownerName: event.currentTarget.value }))}
                    />
                    <TextInput
                        label="Owner Email"
                        value={editForm.ownerEmail}
                        error={editFieldErrors.ownerEmail}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, ownerEmail: event.currentTarget.value }))}
                    />
                    <Select
                        label="Status"
                        value={editForm.status}
                        error={editFieldErrors.status}
                        onChange={(value) => setEditForm((prev) => ({ ...prev, status: (value as TenantStatus) || prev.status }))}
                        data={[
                            { value: "ACTIVE", label: "Active" },
                            { value: "PENDING", label: "Pending" },
                            { value: "SUSPENDED", label: "Suspended" },
                            { value: "INACTIVE", label: "Inactive" },
                        ]}
                    />

                    <Group justify="flex-end" mt="sm">
                        <Button variant="default" onClick={() => setEditOpened(false)}>
                            Cancel
                        </Button>
                        <Button loading={saveLoading} onClick={handleEditSave}>
                            Save Changes
                        </Button>
                    </Group>
                </Stack>
            </EntityDetailsModal>

            <ConfirmationModal
                opened={deleteOpened}
                title="Delete Tenant"
                message={`Are you sure you want to delete ${tenantToDelete?.name || "this tenant"}? This action cannot be undone.`}
                confirmLabel="Delete"
                confirmColor="red"
                loading={deleteLoading}
                onCancel={() => {
                    setDeleteOpened(false);
                    setTenantToDelete(null);
                }}
                onConfirm={confirmDeleteTenant}
            />

            <ConfirmationModal
                opened={bulkConfirmOpened}
                title="Apply Bulk Status"
                message={`Update ${selectedIds.length} selected tenants to ${bulkStatus}?`}
                confirmLabel="Apply"
                confirmColor="blue"
                loading={bulkLoading}
                onCancel={() => setBulkConfirmOpened(false)}
                onConfirm={confirmBulkStatusApply}
            />
        </Container>
    );
};

export default TenantPage;