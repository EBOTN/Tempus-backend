import { Request } from 'express';

export interface ExtendedRequest extends Request{
    userInfo: {
        id: number,
    }
}