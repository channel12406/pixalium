import { useState } from "react";
import { Star, CheckCircle } from "lucide-react";
import { addTestimonial } from "@/lib/firebase";

interface SubmitTestimonialProps {
  onSubmitted?: () => void;
}

export default function SubmitTestimonial({ onSubmitted }: SubmitTestimonialProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addTestimonial({
        name: formData.name,
        role: formData.role,
        company: formData.company,
        content: formData.content,
        rating: formData.rating,
      });

      setSuccess(true);
      setFormData({
        name: "",
        role: "",
        company: "",
        content: "",
        rating: 5,
      });

      if (onSubmitted) {
        onSubmitted();
      }

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi de votre témoignage. Veuillez réessayer.");
      console.error("Error submitting testimonial:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-card rounded-2xl p-8 border border-border/50 shadow-card mt-12">
      <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">Partagez votre expérience</h3>
      
      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h4 className="text-xl font-semibold text-foreground mb-2">Merci pour votre témoignage !</h4>
          <p className="text-muted-foreground">Votre avis sera examiné et ajouté bientôt.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nom complet *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                placeholder="Votre nom"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Poste/Rôle *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                placeholder="Votre poste"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Entreprise *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="Nom de votre entreprise"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Votre avis *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="Partagez votre expérience avec nos services..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Évaluation *</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= formData.rating ? "text-yellow-400 fill-current" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-muted-foreground">
                {formData.rating} étoile{formData.rating > 1 ? "s" : ""}
              </span>
            </div>
          </div>
          
          {error && (
            <div className="text-destructive text-sm text-center py-2">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Envoi en cours..." : "Soumettre mon témoignage"}
          </button>
        </form>
      )}
    </div>
  );
}