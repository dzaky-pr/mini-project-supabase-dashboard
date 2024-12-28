/* eslint-disable no-console */
'use server';

import { redirect } from 'next/navigation';

import { createSupbaseServerClient } from '@/lib/supabase';

export async function loginWithEmailAndPassword(data: {
  email: string;
  password: string;
}) {
  const supabase = await createSupbaseServerClient();

  // Login dengan email dan password
  const result = await supabase.auth.signInWithPassword(data);

  // Cek jika ada error dalam result
  if (result.error) {
    throw new Error(result.error.message);
  }

  // Kembalikan hasil dalam format JSON string
  return JSON.stringify(result); // pastikan hasilnya dalam format string
}

export async function signUpWithEmailAndPassword(data: {
  email: string;
  password: string;
  full_name: string;
}) {
  const supabase = await createSupbaseServerClient();

  const result = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_WEB_PATH}/verify-email`,
      data: {
        full_name: data.full_name,
      },
    },
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  // // Jika pendaftaran sukses tapi tidak ada sesi, login pengguna
  // if (!result.data.session) {
  //   const loginResult = await supabase.auth.signInWithPassword({
  //     email: data.email,
  //     password: data.password,
  //   });
  //   if (loginResult.error) {
  //     throw new Error(loginResult.error.message);
  //   }
  //   return JSON.stringify(loginResult); // Mengembalikan hasil login
  // }

  return JSON.stringify(result); // Mengembalikan hasil pendaftaran
}

export async function logout() {
  const supabase = await createSupbaseServerClient();
  await supabase.auth.signOut();
  redirect('/sign-in');
}
