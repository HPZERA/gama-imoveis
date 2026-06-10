"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { encodeCookieValue, decodeCookieValue } from "@/lib/supabase/cookie-encoding";

export async function loginAction(formData: FormData): Promise<void> {
  const email = (formData.get("email") as string).replace(/﻿/g, "").trim();
  const password = (formData.get("password") as string).replace(/﻿/g, "").trim();

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({
            name,
            value: decodeCookieValue(value),
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, encodeCookieValue(value), options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin/dashboard");
}
