import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, LogIn, Mail, Lock, Eye, EyeOff, Car, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await login(data);
      toast.success("Welcome back! Login successful.");
      navigate(from, { replace: true });
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Invalid credentials. Please try again.";
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
          src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1600&auto=format&fit=crop&q=80"
          alt="Luxury Supercar"
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
            <Sparkles className="h-3.5 w-3.5" />
            <span>Luxury Automotive Platform</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight text-white">
            Drive Your Dream Vehicle Today.
          </h1>
          <p className="text-sm xl:text-base text-gray-300 font-medium leading-relaxed">
            Experience engineering excellence, certified vehicle inventory, and instant online purchasing with Hometown Motors.
          </p>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 flex items-center gap-6 pt-6 border-t border-white/15 text-xs text-gray-300 font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>256-bit Encrypted Login</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Verified Inventory</span>
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Form Card */}
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
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enter your credentials to access your account
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
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

              <Button
                type="submit"
                className="w-full cursor-pointer font-bold h-11 rounded-xl shadow-xs transition-all hover:bg-primary/95 mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In to Account
                  </>
                )}
              </Button>
            </form>

            {/* Footer Navigation */}
            <div className="pt-2 text-center text-xs text-muted-foreground border-t">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-bold text-primary hover:underline">
                Create Account
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

export default LoginPage;
