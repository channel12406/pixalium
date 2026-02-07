import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { addNewsletterSubscriber } from "@/lib/firebase";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addNewsletterSubscriber(email);
      setSuccess(true);
      setEmail("");
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error("Error subscribing:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-card rounded-2xl p-8 border border-border/50 shadow-card">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
          Restez informé
        </h3>
        <p className="text-muted-foreground">
          Abonnez-vous à notre newsletter pour recevoir nos dernières offres et actualités
        </p>
      </div>

      {success ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-foreground font-medium">Merci pour votre abonnement !</p>
          <p className="text-sm text-muted-foreground mt-1">
            Vous recevrez bientôt nos prochaines actualités.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Votre adresse email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="votre@email.com"
            />
          </div>
          
          {error && (
            <div className="text-destructive text-sm text-center">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Abonnement en cours...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                S'abonner
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}