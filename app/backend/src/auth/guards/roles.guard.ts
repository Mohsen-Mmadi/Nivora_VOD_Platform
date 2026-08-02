import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector به ما اجازه می‌دهد متادیتای ست شده توسط دکوراتور @Roles را بخوانیم
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // ۱. خواندن نقش‌های تعریف شده برای روت فعلی
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // بررسی متادیتای متد کنترلر
      context.getClass(),   // بررسی متادیتای خود کلاس کنترلر
    ]);

    // اگر هیچ نقشی برای روت تعریف نشده باشد، یعنی دسترسی عمومی (یا فقط نیاز به لاگین) است
    if (!requiredRoles) {
      return true;
    }

    // ۲. استخراج کاربر از Request (که قبلاً توسط JwtAuthGuard پر شده است)
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('کاربر شناسایی نشد یا وارد نشده است');
    }

    // ۳. بررسی اینکه آیا کاربر حداقل یکی از نقش‌های مورد نیاز را دارد یا خیر
    const hasRole = requiredRoles.includes(user.role);
    
    if (!hasRole) {
      throw new ForbiddenException('شما سطح دسترسی لازم برای این عملیات را ندارید');
    }

    return true;
  }
}
