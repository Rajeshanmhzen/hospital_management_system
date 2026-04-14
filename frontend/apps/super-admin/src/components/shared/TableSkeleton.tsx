import { Skeleton, Table as MantineTable } from "@mantine/core";

interface TableSkeletonProps {
    columnsCount: number;
    rows?: number;
}

export function TableSkeleton({ columnsCount, rows = 6 }: TableSkeletonProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <MantineTable.Tr key={`skeleton-row-${rowIndex}`}>
                    {Array.from({ length: columnsCount }).map((__, colIndex) => (
                        <MantineTable.Td key={`skeleton-cell-${rowIndex}-${colIndex}`}>
                            <Skeleton height={20} radius="sm" />
                        </MantineTable.Td>
                    ))}
                </MantineTable.Tr>
            ))}
        </>
    );
}
