export interface ApiResponse {
    code: string;
    message: string;
    success: boolean;
    data?: any[];
    error?: any;
}

export interface ApiResponseObject<T = any> {
    code: string;
    message: string;
    success: boolean;
    data: T;
}

export interface ApiResponseWithPagination {
    code: string;
    message: string;
    success: boolean;
    data?:  Visitor[];
    pagination: {
        total: number;
        limit: number;
        page: number;
        totalPages: number;
    }
}