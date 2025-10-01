export interface ApiResponse<T> {
    status: "success" | "fail",
    api_version: string;
    api_code: number;
    response: {
        response_id: number;
        data: T
    }
}