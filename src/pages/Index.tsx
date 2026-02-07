import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Brain, Building2, Mail } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import Testimonials from "@/components/Testimonials";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

const services = [
  {
    icon: Globe,
    title: "Web Design & Development",
    desc: "Corporate, e-commerce, and custom websites built with cutting-edge technology.",
  },
  {
    icon: Brain,
    title: "AI / LLM Solutions",
    desc: "Intelligent AI integrations and custom LLM solutions for your business.",
  },
  {
    icon: Building2,
    title: "Architectural Design",
    desc: "Professional architectural plans, 3D modeling, and visualization.",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* SEO */}
      <title>PixaliumDigital – Premium Digital & Architectural Solutions | Togo</title>
      <meta name="description" content="PixaliumDigital is a premium digital agency in Togo specializing in web design, AI/LLM solutions, and architectural plan design." />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero min-h-[90vh] flex items-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
                🇹🇬 Based in Togo — Serving Africa & Beyond
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Transforming Ideas Into{" "}
                <span className="text-gradient">Digital Reality</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
                We craft stunning websites, integrate intelligent AI solutions, and design
                architectural masterpieces — all under one roof.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-glow"
                >
                  View Services <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-secondary transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-card border border-border/50">
                <img src={heroImage} alt="PixaliumDigital - Digital and architectural innovation" className="w-full h-auto object-cover" />
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Innovation at the intersection of technology and architecture.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading badge="What We Do" title="Our Core Expertise" subtitle="We combine technology and creativity to deliver exceptional results." />
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gradient-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-colors group shadow-card"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <Testimonials />
    </Layout>
  );
}
