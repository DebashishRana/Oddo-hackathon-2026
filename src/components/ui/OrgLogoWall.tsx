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
      <h2 className="text-center text-blue-200 text-base mb-12 tracking-widest uppercase font-medium">
        also seen and featured at
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 lg:gap-16">
        {orgLogos.map((logo, idx) => (
          <Image
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            width={[0, 1].includes(idx) ? 210 : 180}
            height={[0, 1].includes(idx) ? 90 : 72}
            className={[0, 1].includes(idx) ? "h-24 w-auto object-contain" : "h-16 md:h-[72px] w-auto object-contain"}
            style={[0, 1, 2].includes(idx) ? undefined : { filter: 'brightness(0) invert(1)' }}
          />
        ))}
      </div>
    </section>
  );
}
