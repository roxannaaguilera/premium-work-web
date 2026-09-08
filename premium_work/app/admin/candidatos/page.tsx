"use client";

import { useState, type FormEvent } from "react";

type Candidate = { id: string; name: string; email: string; phone: string; city: string; years: number; sector: string; companies: string; availability: string; consent_at: string };
export default function CandidatesPage() {
  const [token, setToken] = useState("");
  const [rows, setRows] = useState<Candidate[]>([]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setRows([]); setStatus("");
    const params = new URLSearchParams(new FormData(event.currentTarget) as unknown as Record<string, string>);
    try {
      const response = await fetch(`/api/candidatos?${params}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setRows(result.candidates); setStatus(`${result.candidates.length} candidaturas. Se muestran hasta 200; afina los filtros para acotar los resultados.`);
    } catch (error) { setStatus(error instanceof Error ? error.message : "No se ha podido conectar."); }
    finally { setBusy(false); }
  }
  async function download(id: string) {
    try {
      const response = await fetch(`/api/candidatos/${id}/cv`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error("No se ha podido descargar el CV. Comprueba el acceso.");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a"); link.href = url; link.download = "curriculum.pdf"; link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { setStatus(error instanceof Error ? error.message : "Error de descarga."); }
  }
  const field = "mt-2 w-full rounded-lg border border-[#0B1F3A]/25 bg-white px-3 py-2 font-normal";
  return <main className="min-h-screen bg-[#F8F7F4] px-5 py-12 text-[#0B1F3A]">
    <div className="mx-auto max-w-7xl">
      <a href="/">← Premium Work</a>
      <a href="/admin/clientes" className="ml-6 underline">Clientes y solicitudes</a><h1 className="display mt-8 text-5xl">Candidaturas</h1>
      <div className="mt-8 flex flex-wrap items-end gap-4"><label className="text-sm font-bold">Clave de acceso privado<input type="password" autoComplete="off" value={token} onChange={(event) => { setToken(event.target.value); setRows([]); }} className={field} /></label><button type="button" onClick={() => { setToken(""); setRows([]); setStatus(""); }} className="px-4 py-2 underline">Cerrar acceso</button></div>
      <form onSubmit={search} className="mt-8 grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-sm font-bold">Experiencia mínima<input type="number" min="0" max="80" step="0.5" name="minYears" className={field} /></label>
        <label className="text-sm font-bold">Experiencia máxima<input type="number" min="0" max="80" step="0.5" name="maxYears" className={field} /></label>
        <label className="text-sm font-bold">Sector<input name="sector" maxLength={200} className={field} /></label>
        <label className="text-sm font-bold">Empresa anterior<input name="company" maxLength={200} className={field} /></label>
        <button disabled={busy || !token} className="rounded-full bg-[#0B1F3A] px-6 py-3 text-white disabled:opacity-50">{busy ? "Buscando…" : "Filtrar candidaturas"}</button>
      </form>
      <p role="status" className="my-6 text-sm">{status}</p>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{["Candidato", "Experiencia", "Sector", "Empresas", "Disponibilidad", "CV"].map((label) => <th key={label} scope="col" className="border-b border-[#0B1F3A]/20 p-3">{label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-b border-[#0B1F3A]/10"><td className="p-3"><strong>{row.name}</strong><p>{row.city}</p><p>{row.email}</p><p>{row.phone}</p></td><td className="p-3">{row.years} años</td><td className="p-3">{row.sector}</td><td className="whitespace-pre-wrap p-3">{row.companies}</td><td className="whitespace-pre-wrap p-3">{row.availability}</td><td className="p-3"><button onClick={() => download(row.id)} className="whitespace-nowrap underline">Descargar PDF</button></td></tr>)}</tbody></table></div>
    </div>
  </main>;
}
