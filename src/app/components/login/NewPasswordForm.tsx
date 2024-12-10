// components/login/NewPasswordForm.tsx
"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { resetPassword } from "@/app/services/passwordResetService";
import { useRouter } from "next/navigation";
