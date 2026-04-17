import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import { SearchInput } from "../components/shared/SearchInput";
import { AppTable } from "../components/shared/Table";
import { PaginationBar } from "../components/shared/Pagination";
import { useSearchParams } from "react-router-dom";

const InquiryPage = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const pageSize = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const initialPage = Number(searchParams.get("page") || "1");

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(initialPage > 0 ? initialPage : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  return (
    <Container size="xl" py="xl">
      <Stack>
        <Box>
          <Title
            order={1}
            fw={800}
            style={{ letterSpacing: "-0.5px" }}
            c={isDark ? "white" : "dark"}
          >
            Inquiry Page
          </Title>
          <Text c="dimmed" size="md" fw={500}>
            Manage inquiries from users.
          </Text>
        </Box>
      </Stack>
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" align="center" mb="md" wrap="wrap">
          <SearchInput
            placeholder="Search by inquiry ID, user name, or email"
            value={searchInput}
            onChange={setSearchInput}
            minWidth={320}
          />
          <Select
            label="Status"
            value={statusFilter}
            // onChange={(value) =>
            //   setStatusFilter((value as TenantFilterStatus) || "ALL")
            // }
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
          <Button
            variant="light"
            leftSection={<IconRefresh size={14} />}
            style={{ marginTop: 24 }}
            // onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </Group>
        
        <PaginationBar
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </Paper>
    </Container>
  );
};

export default InquiryPage;
