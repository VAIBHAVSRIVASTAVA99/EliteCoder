"use server"
import { addUser, getUserByEmail, User } from "./db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export interface AuthResult {
  success: boolean;
  message: string;
  user?: { name: string; email: string };
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  const user = await getUserByEmail(email);
  if (user && await bcrypt.compare(password, user.password)) {
    return {
      success: true,
      message: "Login successful!",
      user: { name: user.name, email: user.email },
    };
  }
  return { success: false, message: "Invalid credentials" };
}

export async function signupUser(name: string, email: string, password: string): Promise<AuthResult> {
  const existing = await getUserByEmail(email);
  if (existing) {
    return { success: false, message: "Email already registered" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await addUser({ name, email, password: hashedPassword });
  return {
    success: true,
    message: "Signup successful!",
    user: { name, email },
  };
} 