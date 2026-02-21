export interface PaginationQuery {
    page?: string | number;
    limit?: string | number;
}

export interface PaginationParams {
    skip: number;
    take: number;
    page: number;
    limit: number;
}

export interface PaginationMeta {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export const getPaginationParams = (query: PaginationQuery): PaginationParams => {
    const page = Math.max(1, parseInt(query.page?.toString() || '1', 10));
    const limit = Math.max(1, parseInt(query.limit?.toString() || '10', 10));
    const skip = (page - 1) * limit;

    return { skip, take: limit, page, limit };
};

export const getPaginationMeta = (totalCount: number, page: number, limit: number): PaginationMeta => {
    const totalPages = Math.ceil(totalCount / limit);

    return {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
    };
};
