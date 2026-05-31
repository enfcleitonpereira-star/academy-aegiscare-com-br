import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Redefinir senha — Aegis Care Academy" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    setReady(true);
    return () => sub.data.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Senha redefinida.");
      navigate({ to: "/app" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md glass rounded-2xl p-10">
        <h1 className="display text-3xl mb-2">Redefinir senha</h1>
        <p className="text-sm text-muted-foreground mb-6">Defina uma nova senha segura.</p>
        <input
          type="password" required minLength={6}
          placeholder="Nova senha"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-input bg-card text-sm"
        />
        <button disabled={busy || !ready} className="btn-primary w-full justify-center mt-6">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}
