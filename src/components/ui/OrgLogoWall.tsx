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
    <section className="pt-4 pb-12">
      <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14 lg:gap-16">
        {orgLogos.map((logo, idx) => (
          <Image
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            width={[0, 1].includes(idx) ? 180 : 150}
            height={[0, 1].includes(idx) ? 72 : 60}
            className={[0, 1].includes(idx) ? "h-14 w-auto object-contain" : "h-12 md:h-14 w-auto object-contain"}
            style={idx === 0 ? undefined : { filter: "brightness(0) invert(1)" }}
          />
        ))}
      </div>
    </section>
  );
}
