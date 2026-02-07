import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { subscribeToRecords, type PortfolioProject } from "@/lib/firebase";

interface PortfolioProjectWithId extends PortfolioProject {
  id: string;
}

const projects = [
  {
    title: "E-Commerce Platform",
    category: "Web Development",
    desc: "A fully responsive online store with payment integration, inventory management, and real-time analytics dashboard.",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    ],
  },
  {
    title: "AI Customer Assistant",
    category: "AI / LLM",
    desc: "An intelligent chatbot powered by GPT for a telecommunications company, handling thousands of queries daily.",
    images: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
      "https://images.unsplash.com/photo-1531746790095-6c46f1dee867?w=800",
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800",
    ],
  },
  {
    title: "Modern Villa Design",
    category: "Architecture",
    desc: "Complete architectural plan and 3D visualization for a luxury residential villa in Lomé.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7c5a38?w=800",
    ],
  },
  {
    title: "Corporate Dashboard",
    category: "Web Development",
    desc: "Business intelligence dashboard with real-time data visualization and reporting tools.",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
    ],
  },
];

export default function Portfolio() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [projects, setProjects] = useState<PortfolioProjectWithId[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToRecords<PortfolioProject>("portfolio", setProjects);
    return unsubscribe;
  }, []);

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading badge="Portfolio" title="Our Work" subtitle="A selection of projects we're proud of." />

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun projet disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-gradient-card rounded-2xl border border-border/50 overflow-hidden shadow-card"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {p.images.map((img, j) => (
                      <div
                        key={j}
                        onClick={() => setLightbox(img)}
                        className="aspect-video overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={img}
                          alt={`${p.title} - Image ${j + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-primary font-semibold uppercase tracking-wider">{p.category}</span>
                    <h3 className="font-display text-xl font-semibold text-foreground mt-1 mb-2">{p.title}</h3>
                    <p className="text-muted-foreground text-sm">{p.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors">
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={lightbox}
              alt="Full preview"
              className="max-w-full max-h-[85vh] rounded-xl shadow-card object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
