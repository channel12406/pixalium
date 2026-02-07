import { motion } from "framer-motion";
import { Globe, Brain, Building2, Code, ShoppingCart, Cpu } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { openWhatsApp } from "@/lib/whatsapp";
import { addOrder } from "@/lib/firebase";

const services = [
  {
    icon: Globe,
    title: "Site Entreprise",
    desc: "Sites web professionnels et modernes qui renforcent la confiance et la crédibilité de votre entreprise.",
    price: "À partir de 20 000 FCFA",
  },
  {
    icon: Code,
    title: "Application Web",
    desc: "Applications web sur mesure avec des fonctionnalités avancées, tableaux de bord et intégrations.",
    price: "À partir de 25 000 FCFA",
  },
  {
    icon: ShoppingCart,
    title: "Plateforme E-commerce",
    desc: "Boutiques en ligne complètes avec intégration de paiement et gestion d'inventaire.",
    price: "À partir de 55 000 FCFA",
  },
  {
    icon: Brain,
    title: "Intégration IA",
    desc: "Chatbots IA personnalisés, traitement de documents et automatisation intelligente pour votre workflow.",
    price: "À partir de 15 000 FCFA",
  },
  {
    icon: Cpu,
    title: "Développement Solutions IA",
    desc: "Développement complet de produits IA du concept au déploiement et à la montée en charge.",
    price: "Sur devis",
  },
  {
    icon: Building2,
    title: "Plans Architecturaux",
    desc: "Plans architecturaux 2D/3D professionnels, modélisation et visualisation pour vos projets de construction.",
    price: "À partir de 25 000 FCFA",
  },
];

export default function Services() {
  const handleOrder = (title: string, price: string) => {
    addOrder({
      productName: title,
      price,
      quantity: 1,
      createdAt: new Date().toISOString(),
      status: "pending",
    }).catch(console.error);
    openWhatsApp(
      `Hello PixaliumDigital! I'm interested in your "${title}" service. I'd like to get more information and a quote. Thank you!`
    );
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading badge="Services" title="What We Offer" subtitle="Premium digital and architectural services tailored to your needs." />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-gradient-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all group shadow-card flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{s.desc}</p>
                <p className="text-primary font-semibold text-sm mb-4">{s.price}</p>
                <button
                  onClick={() => handleOrder(s.title, s.price)}
                  className="w-full py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Order via WhatsApp
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
