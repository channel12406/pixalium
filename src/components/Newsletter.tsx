import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { updateRecord } from "@/lib/firebase";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    
    try {
      // Enregistrer l'abonné dans Firebase
      await updateRecord(`newsletter/${Date.now()}`, {
        email: email.toLowerCase(),
        subscribedAt: new Date().toISOString()
      });
      
      setSubmitted(true);
      setEmail("");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    } finally {
      setLoading(false);
    }
  };
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-card rounded-2xl p-8 border border-border/50 text-center shadow-card"
      >
        <Mail className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Merci de votre inscription !
        </h3>
        <p className="text-muted-foreground text-sm">
          Vous recevrez bientôt nos dernières actualités et offres.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-card rounded-2xl p-8 border border-border/50 shadow-card"
    >
      <div className="text-center mb-6">
        <Mail className="w-10 h-10 text-primary mx-auto mb-3" />
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Restez informé
        </h3>
        <p className="text-muted-foreground text-sm">
          Inscrivez-vous à notre newsletter pour recevoir nos actualités et offres spéciales.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Envoi...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Envoyer
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}