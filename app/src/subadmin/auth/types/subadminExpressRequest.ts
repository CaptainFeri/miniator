import { Request } from 'express';

export interface SubAdminExpressRequest extends Request {
  subadmin?: any;
}
