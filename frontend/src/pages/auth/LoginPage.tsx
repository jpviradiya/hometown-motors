import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, LogIn, Mail, Lock, Eye, EyeOff, Car, ShieldCheck, CheckCircle2, UserPlus, Sparkles } from "lucide-react";

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
      {/* Left Column: 60% Luxury Automotive Hero Visual with Reduced Image Opacity & Vibrant Gradient Typography */}
      <div className="hidden lg:relative lg:col-span-7 lg:flex flex-col justify-center p-12 xl:p-16 overflow-hidden bg-slate-950">
        {/* High-Resolution Luxury Supercar Background with 40% Opacity */}
        <img
          src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1600&auto=format&fit=crop&q=80"
          alt="Luxury Supercar"
          className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-1000 scale-102"
        />
        {/* Rich Dark Gradient Overlay for Maximum Text Pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40 pointer-events-none" />

        {/* Centered High-Attraction Hero Content */}
        <div className="relative z-10 space-y-6 max-w-2xl text-white my-auto">
          {/* Crisp Pure White Brand Tag Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 text-white border border-white/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-lg backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-white">Luxury Automotive Marketplace</span>
          </div>

          {/* Vibrant Gradient Headline (White to Emerald to Amber - No Black Tones) */}
          <div className="space-y-3">
            <h1 className="text-4xl xl:text-6xl font-black tracking-tight leading-[1.12] text-white">
              Drive Your{" "}
              <span className="bg-gradient-to-r from-white via-emerald-400 to-amber-300 bg-clip-text text-transparent">
                Dream Vehicle.
              </span>
            </h1>
            <p className="text-sm xl:text-base text-slate-300 font-medium leading-relaxed max-w-xl">
              Browse certified luxury inventory, configure options, and complete purchases with complete peace of mind.
            </p>
          </div>

          {/* High-Contrast Feature Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2.5 rounded-2xl bg-slate-900/90 text-white border border-white/20 px-4 py-2 text-xs font-extrabold shadow-xl backdrop-blur-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Secure Authentication</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-2xl bg-slate-900/90 text-white border border-white/20 px-4 py-2 text-xs font-extrabold shadow-xl backdrop-blur-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Premium Inventory</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-2xl bg-slate-900/90 text-white border border-white/20 px-4 py-2 text-xs font-extrabold shadow-xl backdrop-blur-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Transparent Pricing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: 40% Elevated Authentication Card */}
      <div className="col-span-1 lg:col-span-5 flex items-center justify-center p-4 sm:p-8 lg:p-10 bg-muted/15">
        <div className="w-full max-w-md space-y-6">
          {/* Card Container */}
          <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-10 shadow-xl space-y-6 backdrop-blur-xs">
            {/* Header */}
            <div className="space-y-2 text-center">
              <div className="flex justify-center lg:hidden mb-3">
                <div className="p-3.5 rounded-2xl bg-primary text-primary-foreground shadow-xs">
                  <Car className="h-7 w-7" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Sign In
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enter your details to manage purchases and account settings
              </p>
            </div>

            {/* Error Banner */}
            {serverError && (
              <div className="rounded-xl bg-destructive/15 p-3.5 text-xs font-semibold text-destructive border border-destructive/20 animate-in fade-in">
                {serverError}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    className="pl-10 h-12 text-sm rounded-xl"
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
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    className="pl-10 pr-10 h-12 text-sm rounded-xl"
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
                className="w-full cursor-pointer font-bold h-12 rounded-xl shadow-xs transition-all hover:bg-primary/95 text-sm mt-2"
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
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Modern Segmented Switch to Register */}
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">New to Hometown Motors?</span>
                <Link to="/register">
                  <Button variant="outline" size="sm" className="h-9 px-3.5 rounded-lg cursor-pointer font-bold text-xs">
                    <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Encrypted Security Note */}
          <div className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Your information is 256-bit encrypted and securely protected.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
