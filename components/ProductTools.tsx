"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProductTools() {
  return (
    <main className="flex-1 bg-white w-full overflow-x-hidden">
      {/* Header */}
      <header className="w-full bg-orange-400">
        <div className="relative h-12 w-full flex items-center justify-center">
          <div className="absolute left-4 flex items-center">
            <Image
              src="/images/logo ryuu.png"
              alt="Logo"
              width={100}
              height={100}
              priority
            />
          </div>

          <span className="text-lg font-bold italic uppercase tracking-wider">
            Product & Tools
          </span>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="text-center text-xl font-bold italic mb-6">
          PT. RYUU INDUSTRY INDONESIA
        </h1>

        {/* Button */}
        <div className="flex justify-center mb-8">
          <Link
            href="/add-item"
            className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold"
          >
            + Tambah Barang
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-14">
          <div className="md:col-span-2 flex justify-center">
            <BigCard
              title="Product"
              image="/images/produk.png"
              href="/produk"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function BigCard({
  title,
  image,
  href,
}: {
  title: string;
  image: string;
  href: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="w-72 rounded-2xl shadow-lg border overflow-hidden bg-white"
    >
      <div className="bg-slate-900 text-white text-center font-bold italic text-xl py-3">
        {title}
      </div>

      <motion.div
        className="relative h-36"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.35 }}
      >
        <Image src={image} alt={title} fill className="object-cover" />
      </motion.div>

      <div className="py-8 flex justify-center">
        <motion.div whileTap={{ scale: 0.95 }}>
          <Link
            href={href}
            className="bg-orange-400 text-black font-semibold px-6 py-2 rounded-lg shadow hover:opacity-90 inline-flex items-center gap-2"
          >
            More <span className="text-lg">›</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}