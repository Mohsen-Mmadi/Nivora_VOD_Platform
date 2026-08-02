import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// کلید متادیتا که بعداً گارد برای خواندن نقش‌ها از آن استفاده می‌کند
export const ROLES_KEY = 'roles';

// دکوراتور سفارشی ما که نقش‌های مجاز را ذخیره می‌کند
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
