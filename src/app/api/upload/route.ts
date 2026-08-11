
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// مقداردهی کلاینت سوپابیس (Supabase)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // اگر productId ارسال نشود (مثل زمان آپلود بنر)، پوشه پیش‌فرض general خواهد بود
    const folder = (formData.get("productId") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { error: "فایلی برای آپلود ارسال نشده است" },
        { status: 400 },
      );
    }

    // بررسی نوع فایل
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "فرمت فایل مجاز نیست" },
        { status: 400 },
      );
    }

    // محدودیت ۵ مگابایت
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "حجم فایل بیش از ۵ مگابایت است" },
        { status: 400 },
      );
    }

    // ۱. تبدیل فایل به Buffer برای استفاده ایمن در سرور Node.js
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // تولید نام یکتا با UUID
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${uuidv4()}.${ext}`;
    const path = `${folder}/${filename}`;

    const BUCKET_NAME = "ibazar";

    // ۲. آپلود فایل به صورت Buffer با تعیین دقیق contentType
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, buffer, {
        contentType: file.type, // بسیار مهم برای شناسایی فرمت عکس
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: "خطا در آپلود به سرویس ابری" },
        { status: 500 },
      );
    }

    // دریافت URL عمومی دقیقاً از همان باکت آپلود شده
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    });
  } catch (error) {
    console.error("Upload API catch error:", error);
    return NextResponse.json(
      { error: "خطای داخلی سرور هنگام پردازش فایل" },
      { status: 500 },
    );
  }
}