import Image from "next/image";

const orgLogos = [
  { src: "/logos/auj.png", alt: "Amity Innovation Incubator" },
  { src: "/logos/edc.png", alt: "EDC IIT Delhi" },
  { src: "/logos/ic.png", alt: "Microsoft Imagine Cup" },
  { src: "/logos/ii.png", alt: "India Innovates" },
  { src: "/logos/sj.png", alt: "SJ Logo" },
  { src: "/logos/xiss.png", alt: "XISS" },
];

export default function OrgLogoWall() {
  return (
    <section className="pt-6 pb-28">
      <h2 className="text-center text-blue-200 text-base mb-8 tracking-widest uppercase font-medium">
        also seen and featured at
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-10">
        {orgLogos.map((logo, idx) => (
          <Image
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            width={[0, 1].includes(idx) ? 180 : 140}
            height={[0, 1].includes(idx) ? 60 : 48}
            className={[0, 1].includes(idx) ? "h-16 w-auto object-contain" : "h-12 w-auto object-contain"}
            style={[1, 2].includes(idx) ? undefined : { filter: 'brightness(0) invert(1)' }}
          />
        ))}
      </div>
    </section>
  );
}
