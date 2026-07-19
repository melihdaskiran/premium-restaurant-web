"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("http://localhost:5092/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include" // Important for cookies
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Kullanıcı adı veya şifre hatalı.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı. Lütfen API'nin çalıştığından emin olun.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-black/95 text-white">
      <Card className="w-full max-w-md bg-white/5 border-white/10 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-serif text-accent">L'Etoile Admin</CardTitle>
          <CardDescription className="text-gray-400">Yönetim paneline erişmek için giriş yapın.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-md text-sm">{error}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Kullanıcı Adı</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full p-3 bg-black/50 border border-white/10 rounded-md focus:border-accent focus:outline-none transition-colors" 
                placeholder="admin"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Şifre</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 bg-black/50 border border-white/10 rounded-md focus:border-accent focus:outline-none transition-colors" 
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-accent text-black hover:bg-white transition-colors py-6 text-lg">
              Giriş Yap
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
