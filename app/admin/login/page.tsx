"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "abcip@admin.com",
      password: "123456",
    },
  });

  const onSubmit = async (formData: LoginForm) => {
    setIsLoading(true);
    try {
      // Faz login no cliente primeiro
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (authData.user && authData.session) {
        console.log("Login successful, session:", authData.session);
        
        // Sincroniza a sessão com o servidor via API route
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Importante: inclui cookies na requisição
          body: JSON.stringify({
            access_token: authData.session.access_token,
            refresh_token: authData.session.refresh_token,
          }),
        });

        console.log("API response status:", response.status, response.statusText);

        if (!response.ok) {
          // Tenta ler o texto da resposta para ver o erro
          const text = await response.text();
          console.error("API error response:", text);
          let errorMessage = "Erro ao sincronizar sessão";
          try {
            const json = JSON.parse(text);
            errorMessage = json.error || errorMessage;
          } catch {
            errorMessage = text || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log("API response:", result);

        toast.success("Login realizado com sucesso!");
        
        // Aguarda um pouco para garantir que os cookies sejam processados
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Força um refresh completo da página
        window.location.href = "/admin";
      } else {
        toast.error("Erro ao fazer login. Sessão não criada.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Erro ao fazer login. Verifique suas credenciais.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Painel Administrativo
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email é obrigatório",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Senha é obrigatória" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-500 text-dark-900 py-3 rounded-lg hover:bg-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

