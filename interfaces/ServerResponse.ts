interface Results {
    data: any;
    info: object;
}

export interface ServerResponse {
    name: string;
    route: string;
    error?: {
        user_facing_message: string;
        technical_message: string;
        expected: boolean;
    };
    description: string;
    operation_start: number;
    operation_end: number;
    operation_duration: number;
    request_failed: boolean;
    http_status: number;
    http_method: string;
    params: any;
    results: Results;
}
