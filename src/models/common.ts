type Status = "success" | "error";

export interface Response<T> {
    data: null | T[]; 
    msg: string;
    status: Status;
} 

export type Mode = "horizontal" | "vertical";