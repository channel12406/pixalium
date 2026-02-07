import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SubmitTestimonial from "./SubmitTestimonial";
import { subscribeToRecords } from "@/lib/firebase";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  createdAt: string;
  approved: boolean;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToRecords<Testimonial>("testimonials", (data) => {
      // Only show approved testimonials
      const approved = data.filter(t => t.approved);
      setTestimonials(approved);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
            Témoignages
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez l'expérience de nos clients satisfaits
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement des témoignages...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-card rounded-2xl p-8 border border-border/50 shadow-card hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="border-t border-border/50 pt-6">
                    <h4 className="font-display font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} chez {testimonial.company}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <SubmitTestimonial />
          </>
        )}
      </div>
    </section>
  );
}