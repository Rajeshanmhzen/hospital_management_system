import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowsSort,
  IconDownload,
  IconEdit,
  IconInfoCircle,
  IconPlus,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import api from "../utils/api";
import { AddPricingPlanModal } from "../components/modals/AddPricingPlanModal";
import { SearchInput } from "../components/shared/SearchInput";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import { AppTable, type Column } from "../components/shared/Table";
import { PaginationBar } from "../components/shared/Pagination";
import { ConfirmationModal } from "../components/shared/ConfirmationModal";
import { EntityDetailsModal } from "../components/shared/EntityDetailsModal";

type SortBy =
  | "name"
  | "monthlyPrice"
  | "yearlyPrice"
  | "displayOrder"
  | "createdAt";
type SortOrder = "asc" | "desc";
type PlanStatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxUsers: number;
  maxPatients: number;
  features: string[];
  isActive: boolean;
  isPublic: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

const PricingPlanPage = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const pageSize = 10;

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [viewOpened, setViewOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>("displayOrder");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [statusFilter, setStatusFilter] = useState<PlanStatusFilter>("ALL");

  const {
    value: searchInput,
    setValue: setSearchInput,
    debouncedValue: debouncedSearch,
    clear: clearSearch,
  } = useDebouncedSearch("", 400);

  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    monthlyPrice: 0,
    yearlyPrice: 0,
    maxUsers: 0,
    maxPatients: 0,
    featuresText: "",
    isActive: true,
    isPublic: true,
    displayOrder: 0,
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await api.get<PricingPlan[]>(
        "/pricing-plans/admin/list",
      );
      setPlans(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      notifications.show({
        title: "Failed",
        message:
          error?.response?.data?.message || "Unable to fetch pricing plans",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const filteredSortedPlans = useMemo(() => {
    const lowerSearch = debouncedSearch.trim().toLowerCase();

    const statusFiltered = plans.filter((plan) => {
      if (statusFilter === "ALL") return true;
      if (statusFilter === "ACTIVE") return plan.isActive;
      return !plan.isActive;
    });

    const filtered = !lowerSearch
      ? statusFiltered
      : statusFiltered.filter((plan) => {
          const featuresText = Array.isArray(plan.features)
            ? plan.features.join(" ")
            : "";
          return (
            plan.name.toLowerCase().includes(lowerSearch) ||
            plan.description.toLowerCase().includes(lowerSearch) ||
            featuresText.toLowerCase().includes(lowerSearch)
          );
        });

    return [...filtered].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [plans, debouncedSearch, statusFilter, sortBy, sortOrder]);

  const totalItems = filteredSortedPlans.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageItems = filteredSortedPlans.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

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
        <Text fw={600} size="sm">
          {label}
        </Text>
        <IconArrowsSort size={14} />
      </Group>
    </UnstyledButton>
  );

  const handleView = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setViewOpened(true);
  };

  const handleEdit = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setEditForm({
      name: plan.name,
      description: plan.description,
      monthlyPrice: Number(plan.monthlyPrice),
      yearlyPrice: Number(plan.yearlyPrice),
      maxUsers: plan.maxUsers,
      maxPatients: plan.maxPatients,
      featuresText: Array.isArray(plan.features)
        ? plan.features.join(", ")
        : "",
      isActive: plan.isActive,
      isPublic: plan.isPublic,
      displayOrder: plan.displayOrder,
    });
    setEditOpened(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedPlan) return;
    setSaveLoading(true);
    try {
      const features = editForm.featuresText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      await api.put(`/pricing-plans/edit/${selectedPlan.id}`, {
        name: editForm.name,
        description: editForm.description,
        monthlyPrice: editForm.monthlyPrice,
        yearlyPrice: editForm.yearlyPrice,
        maxUsers: editForm.maxUsers,
        maxPatients: editForm.maxPatients,
        features,
        isActive: editForm.isActive,
        isPublic: editForm.isPublic,
        displayOrder: editForm.displayOrder,
      });

      notifications.show({
        title: "Updated",
        message: "Pricing plan updated successfully",
        color: "green",
      });

      setEditOpened(false);
      fetchPlans();
    } catch (error: any) {
      notifications.show({
        title: "Update Failed",
        message:
          error?.response?.data?.message || "Unable to update pricing plan",
        color: "red",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setDeleteOpened(true);
  };

  const confirmDelete = async () => {
    if (!selectedPlan) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/pricing-plans/delete/${selectedPlan.id}`);
      notifications.show({
        title: "Deleted",
        message: "Pricing plan deleted successfully",
        color: "green",
      });
      setDeleteOpened(false);
      fetchPlans();
    } catch (error: any) {
      notifications.show({
        title: "Delete Failed",
        message:
          error?.response?.data?.message || "Unable to delete pricing plan",
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const exportCsv = () => {
    const headers = [
      "id",
      "name",
      "description",
      "monthlyPrice",
      "yearlyPrice",
      "maxUsers",
      "maxPatients",
      "isActive",
      "isPublic",
      "displayOrder",
      "createdAt",
    ];

    const csv = [
      headers.join(","),
      ...filteredSortedPlans.map((row) =>
        headers
          .map((key) => {
            const value = (row as any)[key] ?? "";
            const escaped = String(value).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "pricing_plans_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    clearSearch();
    setStatusFilter("ALL");
    setSortBy("displayOrder");
    setSortOrder("asc");
    setPage(1);
  };

  const columns: Column<PricingPlan>[] = [
    {
      key: "name",
      title: sortHeader("Plan", "name"),
      render: (plan) => plan.name,
    },
    {
      key: "price",
      title: sortHeader("Monthly", "monthlyPrice"),
      render: (plan) => `$${Number(plan.monthlyPrice).toFixed(2)}`,
    },
    {
      key: "yearly",
      title: sortHeader("Yearly", "yearlyPrice"),
      render: (plan) => `$${Number(plan.yearlyPrice).toFixed(2)}`,
    },
    {
      key: "limits",
      title: "Limits",
      render: (plan) => `${plan.maxUsers} users / ${plan.maxPatients} patients`,
    },
    {
      key: "status",
      title: "Flags",
      render: (plan) => (
        <Group gap="xs">
          <Badge variant="light" color={plan.isActive ? "green" : "red"}>
            {plan.isActive ? "ACTIVE" : "INACTIVE"}
          </Badge>
          <Badge variant="light" color={plan.isPublic ? "blue" : "gray"}>
            {plan.isPublic ? "PUBLIC" : "PRIVATE"}
          </Badge>
        </Group>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      align: "center",
      render: (plan) => (
        <Group gap="xs" justify="center">
          <Tooltip label="View" withArrow>
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => handleView(plan)}
            >
              <IconInfoCircle size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit" withArrow>
            <ActionIcon
              variant="light"
              color="yellow"
              onClick={() => handleEdit(plan)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete" withArrow>
            <ActionIcon
              variant="light"
              color="red"
              onClick={() => handleDelete(plan)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group align="center" wrap="nowrap" justify="space-between">
          <Box>
            <Title
              order={1}
              fw={800}
              style={{ letterSpacing: "-0.5px" }}
              c={isDark ? "white" : "dark"}
            >
              Pricing Plan Management
            </Title>
            <Text c="dimmed" size="md" fw={500}>
              Manage your pricing plans and their information.
            </Text>
          </Box>
          <Group>
            <Button
              leftSection={<IconDownload size={14} />}
              variant="outline"
              onClick={exportCsv}
            >
              Export Plans
            </Button>
            <Button
              leftSection={<IconPlus size={14} />}
              variant="outline"
              onClick={() => setOpened(true)}
            >
              Add Pricing Plan
            </Button>
          </Group>
        </Group>

        <Paper withBorder radius="md" p="md">
          <Group justify="space-between" align="end" mb="md" wrap="wrap">
            <SearchInput
              placeholder="Search by plan name or description"
              value={searchInput}
              onChange={setSearchInput}
              minWidth={320}
            />
            <Select
              label="Status"
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter((value as PlanStatusFilter) || "ALL")
              }
              data={[
                { value: "ALL", label: "All" },
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
              ]}
              w={180}
            />
            <Button
              variant="light"
              leftSection={<IconRefresh size={14} />}
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </Group>

          <AppTable
            columns={columns}
            data={pageItems}
            rowKey={(row) => row.id}
            loading={loading}
            loadingVariant="skeleton"
            skeletonRows={8}
            emptyText="No pricing plans found"
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

      <AddPricingPlanModal
        opened={opened}
        onClose={() => setOpened(false)}
        onSuccess={fetchPlans}
      />

      <EntityDetailsModal
        opened={viewOpened}
        onClose={() => setViewOpened(false)}
        title="Pricing Plan Details"
      >
        {selectedPlan ? (
          <Stack>
            <Text>
              <b>Name:</b> {selectedPlan.name}
            </Text>
            <Text>
              <b>Description:</b> {selectedPlan.description}
            </Text>
            <Text>
              <b>Monthly:</b> ${Number(selectedPlan.monthlyPrice).toFixed(2)}
            </Text>
            <Text>
              <b>Yearly:</b> ${Number(selectedPlan.yearlyPrice).toFixed(2)}
            </Text>
            <Text>
              <b>Max Users:</b> {selectedPlan.maxUsers}
            </Text>
            <Text>
              <b>Max Patients:</b> {selectedPlan.maxPatients}
            </Text>
            <Text>
              <b>Features:</b>{" "}
              {Array.isArray(selectedPlan.features)
                ? selectedPlan.features.join(", ")
                : "-"}
            </Text>
            <Text>
              <b>Display Order:</b> {selectedPlan.displayOrder}
            </Text>
          </Stack>
        ) : (
          <Text c="dimmed">No plan selected.</Text>
        )}
      </EntityDetailsModal>

      <EntityDetailsModal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        title="Edit Pricing Plan"
      >
        <Stack>
          <TextInput
            label="Plan Name"
            value={editForm.name}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, name: e.currentTarget.value }))
            }
          />
          <Textarea
            label="Description"
            value={editForm.description}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, description: e.currentTarget.value }))
            }
            minRows={2}
          />
          <Group grow>
            <NumberInput
              label="Monthly Price"
              value={editForm.monthlyPrice}
              onChange={(v) =>
                setEditForm((p) => ({ ...p, monthlyPrice: Number(v) || 0 }))
              }
            />
            <NumberInput
              label="Yearly Price"
              value={editForm.yearlyPrice}
              onChange={(v) =>
                setEditForm((p) => ({ ...p, yearlyPrice: Number(v) || 0 }))
              }
            />
          </Group>
          <Group grow>
            <NumberInput
              label="Max Users"
              value={editForm.maxUsers}
              onChange={(v) =>
                setEditForm((p) => ({ ...p, maxUsers: Number(v) || 0 }))
              }
            />
            <NumberInput
              label="Max Patients"
              value={editForm.maxPatients}
              onChange={(v) =>
                setEditForm((p) => ({ ...p, maxPatients: Number(v) || 0 }))
              }
            />
          </Group>
          <TextInput
            label="Features"
            value={editForm.featuresText}
            onChange={(e) =>
              setEditForm((p) => ({
                ...p,
                featuresText: e.currentTarget.value,
              }))
            }
          />
          <Group grow>
            <Switch
              label="Active"
              checked={editForm.isActive}
              onChange={(e) =>
                setEditForm((p) => ({
                  ...p,
                  isActive: e.currentTarget.checked,
                }))
              }
            />
            <Switch
              label="Public"
              checked={editForm.isPublic}
              onChange={(e) =>
                setEditForm((p) => ({
                  ...p,
                  isPublic: e.currentTarget.checked,
                }))
              }
            />
          </Group>
          <NumberInput
            label="Display Order"
            value={editForm.displayOrder}
            onChange={(v) =>
              setEditForm((p) => ({ ...p, displayOrder: Number(v) || 0 }))
            }
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setEditOpened(false)}>
              Cancel
            </Button>
            <Button loading={saveLoading} onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </EntityDetailsModal>

      <ConfirmationModal
        opened={deleteOpened}
        title="Delete Pricing Plan"
        message={`Are you sure you want to delete ${selectedPlan?.name || "this pricing plan"}?`}
        confirmLabel="Delete"
        confirmColor="red"
        loading={deleteLoading}
        onCancel={() => setDeleteOpened(false)}
        onConfirm={confirmDelete}
      />
    </Container>
  );
};

export default PricingPlanPage;
