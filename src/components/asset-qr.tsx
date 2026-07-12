"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function AssetQr({ tag, size = 140 }: { tag: string; size?: number }) {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(tag, {
      width: size,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then((url) => {
        if (active) setSrc(url);
      })
      .catch(() => {
        if (active) setSrc("");
      });
    return () => {
      active = false;
    };
  }, [tag, size]);

  if (!src) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-[var(--af-border)] bg-slate-50 text-xs text-slate-400"
        style={{ width: size, height: size }}
      >
        QR…
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={`QR for ${tag}`} width={size} height={size} className="rounded-xl border border-[var(--af-border)] bg-white p-2" />
  );
}
