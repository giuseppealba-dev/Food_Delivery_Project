import { Indirizzo } from "./indirizzo";

export interface SingleIndirizzoResponse {
  success: boolean;
  data?: Indirizzo;
  message?: string;
}