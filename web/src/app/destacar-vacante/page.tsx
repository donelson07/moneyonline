"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function DestacarVacantePage() {
  return (
    <Suspense fallback={null}>
      <DestacarVacanteForm />
    </Suspense>
  );
}

function DestacarVacanteForm() {
  const params = useSearchParams();
  const status = params.get("status");
  const [form, setForm] = useState({ company: "", title: "", applyUrl: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar el pago.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Destaca tu vacante remota
      </h1>
      <p className="text-neutral-600 mb-6">
        Tu vacante aparece arriba de todas las demás durante 7 días, marcada
        como <span className="font-medium text-amber-700">★ Destacada</span>.
        Pago único de $49 USD, sin suscripción.
      </p>

      {status === "success" && (
        <p className="mb-6 rounded-md bg-green-50 text-green-700 px-4 py-3 text-sm">
          ¡Pago recibido! Tu vacante se publicará automáticamente en la
          próxima actualización (dentro de 24 horas).
        </p>
      )}
      {status === "cancel" && (
        <p className="mb-6 rounded-md bg-neutral-100 text-neutral-600 px-4 py-3 text-sm">
          Pago cancelado. Puedes intentarlo de nuevo cuando quieras.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm font-medium">
          Empresa
          <input
            required
            className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </label>
        <label className="text-sm font-medium">
          Título del puesto
          <input
            required
            className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label className="text-sm font-medium">
          Enlace para postular
          <input
            required
            type="url"
            placeholder="https://"
            className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2"
            value={form.applyUrl}
            onChange={(e) => setForm({ ...form, applyUrl: e.target.value })}
          />
        </label>
        <label className="text-sm font-medium">
          Correo de contacto
          <input
            required
            type="email"
            className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-medium px-5 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Redirigiendo a pago…" : "Pagar $49 y destacar vacante"}
        </button>
      </form>
    </div>
  );
}
