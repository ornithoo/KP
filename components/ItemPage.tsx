"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
type Item = {
  id: string;
  nama: string;
  size: string | null;
  image_path: string | null;
  created_at?: string;
};

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return "Terjadi error";
}

function getPublicImageUrl(imagePath: string | null) {
  if (!imagePath) return null;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;

  if (!base || !bucket) return null;

  const encodedPath = imagePath
    .split("/")
    .map((p) => encodeURIComponent(p))
    .join("/");

  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${encodedPath}`;
}

export default function ItemPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async (keyword: string) => {
    setLoading(true);
    setErr("");

    try {
      const res = await fetch(`/api/items?q=${encodeURIComponent(keyword)}`, {
        cache: "no-store",
      });

      const json: { data?: Item[]; error?: string } = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengambil data");

      setItems(json.data || []);
    } catch (e: unknown) {
      setItems([]);
      setErr(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load("");
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q, load]);

  return (
    <main className="min-h-screen w-full bg-white overflow-x-hidden">
      {/* TOP BAR */}
      <header className="w-full bg-orange-400">
        <div className="h-12 flex items-center justify-center">
          <span className="text-base font-semibold">Product & Tools</span>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-center text-3xl font-bold italic tracking-wide">
          PENDATAAN BARANG GUDANG
        </h1>

        {/* SEARCH */}
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-5xl bg-orange-400 rounded-full px-8 py-4 flex items-center shadow-lg">
            <input
              className="w-full bg-transparent placeholder-white/90 text-white outline-none font-bold italic text-lg"
              placeholder="Search Product"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <span className="ml-4 text-white text-2xl select-none">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
          </div>
        </div>
  
        {/* STATUS */}
        <div className="mt-5 text-center text-sm">
          {loading ? (
            <span className="text-gray-700">Loading...</span>
          ) : err ? (
            <span className="text-red-600 font-semibold">Error: {err}</span>
          ) : (
            <span className="text-gray-600">Hasil: {items.length} item</span>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {items.map((it) => {
            const imgUrl = getPublicImageUrl(it.image_path);

            return (
              <div
                key={it.id}
                className="rounded-2xl overflow-hidden shadow-lg border bg-white"
              >
                <div className="bg-slate-900 text-white p-4 text-center">
                  <div className="font-bold italic uppercase text-lg">
                    {it.nama}
                  </div>
                  <div className="text-xs font-semibold opacity-90 mt-1">
                    {it.size || "-"}
                  </div>
                </div>

                <div className="relative h-56 bg-gray-200">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={it.nama}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 font-semibold">
                      FOTO BARANG
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!loading && !err && items.length === 0 ? (
          <div className="mt-10 text-center text-gray-600 font-semibold">
            Barang tidak ditemukan.
          </div>
        ) : null}
      </section>
    </main>
  );
}
