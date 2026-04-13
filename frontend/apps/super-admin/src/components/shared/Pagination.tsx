import { Group, Pagination, Text  } from "@mantine/core";

interface PaginationProps{
    page:number;
    totalPages:number;
    totalItems?: number;
    pageSize?: number;
    onPageChange:(page:number) => void;
};

export function PaginationBar({
    page,
    totalPages,
    totalItems,
    pageSize = 10,
    onPageChange,
    
}:PaginationProps){
    const start = totalItems && totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
    const end = totalItems && totalItems > 0 ? Math.min(page * pageSize, totalItems) : 0;

    return (
        <Group justify="space-between" mt="md">
            <Text size="sm" c="dimmed">
                {typeof totalItems === 'number'
                    ? `Showing ${start} to ${end} of ${totalItems} items`
                    : ''}
            </Text>
            <Pagination value={page} onChange={onPageChange} total={Math.max(totalPages, 1)} />
        </Group>
    )
}