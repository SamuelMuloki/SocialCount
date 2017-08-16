export interface FbResponse {
    fan_count: number;
    id: string;
    error: Error;
}

interface Error {
    code: number;
    fbtrace_id: string;
    message: string;
    type: string;
}