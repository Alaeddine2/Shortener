import { Methods } from "@/constants/enums";
import AppState from "@/hooks/appState";
import { ApiResponse, ApiResponseObject } from "@/interfaces/apiResponce";
import { Url } from "@/interfaces/url";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchUrls = async (): Promise<Url[]> => {
    try {
        const endpoint = `${baseUrl}user/urls`; 
        const appState = AppState.getInstance();
        const fingerprint = await appState.getFingerprint();

        console.log("Fingerprint:", fingerprint);

        const response = await fetch(endpoint, {
            method: Methods.GET,  
            headers: {
                "Content-Type": "application/json",
                "X-Fingerprint": fingerprint, 
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch URLs");
        }

        const result: ApiResponse = await response.json();
        return result.data ?? []; 
    } catch (error) {
        console.error("Error fetching URLs:", error);
        throw error; 
    }
};

export const addUrl = async (longUrl: string, name: string, expiresAt?: Date): Promise<Url> => {
    try {
        const endpoint = `${baseUrl}shorten`;
        const appState = AppState.getInstance();
        const fingerprint = await appState.getFingerprint();
        console.log(expiresAt);
        
        const response = await fetch(endpoint, {
            method: Methods.POST,
            headers: {
                "Content-Type": "application/json",
                "X-Fingerprint": fingerprint,
            },
            body: JSON.stringify({ longUrl, name, expiresAt }),
        });

        if (!response.ok) {
            throw new Error("Failed to add URL");
        }

        const result: ApiResponseObject = await response.json();
        return result.data;
    } catch (error) {
        console.error("Error adding URL:", error);
        throw error;
    }
};

export const updateUrl = async (shortId: string, longUrl: string, name: string, expiresAt?: Date): Promise<Url> => {
    try {
        const endpoint = `${baseUrl}user/urls/${shortId}`;
        const appState = AppState.getInstance();
        const fingerprint = await appState.getFingerprint();

        const response = await fetch(endpoint, {
            method: Methods.PUT,
            headers: {
                "Content-Type": "application/json",
                "X-Fingerprint": fingerprint,
            },
            body: JSON.stringify({ longUrl, name ,expiresAt}),
        });

        if (!response.ok) {
            throw new Error("Failed to update URL");
        }

        const result: ApiResponseObject = await response.json();
        return result.data;
    } catch (error) {
        console.error("Error updating URL:", error);
        throw error;
    }
};
export const deleteUrl = async (shortId: string): Promise<void> => {
    try {
        const endpoint = `${baseUrl}user/urls/${shortId}`;
        const appState = AppState.getInstance();
        const fingerprint = await appState.getFingerprint();

        const response = await fetch(endpoint, {
            method: Methods.DELETE,
            headers: {
                "Content-Type": "application/json",
                "X-Fingerprint": fingerprint,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete URL");
        }
    } catch (error) {
        console.error("Error deleting URL:", error);
        throw error;
    }
};