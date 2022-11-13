import { Injectable, NotFoundException } from '@nestjs/common';
import AdminTokenPayload from './auth/interface/adminTokenPayload.interface';

@Injectable()
export class SuperadminService {
  constructor() {}

  async findById(payload: AdminTokenPayload) {
    const { adminEmail, adminId } = payload;
    const admin = payload;
    if (!admin) {
      throw new NotFoundException('admin not found');
    }
  }
}
