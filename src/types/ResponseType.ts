export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}
