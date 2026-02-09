import Image from "next/image";

export default function PoweredBySection() {
  return (
    <section className="w-full py-12 bg-[#18181b] flex flex-col items-center">
      <h2 className="text-lg font-semibold tracking-widest text-white mb-6 uppercase">
        Powered by
      </h2>
      <div className="flex flex-row gap-10 items-center justify-center">
        <Image src="/images/digilocker-seeklogo.png" alt="DigiLocker" width={80} height={40} className="object-contain" />
        <Image src="/images/digital-india-logo-png-15.png" alt="Digital India" width={80} height={40} className="object-contain" />
        <Image src="/images/Azure.svg" alt="Azure" width={80} height={40} className="object-contain" />
        <Image src="/images/Cloudflare.svg" alt="Cloudflare" width={80} height={40} className="object-contain" />
      </div>
    </section>
  );
}
