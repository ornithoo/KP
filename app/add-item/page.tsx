'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AddItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [nama, setNama] = useState('');
  const [size, setSize] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    let imagePath: string | null = null;

    try {
      // Upload gambar
      if (image) {
        const fileName = `product/${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, image);

        if (uploadError) {
          console.error(uploadError);
          alert('Gagal upload gambar');
          return;
        }

        imagePath = fileName;
      }

      // Insert data (SESUIAI DB)
      const { error } = await supabase.from('items').insert({
        nama,
        size,
        image_path: imagePath,
      });

      if (error) {
        console.error('Insert error:', error);
        alert(error.message);
        return;
      }

      // ✅ sukses → pindah halaman
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Tambah Produk</h1>

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Nama produk"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Size dan harga"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold transition"
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </main>
  );
}
