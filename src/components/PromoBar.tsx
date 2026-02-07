import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Gift, ArrowRight } from "lucide-react";
import { subscribeToRecords } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

interface PromoConfig {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  discount: number;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

interface PromoBarProps {
  onClose: () => void;
}

export default function PromoBar({ onClose }: PromoBarProps) {
  const [activePromo, setActivePromo] = useState<PromoConfig | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToRecords<PromoConfig>("promos", (promos) => {
      const active = promos.find(p => p.isActive && new Date(p.endDate) > new Date());
      setActivePromo(active || null);
    });
    
    return unsubscribe;
  }, []);

  if (!activePromo) return null;

  const handleViewOffer = () => {
    // Close the promo bar and navigate to the shop page
    onClose();
    navigate('/shop');
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      className="fixed top-16 left-0 right-0 z-40 bg-gradient-primary text-primary-foreground py-3 px-4 shadow-lg"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-sm">
              {activePromo.title} ! -{activePromo.discount}% sur tous les services
            </p>
            <p className="text-xs opacity-90">
              Code promo: {activePromo.code} - {activePromo.subtitle}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleViewOffer}
            className="text-xs font-semibold hover:underline inline-flex items-center gap-1"
          >
            Voir l'offre
            <ArrowRight className="w-3 h-3" />
          </button>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}