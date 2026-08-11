import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { error: "کلید تنظیمات الزامی است" },
        { status: 400 }
      );
    }

    // ✨ استفاده از upsert برای ساخت یا ویرایش تنظیمات
    const setting = await prisma.appSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({ success: true, setting });
  } catch (error) {
    console.error("خطا در ذخیره تنظیمات:", error);
    return NextResponse.json(
      { error: "خطا در ذخیره‌سازی تنظیمات در دیتابیس" },
      { status: 500 }
    );
  }
}