import { motion } from "framer-motion";
import { Target, Eye, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const values = [
  { icon: Target, title: "Mission", desc: "To empower businesses across Africa with world-class digital solutions and innovative architectural designs that drive growth and make a lasting impact." },
  { icon: Eye, title: "Vision", desc: "To become the leading digital and architectural agency in West Africa, known for excellence, innovation, and transforming how businesses connect with the future." },
  { icon: Heart, title: "Values", desc: "Quality, innovation, reliability, and client-centric service. We believe in building long-term partnerships and delivering beyond expectations." },
];

export default function About() {
  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading badge="About Us" title="Who We Are" subtitle="PixaliumDigital is a premium digital agency based in Lomé, Togo, delivering innovative solutions across Africa." />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <p className="text-muted-foreground leading-relaxed text-lg">
              Founded with a passion for technology and architecture, PixaliumDigital bridges the gap
              between creativity and engineering. Our multidisciplinary team combines expertise in
              web development, artificial intelligence, and architectural design to deliver holistic
              solutions that position our clients at the forefront of their industries.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gradient-card rounded-2xl p-8 border border-border/50 text-center shadow-card"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
