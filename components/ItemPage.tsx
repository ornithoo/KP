"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faTrash,
  faPen,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

type Item = {
  id: string;
  nama: string;
  size: string | null;
  image_path: string | null;
};

function getPublicImageUrl(imagePath: string | null) {
  if (!imagePath) return null;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;
  if (!base || !bucket) return null;

  return `${base}/storage/v1/object/public/${bucket}/${imagePath}`;
}

export default function ItemPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [editNama, setEditNama] = useState("");
  const [editSize, setEditSize] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/items?q=${encodeURIComponent(q)}`, {
        cache: "no-store",
      });
      const json = await res.json();
      setItems(json.data || []);
    };

    const delay = setTimeout(fetchData, 300);
    return () => clearTimeout(delay);
  }, [q]);

  /* ================= DELETE ================= */
  async function handleDelete(id: string) {
    const ok = confirm("Yakin hapus barang ini?");
    if (!ok) return;

    await supabase.from("items").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  /* ================= UPDATE ================= */
  async function handleUpdate() {
    if (!editItem) return;

    await supabase
      .from("items")
      .update({
        nama: editNama,
        size: editSize,
      })
      .eq("id", editItem.id);

    setEditItem(null);
    setItems((prev) =>
      prev.map((i) =>
        i.id === editItem.id
          ? { ...i, nama: editNama, size: editSize }
          : i
      )
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-orange-400 h-12 flex items-center justify-center font-bold">
        Product & Tools
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-center text-3xl font-bold italic">
          PENDATAAN BARANG GUDANG
        </h1>

        {/* SEARCH */}
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-4xl bg-orange-400 rounded-full px-6 py-3 flex items-center">
            <input
              className="w-full bg-transparent text-white placeholder-white outline-none font-bold italic"
              placeholder="Search Product"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-white ml-4"
            />
          </div>
        </div>

        {/* GRID */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {items.map((it) => {
            const img = getPublicImageUrl(it.image_path);

            return (
              <div
                key={it.id}
                className="rounded-2xl overflow-hidden border shadow-lg bg-white"
              >
                <div className="bg-slate-900 text-white p-4 text-center">
                  <div className="font-bold italic">{it.nama}</div>
                  <div className="text-xs">{it.size || "-"}</div>
                </div>

                <div className="relative h-52 bg-gray-200">
                  {img ? (
                    <Image src={img} alt={it.nama} fill className="object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      NO IMAGE
                    </div>
                  )}
                </div>

                {/* ACTION */}
                <div className="flex justify-between p-4">
                  <button
                    onClick={() => {
                      setEditItem(it);
                      setEditNama(it.nama);
                      setEditSize(it.size || "");
                    }}
                    className="text-blue-600 font-semibold flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faPen} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(it.id)}
                    className="text-red-600 font-semibold flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Barang tidak ditemukan
          </p>
        )}
      </section>

      {/* MODAL EDIT */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">Edit Barang</h2>
              <button onClick={() => setEditItem(null)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <input
              className="w-full border rounded p-2 mb-3"
              value={editNama}
              onChange={(e) => setEditNama(e.target.value)}
              placeholder="Nama Barang"
            />

            <input
              className="w-full border rounded p-2 mb-4"
              value={editSize}
              onChange={(e) => setEditSize(e.target.value)}
              placeholder="Size"
            />

            <button
              onClick={handleUpdate}
              className="w-full bg-orange-400 py-2 rounded font-bold"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
