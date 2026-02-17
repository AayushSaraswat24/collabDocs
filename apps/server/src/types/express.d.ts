import {Request} from "express";

export interface AuthenticatedRequest extends Request {
    userId: string;
    userName: string | null;
}