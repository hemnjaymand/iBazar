import { NextResponse } from 'next/server';
import { prisma } from "../../../../lib/prisma";

import { Prisma } from '@prisma/client';

// نوع پاسخ API
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: unknown;
}

export async function GET(): Promise<NextResponse<ApiResponse>> {
  // ۱. بررسی وجود DATABASE_URL
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        success: false,
        message: 'متغیر محیطی DATABASE_URL تعریف نشده است',
        error: 'MISSING_ENV_VAR',
      },
      { status: 500 }
    );
  }

  try {
    // ۲. اجرای یک کوئری ساده برای تست اتصال
    const productCount = await prisma.product.count();

    // ۳. تست اتصال به Storage (اختیاری)
    // می‌توانید یک تست ساده برای Storage هم اضافه کنید

    return NextResponse.json({
      success: true,
      message: 'اتصال به Supabase (دیتابیس) برقرار است',
      data: {
        productCount,
        databaseUrl: process.env.DATABASE_URL.replace(
          /:[^:@]+@/,
          ':****@'
        ), // نمایش URL بدون رمز
      },
    });
  } catch (error) {
    // ۴. مدیریت خطاهای Prisma
    let errorMessage = 'خطای ناشناخته در اتصال به دیتابیس';
    let errorCode = 'UNKNOWN_ERROR';
    let details = undefined;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorCode = error.code;
      errorMessage = error.message;

      // خطای احراز هویت (رمز عبور اشتباه)
      if (error.code === 'P1000') {
        errorMessage = 'احراز هویت در دیتابیس ناموفق بود. رمز عبور را بررسی کنید.';
      }
      // خطای اتصال به سرور
      else if (error.code === 'P1001') {
        errorMessage = 'اتصال به سرور دیتابیس ممکن نیست. نشانی یا پورت را بررسی کنید.';
      }
      // خطای دسترسی به دیتابیس
      else if (error.code === 'P1002') {
        errorMessage = 'دسترسی به دیتابیس رد شد. ممکن است IP شما در Supabase محدود شده باشد.';
      }
      details = error.meta;
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      errorCode = 'INIT_ERROR';
      errorMessage = 'خطا در مقداردهی اولیه Prisma: ' + error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('Supabase connection error:', { errorCode, errorMessage, details });

    return NextResponse.json(
      {
        success: false,
        message: 'خطا در اتصال به Supabase',
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? details : undefined,
      },
      { status: 500 }
    );
  }
}