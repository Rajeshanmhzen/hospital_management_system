import { Group, Loader, Table as MantineTable, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { TableSkeleton } from "./TableSkeleton";

export type Column<T> = {
    key: string;
    title: ReactNode;
    render: (row: T, index: number) => ReactNode;
    width?: number | string;
    align?: "left" | "center" | "right";
};

interface AppTableProps<T> {
    columns: Column<T>[];
    data: T[];
    rowKey: (row: T, index: number) => string;
    loading?: boolean;
    loadingVariant?: "skeleton" | "spinner";
    skeletonRows?: number;
    emptyText?: string;
}

export function AppTable<T>({
    columns,
    data,
    rowKey,
    loading = false,
    loadingVariant = "skeleton",
    skeletonRows = 6,
    emptyText = "No data found",
}: AppTableProps<T>) {
    return (
        <MantineTable striped highlightOnHover withTableBorder>
            <MantineTable.Thead>
                <MantineTable.Tr>
                    {columns.map((column) => (
                        <MantineTable.Th
                            key={column.key}
                            style={{
                                width: column.width,
                                textAlign: column.align ?? "left",
                            }}
                        >
                            {column.title}
                        </MantineTable.Th>
                    ))}
                </MantineTable.Tr>
            </MantineTable.Thead>

            <MantineTable.Tbody>
                {loading && loadingVariant === "spinner" ? (
                    <MantineTable.Tr>
                        <MantineTable.Td colSpan={columns.length}>
                            <Group justify="center" py="xl">
                                <Loader />
                            </Group>
                        </MantineTable.Td>
                    </MantineTable.Tr>
                ) : loading ? (
                    <TableSkeleton columnsCount={columns.length} rows={skeletonRows} />
                ) : data.length === 0 ? (
                    <MantineTable.Tr>
                        <MantineTable.Td colSpan={columns.length}>
                            <Text ta="center" c="dimmed" py="md">
                                {emptyText}
                            </Text>
                        </MantineTable.Td>
                    </MantineTable.Tr>
                ) : (
                    data.map((row, index) => (
                        <MantineTable.Tr key={rowKey(row, index)}>
                            {columns.map((column) => (
                                <MantineTable.Td
                                    key={column.key}
                                    style={{ textAlign: column.align ?? "left" }}
                                >
                                    {column.render(row, index)}
                                </MantineTable.Td>
                            ))}
                        </MantineTable.Tr>
                    ))
                )}
            </MantineTable.Tbody>
        </MantineTable>
    );
}
