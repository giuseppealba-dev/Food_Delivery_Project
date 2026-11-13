import { Indirizzo } from "./indirizzo";

export interface IndirizzoResponse {
    success: boolean;
    data?: Indirizzo[];
    message?: string;
}