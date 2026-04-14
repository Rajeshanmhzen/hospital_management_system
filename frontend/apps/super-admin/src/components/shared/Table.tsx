import { Group, Loader, Table as MantineTable, Text, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";
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
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";

    const tableStyles: CSSProperties = {
        color: isDark ? theme.colors.gray[1] : theme.colors.gray[8],
        borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
        ["--table-striped-color" as string]: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
        ["--table-highlight-on-hover-color" as string]: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
        ["--table-border-color" as string]: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
    };

    return (
        <MantineTable striped highlightOnHover withTableBorder style={tableStyles}>
            <MantineTable.Thead>
                <MantineTable.Tr>
                    {columns.map((column) => (
                        <MantineTable.Th
                            key={column.key}
                            style={{
                                width: column.width,
                                textAlign: column.align ?? "left",
                                color: isDark ? theme.colors.gray[0] : theme.colors.dark[8],
                                backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
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
