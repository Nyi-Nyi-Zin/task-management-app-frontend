import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { AuthContext } from "@/contexts/auth-context";
import { loginSchema } from "@/schemas/auth/login.schema";
import { registerSchema } from "@/schemas/auth/register.schema";
import { z } from "zod";
import { useLogin, useRegister } from "@/hooks/useAuth";

// const registerFormSchema = registerSchema
//   .extend({ confirmPassword: z.string() })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords don't match",
//   });

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

interface AuthFormProps {}

export function AuthForm({}: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // get login function from context

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const registerMutation = useRegister();
  const loginMutation = useLogin();

  // LOGIN
  const onLogin = async (data: LoginForm) => {
    try {
      await login({
        email: data.email.trim(),
        password: data.password.trim(),
      });
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.message || "Invalid credentials");
    }
  };

  // REGISTER
  const onRegister = (data: RegisterForm) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Account created successfully!");
        setActiveTab("login");
        registerForm.reset();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Registration failed");
      },
    });
  };

  return (
    <section className="flex items-center justify-center  w-full flex-row h-screen">
      <div className="flex-[1] h-full border-r border-gray-300">
        <img
          src="../../../public/AuthFormBg.png"
          alt="bg_image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="w-full h-full flex flex-[1] items-center flex-col   justify-center  bg-gradient-to-br from-background via-background to-secondary/20 p-4">
        {/* <h1 className="bg-red-500 my-10">Welcome to TaskFlow</h1> */}
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            {/* <CardTitle className="text-2xl">Welcome to TaskFlow</CardTitle> */}
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* LOGIN TAB */}
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      {...loginForm.register("email")}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      {...loginForm.register("password")}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={loginMutation.isPending}>
                    <LogIn className="h-4 w-4" />
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* REGISTER TAB */}
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Name</Label>
                    <Input
                      id="register-name"
                      placeholder="John Doe"
                      {...registerForm.register("name")}
                    />
                    {registerForm.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {registerForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      {...registerForm.register("email")}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      {...registerForm.register("password")}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={registerMutation.isPending}
                  >
                    <UserPlus className="h-4 w-4" />
                    {registerMutation.isPending ? "Creating..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
