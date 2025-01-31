import { Methods } from "@/constants/enums";
import AppState from "@/hooks/appState";
import { ApiResponseWithPagination } from "@/interfaces/apiResponce";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export const fetchLogs = async (id : string, currentPage: number): Promise<ApiResponseWithPagination> => {
    try {
        const endpoint = `${baseUrl}logs/${id}?page=${currentPage}&limit=10`;
        const appState = AppState.getInstance();
        const fingerprint = await appState.getFingerprint();
        const response = await fetch(endpoint, {
            method: Methods.GET,
            headers: {
                "Content-Type": "application/json",
                "X-Fingerprint": fingerprint,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch logs");
        }
        const result: ApiResponseWithPagination = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching logs:", error);
        throw error;
    }
}
