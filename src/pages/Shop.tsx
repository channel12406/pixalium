import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, CheckCircle, X, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { openWhatsApp } from "@/lib/whatsapp";
import { addOrder, subscribeToRecords, type Product } from "@/lib/firebase";

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

export default function Shop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<(Product & { id: string })[]>([]);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{code: string, discount: number} | null>(null);
  const [activePromo, setActivePromo] = useState<PromoConfig | null>(null);
  const [discountMessage, setDiscountMessage] = useState("");
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [expandedImage, setExpandedImage] = useState<{src: string, alt: string} | null>(null);

  useEffect(() => {
    const unsubPromos = subscribeToRecords<PromoConfig>("promos", (promos) => {
      const active = promos.find(p => p.isActive && new Date(p.endDate) > new Date());
      setActivePromo(active || null);
    });
    
    const unsubProducts = subscribeToRecords<Product>("products", setProducts);
    
    return () => {
      unsubPromos();
      unsubProducts();
    };
  }, []);

  const applyDiscountCode = () => {
    if (!activePromo || !discountCode.trim()) {
      setDiscountMessage("Aucun code promotionnel actif ou code invalide.");
      return;
    }

    if (discountCode.toUpperCase() === activePromo.code && activePromo.isActive) {
      setAppliedDiscount({ code: activePromo.code, discount: activePromo.discount });
      setDiscountMessage(`${activePromo.discount}% de réduction appliquée avec succès!`);
    } else {
      setDiscountMessage("Code invalide ou expiré.");
    }

    // Clear the message after 3 seconds
    setTimeout(() => {
      setDiscountMessage("");
    }, 3000);
  };

  const handleOrder = (product: (Product & { id: string })) => {
    const qty = selected[product.id] || 1;
    const originalPrice = product.price;
    
    // Prepare the price info with discount if applicable
    let finalPrice = originalPrice;
    if (appliedDiscount && originalPrice !== "Sur commande") {
      // Extract numeric value from price (assuming format like "10 000 FCFA")
      const priceNum = parseFloat(originalPrice.replace(/[\s\u202F]/g, '').replace(/[^0-9]/g, ''));
      if (!isNaN(priceNum)) {
        const discountedAmount = (priceNum * appliedDiscount.discount) / 100;
        const newPrice = priceNum - discountedAmount;
        finalPrice = `${Math.round(newPrice).toLocaleString('fr-FR')} FCFA`;
      }
    }
    
    addOrder({
      productName: product.name,
      price: finalPrice,
      quantity: qty,
      createdAt: new Date().toISOString(),
      status: "pending",
    }).catch(console.error);
    
    // Check if this is a source code product
    const isSourceCodeProduct = product.isSourceCode === true;
    
    if (isSourceCodeProduct) {
      // Redirect to download page after a short delay to allow order processing
      setTimeout(() => {
        navigate('/download');
      }, 1000);
    } else {
      openWhatsApp(
        `Hello PixaliumDigital!\n\nI'd like to order:\n\nProduct: ${product.name}\nOriginal Price: ${originalPrice}\nFinal Price: ${finalPrice}${appliedDiscount ? ` (${appliedDiscount.discount}% discount with code ${appliedDiscount.code})` : ''}\nQuantity: ${qty}\n\nPlease let me know the next steps. Thank you!`
      );
    }
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading badge="Shop" title="Order Our Services" subtitle="Browse and order directly via WhatsApp." />

          {/* Discount Code Section */}
          {activePromo && (
            <div className="mb-12 bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Offre spéciale: {activePromo.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{activePromo.subtitle}</p>
                  <p className="text-sm font-medium text-primary mt-1">
                    Code: <span className="font-mono bg-secondary px-2 py-1 rounded">{activePromo.code}</span> - {activePromo.discount}% de réduction
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {!showDiscountInput ? (
                    <button 
                      onClick={() => setShowDiscountInput(true)}
                      className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                    >
                      Utiliser ce code
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        placeholder="CODE PROMO"
                        className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm min-w-[150px]"
                      />
                      <button 
                        onClick={applyDiscountCode}
                        className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                      >
                        Appliquer
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {discountMessage && (
                <div className={`mt-4 text-center text-sm ${discountMessage.includes('succès') ? 'text-green-500' : 'text-destructive'}`}>
                  {discountMessage}
                </div>
              )}
              
              {appliedDiscount && (
                <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-green-500 text-center text-sm">
                  ✅ {appliedDiscount.discount}% de réduction activée! Le code {appliedDiscount.code} sera appliqué à vos commandes.
                </div>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-gradient-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all shadow-card flex flex-col"
              >
                <span className="text-xs text-primary font-semibold uppercase tracking-wider">{p.category}</span>
                <h3 className="font-display text-xl font-semibold text-foreground mt-2 mb-2">{p.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{p.desc}</p>
                <div className="mb-4">
                  {p.images && p.images.length > 0 && (
                    <div className="mb-3">
                      <img 
                        src={p.images[0]} 
                        alt={p.name} 
                        className="w-full h-32 object-cover rounded-lg border border-border/50 cursor-pointer"
                        onClick={() => setExpandedImage({src: p.images![0], alt: p.name})}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-2xl font-bold text-gradient mb-4">{p.price}</p>
                <div className="flex items-center gap-3 mb-4">
                  <label className="text-muted-foreground text-sm">Qty:</label>
                  <select
                    value={selected[p.id] || 1}
                    onChange={(e) => setSelected({ ...selected, [p.id]: Number(e.target.value) })}
                    className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOrder(p)}
                    className="flex-1 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Order Now
                  </button>
                  
                  {p.isSourceCode === true && (
                    <button
                      onClick={() => {
                        const message = `Hello PixaliumDigital!\n\nI'm interested in purchasing: ${p.name}\n\nPlease provide me with the validation code to access the download.\n\nThank you!`;
                        window.open(`https://wa.me/22872122191?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm font-semibold hover:bg-primary/10 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> Contact for Code
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Image Modal */}
      {expandedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             onClick={() => setExpandedImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-auto">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
              onClick={(e) => { e.stopPropagation(); setExpandedImage(null); }}
              aria-label="Close image"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={expandedImage.src} 
              alt={expandedImage.alt} 
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
