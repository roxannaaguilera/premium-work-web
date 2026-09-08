"use client";

import { useRef, useState, type FormEvent } from "react";
import { sectorLabels, serviceLabels } from "@/lib/service-options";

type ClientRequest = { id: string; name: string; company: string; email: string; phone: string | null; city: string; sector: string; service: string; event_date: string | null; staff_count: number | null; budget: number | null; message: string; consent_at: string };
const field = "mt-2 w-full rounded-lg border border-[#0B1F3A]/25 bg-white px-3 py-2 font-normal";
export default function ClientsPage() {
  const [token, setToken] = useState("");
  const [rows, setRows] = useState<ClientRequest[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const filters = useRef(new URLSearchParams());
  const pending = useRef<AbortController | null>(null);
  function clearAccess(value = "") {
    pending.current?.abort(); setToken(value); setRows([]); setTotal(0); setStatus(""); setBusy(false); setPage(1);
  }
  async function search(nextPage: number, params = filters.current) {
    pending.current?.abort();
    const controller = new AbortController(); pending.current = controller;
    setBusy(true); setStatus(""); setRows([]);
    const query = new URLSearchParams(params); query.set("page", String(nextPage));
    try {
      const response = await fetch(`/api/clientes?${query}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: controller.signal });
      const result = await response.json();
      if (controller.signal.aborted) return;
      if (!response.ok) throw new Error(result.error || "No se ha podido consultar.");
      setRows(result.requests); setTotal(result.total); setPage(result.page);
      setStatus(`${result.total} solicitudes encontradas.`);
    } catch (error) {
      if (!controller.signal.aborted) { setTotal(0); setStatus(error instanceof Error ? error.message : "No se ha podido conectar."); }
    } finally { if (!controller.signal.aborted) setBusy(false); }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    new FormData(event.currentTarget).forEach((value, key) => { if (typeof value === "string" && value) params.set(key, value); });
    filters.current = params; void search(1, params);
  }
  return <main className="min-h-screen bg-[#F8F7F4] px-5 py-12 text-[#0B1F3A]"><div className="mx-auto max-w-[1500px]">
    <nav className="flex gap-6"><a href="/">← Premium Work</a><a href="/admin/candidatos" className="underline">Candidaturas</a></nav>
    <h1 className="display mt-8 text-5xl">Clientes y solicitudes</h1>
    <p className="mt-4 text-sm">Consulta las necesidades de cada empresa. Una empresa puede tener varias solicitudes.</p>
    <div className="mt-8 flex flex-wrap items-end gap-4"><label className="text-sm font-bold">Clave de acceso privado<input type="password" autoComplete="off" value={token} onChange={(event) => clearAccess(event.target.value)} className={field} /></label><button onClick={() => clearAccess()} className="px-4 py-2 underline">Cerrar acceso</button></div>
    <form onSubmit={submit} className="mt-8 grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-sm font-bold">Empresa<input name="company" maxLength={200} className={field} /></label>
      <label className="text-sm font-bold">Ciudad<input name="city" maxLength={200} className={field} /></label>
      <label className="text-sm font-bold">Sector<select name="sector" className={field}><option value="">Todos</option>{Object.entries(sectorLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-sm font-bold">Servicio<select name="service" className={field}><option value="">Todos</option>{Object.entries(serviceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-sm font-bold">Evento desde<input type="date" name="dateFrom" className={field} /></label>
      <label className="text-sm font-bold">Evento hasta<input type="date" name="dateTo" className={field} /></label>
      <label className="text-sm font-bold">Personal mínimo<input type="number" min="1" max="10000" name="minStaff" className={field} /></label>
      <label className="text-sm font-bold">Personal máximo<input type="number" min="1" max="10000" name="maxStaff" className={field} /></label>
      <label className="text-sm font-bold">Presupuesto mínimo (€)<input type="number" min="0" max="100000000" step="0.01" name="minBudget" className={field} /></label>
      <label className="text-sm font-bold">Presupuesto máximo (€)<input type="number" min="0" max="100000000" step="0.01" name="maxBudget" className={field} /></label>
      <button disabled={busy || !token} className="rounded-full bg-[#0B1F3A] px-6 py-3 text-white disabled:opacity-50">{busy ? "Buscando…" : "Filtrar solicitudes"}</button>
      <button type="reset" disabled={busy} onClick={() => { filters.current = new URLSearchParams(); if (token) void search(1, filters.current); }} className="px-6 py-3 underline">Limpiar filtros</button>
    </form>
    <p role="status" className="my-6 text-sm">{status}</p>
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{["Empresa y contacto", "Sector y servicio", "Evento", "Personal", "Presupuesto", "Solicitud"].map((label) => <th key={label} scope="col" className="border-b border-[#0B1F3A]/20 p-3">{label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-b border-[#0B1F3A]/10 align-top">
      <td className="p-3"><strong>{row.company}</strong><p>{row.name}</p><p>{row.email}</p><p>{row.phone || "Sin teléfono"}</p></td>
      <td className="p-3">{sectorLabels[row.sector] || row.sector}<p>{serviceLabels[row.service] || row.service}</p></td>
      <td className="p-3">{row.city}<p>{row.event_date ? row.event_date.split("-").reverse().join("/") : "Fecha por definir"}</p></td>
      <td className="p-3">{row.staff_count ?? "Por definir"}</td>
      <td className="p-3">{row.budget === null ? "Por definir" : new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(row.budget)}</td>
      <td className="min-w-64 p-3"><p className="whitespace-pre-wrap break-words">{row.message}</p><p className="mt-3 text-xs text-[#0B1F3A]/65">Recibida: {new Date(row.consent_at).toLocaleDateString("es-ES")}</p></td>
    </tr>)}</tbody></table></div>
    {total > 0 && <div className="mt-6 flex items-center justify-between gap-4"><button disabled={busy || page <= 1} onClick={() => void search(page - 1)} className="px-4 py-2 disabled:opacity-40">← Anterior</button><span className="text-sm">Página {page} de {Math.ceil(total / 50)}</span><button disabled={busy || page * 50 >= total} onClick={() => void search(page + 1)} className="px-4 py-2 disabled:opacity-40">Siguiente →</button></div>}
  </div></main>;
}
