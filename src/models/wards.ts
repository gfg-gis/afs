import { Districts } from ".";

export interface Wards extends Omit<Districts, "matp"> {
    xaid: string;
}
