import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, UserPlus, Mail, Lock, User, Eye, EyeOff, Car, ShieldCheck, CheckCircle2, Award } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema as any),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const { confirmPassword, ...payload } = data;
      await registerUser(payload);
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed. Please check your details and try again.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 bg-background">
      {/* Left Column: Automotive Hero Visual (Desktop Only) */}
      <div className="hidden lg:relative lg:col-span-6 xl:col-span-7 lg:flex flex-col justify-between p-12 overflow-hidden">
        {/* Hero Background Image */}
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80"
          alt="Luxury Electric Sports Car"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/40" />

        {/* Top Branding Pill */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-black/60 text-white px-4 py-1.5 text-xs font-bold border border-white/20 backdrop-blur-md shadow-lg">
            <Car className="h-4 w-4 text-primary" />
            <span className="tracking-wide">Hometown Motors</span>
          </div>
        </div>

        {/* Center Tagline Showcase */}
        <div className="relative z-10 space-y-4 max-w-xl text-white">
          <div className="inline-flex items-center gap-2 rounded-md bg-primary/20 text-primary border border-primary/30 px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Award className="h-3.5 w-3.5" />
            <span>Join Our Exclusive Network</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight text-white">
            Your Journey to Luxury Starts Here.
          </h1>
          <p className="text-sm xl:text-base text-gray-300 font-medium leading-relaxed">
            Create an account to browse premium vehicles, save favorites, and complete purchases with complete confidence.
          </p>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 flex items-center gap-6 pt-6 border-t border-white/15 text-xs text-gray-300 font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Instant Access</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Transparent Pricing</span>
          </div>
        </div>
      </div>

      {/* Right Column: Registration Form Card */}
      <div className="col-span-1 lg:col-span-6 xl:col-span-5 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-muted/20">
        <div className="w-full max-w-md space-y-6">
          {/* Card Wrapper */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xs">
            {/* Header */}
            <div className="space-y-2 text-center">
              <div className="flex justify-center lg:hidden mb-3">
                <div className="p-3 rounded-2xl bg-primary text-primary-foreground shadow-xs">
                  <Car className="h-7 w-7" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Create Account
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enter your details to register for Hometown Motors
              </p>
            </div>

            {/* Error Banner */}
            {serverError && (
              <div className="rounded-xl bg-destructive/15 p-3.5 text-xs font-semibold text-destructive border border-destructive/20 animate-in fade-in">
                {serverError}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-semibold">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="John"
                      disabled={isSubmitting}
                      className="pl-10 h-11 text-sm rounded-xl"
                      {...register("firstName")}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs font-medium text-destructive mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-semibold">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      disabled={isSubmitting}
                      className="pl-10 h-11 text-sm rounded-xl"
                      {...register("lastName")}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-xs font-medium text-destructive mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className="pl-10 h-11 text-sm rounded-xl"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-medium text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    className="pl-10 pr-10 h-11 text-sm rounded-xl"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    className="pl-10 pr-10 h-11 text-sm rounded-xl"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer font-bold h-11 rounded-xl shadow-xs transition-all hover:bg-primary/95 mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Footer Navigation */}
            <div className="pt-2 text-center text-xs text-muted-foreground border-t">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </div>

          {/* Micro Trust Note */}
          <div className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Protected by Hometown Motors Secure Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
