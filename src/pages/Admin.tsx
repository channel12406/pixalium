import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Package, MessageSquare, Image, BarChart3, Trash2, Eye, CheckCircle, XCircle, Plus, Send, Megaphone, X } from "lucide-react";
import Layout from "@/components/Layout";
import {
  adminLogin, adminLogout, onAuthChange,
  subscribeToRecords, updateRecord, deleteRecord, addPortfolioProject, addProduct, addDownloadCode,
  type Order, type ContactMessage, type PortfolioProject, type Product, type DownloadCode,
} from "@/lib/firebase";
import { sendNewsletter } from "@/lib/emailService";
import type { User } from "firebase/auth";

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

type Tab = "stats" | "orders" | "contacts" | "portfolio" | "testimonials" | "newsletter" | "promo" | "products" | "downloadCodes";

interface PortfolioForm {
  title: string;
  description: string;
  category: string;
  images: string[];
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

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

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminLogin(email, password);
      onLogin();
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-card rounded-2xl p-8 border border-border/50 shadow-card w-full max-w-md space-y-4"
      >
        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-2">Admin Access</h2>
        <p className="text-muted-foreground text-sm text-center mb-4">Connectez-vous pour accéder au tableau de bord.</p>
        {error && <p className="text-destructive text-sm text-center">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </motion.form>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Package }) {
  return (
    <div className="bg-gradient-card rounded-xl p-6 border border-border/50 shadow-card">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function AddPortfolioForm({ onAdd }: { onAdd: () => void }) {
  const [formData, setFormData] = useState<PortfolioForm>({
    title: "",
    description: "",
    category: "",
    images: [""],
  });
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addPortfolioProject({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        images: formData.images.filter(img => img.trim() !== ""),
        createdAt: new Date().toISOString(),
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        images: [""],
      });
      
      onAdd(); // Refresh the portfolio list
    } catch (error) {
      console.error("Error adding project:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };
  
  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };
  
  const updateImageField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img),
    }));
  };
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card mb-8"
    >
      <h3 className="font-display text-xl font-bold text-foreground mb-6">Ajouter un projet au portfolio</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Titre du projet</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={inputClass}
            placeholder="Ex: Site e-commerce pour restaurant"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={`${inputClass} min-h-[100px]`}
            placeholder="Décrivez le projet en détail..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className={inputClass}
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            <option value="Web Design">Web Design</option>
            <option value="Développement Web">Développement Web</option>
            <option value="Application Mobile">Application Mobile</option>
            <option value="Design Graphique">Design Graphique</option>
            <option value="Architecture">Architecture</option>
            <option value="IA / LLM">IA / LLM</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">Images (URLs)</label>
            <button
              type="button"
              onClick={addImageField}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs"
            >
              <Plus className="w-3 h-3" /> Ajouter
            </button>
          </div>
          
          <div className="space-y-2">
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => updateImageField(index, e.target.value)}
                  className={inputClass}
                  placeholder="https://exemple.com/image.jpg"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="px-3 py-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Ajout en cours..." : "Ajouter le projet"}
        </button>
      </div>
    </motion.form>
  );
}

interface ProductForm {
  name: string;
  desc: string;
  price: string;
  category: string;
  images: string[];
  isSourceCode: boolean;
}

function AddProductForm({ onAdd }: { onAdd: () => void }) {
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    desc: "",
    price: "",
    category: "Web",
    images: ["", ""],
    isSourceCode: false,
  });
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addProduct({
        name: formData.name,
        desc: formData.desc,
        price: formData.price,
        category: formData.category,
        images: formData.images.filter(img => img.trim() !== ""),
        isSourceCode: formData.isSourceCode,
      });
      
      // Reset form
      setFormData({
        name: "",
        desc: "",
        price: "",
        category: "Web",
        images: ["", ""],
        isSourceCode: false,
      });
      
      onAdd(); // Refresh the products list
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card mb-8"
    >
      <h3 className="font-display text-xl font-bold text-foreground mb-6">Ajouter un produit à la boutique</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nom du produit</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={inputClass}
            placeholder="Ex: Site Web de l'entreprise"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <textarea
            value={formData.desc}
            onChange={(e) => setFormData(prev => ({ ...prev, desc: e.target.value }))}
            className={`${inputClass} min-h-[100px]`}
            placeholder="Décrivez le produit en détail..."
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Prix</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className={inputClass}
              placeholder="Ex: 25 000 FCFA"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className={inputClass}
              required
            >
              <option value="Web">Web</option>
              <option value="IA">IA</option>
              <option value="Architecture">Architecture</option>
              <option value="Mobile">Mobile</option>
              <option value="Graphisme">Graphisme</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Images (URLs)</label>
          <div className="space-y-2">
            {formData.images.map((image, index) => (
              <input
                key={index}
                type="url"
                value={image}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  images: prev.images.map((img, i) => i === index ? e.target.value : img)
                }))}
                className={inputClass}
                placeholder={`URL de l'image ${index + 1} (Ex: https://exemple.com/image.jpg)`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isSourceCode}
              onChange={(e) => setFormData(prev => ({ ...prev, isSourceCode: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm text-foreground">Ce produit est un code source téléchargeable</span>
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Ajout en cours..." : "Ajouter le produit"}
        </button>
      </div>
    </motion.form>
  );
}

interface DownloadCodeForm {
  fileName: string;
  filePath: string;
  expiresAt: string;
  file?: File;
}

function AddDownloadCodeForm({ onAdd }: { onAdd: () => void }) {
  const [formData, setFormData] = useState<DownloadCodeForm>({
    fileName: "",
    filePath: "",
    expiresAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const inputClass = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        file: file,
        fileName: file.name, // Auto-populate filename
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);
    
    try {
      let filePath = formData.filePath;
      
      // If a file is provided, upload it to Firebase Storage
      if (formData.file) {
        // For now, we'll just use the external URL approach since we need to implement the upload properly
        // In a real scenario, we would upload the file to Firebase Storage here
        console.log("File to upload:", formData.file);
        filePath = formData.filePath; // Keep the URL approach for now
      }
      
      // Generate a random code
      const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      await addDownloadCode({
        code: randomCode,
        fileName: formData.fileName,
        filePath: filePath,
        expiresAt: formData.expiresAt || undefined,
      });
      
      // Reset form
      setFormData({
        fileName: "",
        filePath: "",
        expiresAt: "",
      });
      
      onAdd(); // Refresh the download codes list
    } catch (error) {
      console.error("Error adding download code:", error);
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card mb-8"
    >
      <h3 className="font-display text-xl font-bold text-foreground mb-6">Générer un code de téléchargement</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nom du fichier</label>
          <input
            type="text"
            value={formData.fileName}
            onChange={(e) => setFormData(prev => ({ ...prev, fileName: e.target.value }))}
            className={inputClass}
            placeholder="Ex: template-ecommerce.zip"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Sélectionnez un fichier</label>
          <input
            type="file"
            accept=".zip,.rar,.tar,.gz,.7z,application/zip,application/x-rar-compressed,application/x-7z-compressed"
            onChange={handleFileChange}
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
          {formData.file && (
            <p className="text-xs text-muted-foreground mt-2">Fichier sélectionné: {formData.file.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Ou entrez l'URL du fichier</label>
          <input
            type="url"
            value={formData.filePath}
            onChange={(e) => setFormData(prev => ({ ...prev, filePath: e.target.value }))}
            className={inputClass}
            placeholder="Ex: https://example.com/files/template-ecommerce.zip"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date d'expiration (optionnel)</label>
          <input
            type="datetime-local"
            value={formData.expiresAt}
            onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
            className={inputClass}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Génération en cours..." : "Générer un code"}
        </button>
      </div>
    </motion.form>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>("stats");
  const [orders, setOrders] = useState<(Order & { id: string })[]>([]);
  const [contacts, setContacts] = useState<(ContactMessage & { id: string })[]>([]);
  const [portfolio, setPortfolio] = useState<(PortfolioProject & { id: string })[]>([]);
  const [testimonials, setTestimonials] = useState<(Testimonial & { id: string })[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [promos, setPromos] = useState<PromoConfig[]>([]);
  const [products, setProducts] = useState<(Product & { id: string })[]>([]);
  const [downloadCodes, setDownloadCodes] = useState<(DownloadCode & { id: string })[]>([]);
  const [expandedImage, setExpandedImage] = useState<{src: string, alt: string} | null>(null);
  
  // Pour l'envoi de newsletter
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterContent, setNewsletterContent] = useState("");
  const [sending, setSending] = useState(false);
  
  // Pour la gestion de promo
  const [promoForm, setPromoForm] = useState<Omit<PromoConfig, 'id' | 'createdAt'>>({ 
    title: "", 
    subtitle: "", 
    code: "", 
    discount: 15, 
    endDate: "", 
    isActive: true 
  });

  useEffect(() => {
    const unsub = onAuthChange(setUser);
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub1 = subscribeToRecords<Order>("orders", setOrders);
    const unsub2 = subscribeToRecords<ContactMessage>("contacts", setContacts);
    const unsub3 = subscribeToRecords<PortfolioProject>("portfolio", setPortfolio);
    const unsub4 = subscribeToRecords<Testimonial>("testimonials", setTestimonials);
    const unsub5 = subscribeToRecords<NewsletterSubscriber>("newsletter", setSubscribers);
    const unsub6 = subscribeToRecords<PromoConfig>("promos", setPromos);
    const unsub7 = subscribeToRecords<Product>("products", setProducts);
    const unsub8 = subscribeToRecords<DownloadCode>("downloadCodes", setDownloadCodes);
    return () => { unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); unsub6(); unsub7(); unsub8(); };
  }, [user]);

  if (user === undefined) {
    return <Layout><div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">Chargement...</p></div></Layout>;
  }

  if (!user) {
    return <Layout><AdminLogin onLogin={() => {}} /></Layout>;
  }

  const handleLogout = async () => {
    await adminLogout();
    navigate("/");
  };
  
  // Fonctions pour la newsletter
  const handleSendNewsletter = async () => {
    if (!newsletterSubject || !newsletterContent || subscribers.length === 0) return;
    
    setSending(true);
    try {
      // Get all subscriber emails
      const recipientEmails = subscribers.map(sub => sub.email);
      
      // Send the newsletter
      const success = await sendNewsletter({
        subject: newsletterSubject,
        content: newsletterContent,
        recipients: recipientEmails
      });
      
      if (success) {
        // Enregistrer l'envoi
        await updateRecord(`newsletter_history/${Date.now()}`, {
          subject: newsletterSubject,
          content: newsletterContent,
          sentAt: new Date().toISOString(),
          recipientsCount: subscribers.length
        });
        
        // Réinitialiser le formulaire
        setNewsletterSubject("");
        setNewsletterContent("");
      }
      
    } catch (error) {
      console.error("Erreur d'envoi:", error);
    } finally {
      setSending(false);
    }
  };
  
  // Fonctions pour les promos
  const handleCreatePromo = async () => {
    if (!promoForm.title || !promoForm.code) return;
    
    try {
      await updateRecord(`promos/${Date.now()}`, {
        ...promoForm,
        createdAt: new Date().toISOString()
      });
      
      // Réinitialiser le formulaire
      setPromoForm({ 
        title: "", 
        subtitle: "", 
        code: "", 
        discount: 15, 
        endDate: "", 
        isActive: true 
      });
      
    } catch (error) {
      console.error("Erreur création promo:", error);
    }
  };
  
  const handleTogglePromo = async (promoId: string, currentStatus: boolean) => {
    try {
      await updateRecord(`promos/${promoId}`, { isActive: !currentStatus });
    } catch (error) {
      console.error("Erreur activation/désactivation:", error);
    }
  };
  const tabs: { key: Tab; label: string; icon: typeof Package }[] = [
    { key: "stats", label: "Statistiques", icon: BarChart3 },
    { key: "orders", label: "Commandes", icon: Package },
    { key: "contacts", label: "Messages", icon: MessageSquare },
    { key: "portfolio", label: "Portfolio", icon: Image },
    { key: "testimonials", label: "Témoignages", icon: MessageSquare },
    { key: "newsletter", label: "Newsletter", icon: Send },
    { key: "promo", label: "Promotions", icon: Megaphone },
    { key: "products", label: "Produits", icon: Package },
    { key: "downloadCodes", label: "Codes Téléchargement", icon: Package },
  ];

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const unreadContacts = contacts.filter((c) => !c.read).length;

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">Tableau de bord</h1>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  tab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          {tab === "stats" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Commandes" value={orders.length} icon={Package} />
              <StatCard label="En attente" value={pendingOrders} icon={Package} />
              <StatCard label="Messages" value={contacts.length} icon={MessageSquare} />
              <StatCard label="Non lus" value={unreadContacts} icon={MessageSquare} />
            </div>
          )}

          {/* Orders */}
          {tab === "orders" && (
            <div className="space-y-3">
              {orders.length === 0 && <p className="text-muted-foreground text-center py-12">Aucune commande.</p>}
              {orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((o) => (
                <div key={o.id} className="bg-gradient-card rounded-xl p-5 border border-border/50 shadow-card flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{o.productName}</h3>
                    <p className="text-muted-foreground text-sm">{o.price} × {o.quantity}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={o.status}
                      onChange={(e) => updateRecord(`orders/${o.id}`, { status: e.target.value })}
                      className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="completed">Terminée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                    <button onClick={() => deleteRecord(`orders/${o.id}`)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contacts */}
          {tab === "contacts" && (
            <div className="space-y-3">
              {contacts.length === 0 && <p className="text-muted-foreground text-center py-12">Aucun message.</p>}
              {contacts.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((c) => (
                <div key={c.id} className={`bg-gradient-card rounded-xl p-5 border shadow-card ${c.read ? "border-border/50" : "border-primary/30"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{c.name}</h3>
                        {!c.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{c.email} — {c.service}</p>
                      <p className="text-sm text-muted-foreground mt-2">{c.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!c.read && (
                        <button onClick={() => updateRecord(`contacts/${c.id}`, { read: true })} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="Marquer comme lu">
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => deleteRecord(`contacts/${c.id}`)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Portfolio */}
          {tab === "portfolio" && (
            <div>
              <AddPortfolioForm onAdd={() => {
                // Force refresh by unsubscribing and resubscribing
                const unsub = subscribeToRecords<PortfolioProject>("portfolio", setPortfolio);
                return unsub;
              }} />
              
              <div className="space-y-3">
                {portfolio.length === 0 && <p className="text-muted-foreground text-center py-12">Aucun projet dans le portfolio.</p>}
                {portfolio.map((p) => (
                  <div key={p.id} className="bg-gradient-card rounded-xl p-5 border border-border/50 shadow-card flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{p.title}</h3>
                      <p className="text-xs text-primary font-semibold uppercase">{p.category}</p>
                      <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">Ajouté le: {new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deleteRecord(`portfolio/${p.id}`)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors self-start">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Testimonials */}
          {tab === "testimonials" && (
            <div className="space-y-6">
              <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Témoignages ({testimonials.length})</h3>
                
                {testimonials.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Aucun témoignage reçu.</p>
                ) : (
                  <div className="space-y-4">
                    {testimonials
                      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                      .map((testimonial) => (
                        <div key={testimonial.id} className={`p-5 rounded-xl border ${testimonial.approved ? 'border-green-500/30 bg-green-500/5' : 'border-border/50 bg-secondary/30'}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${testimonial.approved ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                  {testimonial.approved ? 'Approuvé' : 'En attente'}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{testimonial.role} chez {testimonial.company}</p>
                              <p className="text-sm text-muted-foreground mb-2">"{testimonial.content}"</p>
                              <div className="flex items-center gap-2 mb-2">
                                {'★'.repeat(testimonial.rating).split('').map((star, i) => (
                                  <span key={i} className="text-yellow-400">{star}</span>
                                ))}
                                <span className="text-xs text-muted-foreground ml-2">{new Date(testimonial.createdAt).toLocaleDateString('fr-FR')}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateRecord(`testimonials/${testimonial.id}`, { approved: !testimonial.approved })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${testimonial.approved ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                              >
                                {testimonial.approved ? 'Désapprouver' : 'Approuver'}
                              </button>
                              <button 
                                onClick={() => deleteRecord(`testimonials/${testimonial.id}`)}
                                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Products */}
          {tab === "products" && (
            <div>
              <AddProductForm onAdd={() => {
                // Force refresh by unsubscribing and resubscribing
                const unsub = subscribeToRecords<Product>("products", setProducts);
                return unsub;
              }} />
              
              <div className="space-y-3">
                {products.length === 0 && <p className="text-muted-foreground text-center py-12">Aucun produit dans la boutique.</p>}
                {products.map((p) => (
                  <div key={p.id} className="bg-gradient-card rounded-xl p-5 border border-border/50 shadow-card flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{p.name}</h3>
                      <p className="text-xs text-primary font-semibold uppercase">{p.category}</p>
                      <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                      <p className="text-sm font-semibold text-foreground mt-2">{p.price}</p>
                      <div className="mt-2">
                        {p.images && p.images.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {p.images.slice(0, 2).map((img, idx) => (
                              <img 
                                key={idx}
                                src={img} 
                                alt={`${p.name} - Image ${idx + 1}`} 
                                className="w-16 h-16 object-cover rounded border border-border/50 cursor-pointer"
                                onClick={() => setExpandedImage({src: img, alt: `${p.name} - Image ${idx + 1}`})}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Ajouté le: {new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deleteRecord(`products/${p.id}`)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors self-start">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Download Codes */}
          {tab === "downloadCodes" && (
            <div>
              <AddDownloadCodeForm onAdd={() => {
                // Force refresh by unsubscribing and resubscribing
                const unsub = subscribeToRecords<DownloadCode>("downloadCodes", setDownloadCodes);
                return unsub;
              }} />
              
              <div className="space-y-3">
                {downloadCodes.length === 0 && <p className="text-muted-foreground text-center py-12">Aucun code de téléchargement généré.</p>}
                {downloadCodes.map((code) => (
                  <div key={code.id} className="bg-gradient-card rounded-xl p-5 border border-border/50 shadow-card flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{code.fileName}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs font-mono bg-secondary px-2 py-1 rounded">{code.code}</span>
                        <span className={`text-xs px-2 py-1 rounded ${code.isUsed ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-400'}`}>
                          {code.isUsed ? 'Utilisé' : 'Disponible'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 truncate max-w-md">{code.filePath}</p>
                      {code.expiresAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Expire le: {new Date(code.expiresAt).toLocaleString()}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Créé le: {new Date(code.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button onClick={() => deleteRecord(`downloadCodes/${code.id}`)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors self-start">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Newsletter */}
          {tab === "newsletter" && (
            <div className="space-y-6">
              <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Envoyer une newsletter</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Sujet</label>
                    <input
                      type="text"
                      value={newsletterSubject}
                      onChange={(e) => setNewsletterSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="Ex: Nouveaux services disponibles"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Contenu</label>
                    <textarea
                      value={newsletterContent}
                      onChange={(e) => setNewsletterContent(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="Bonjour, nous avons de nouvelles offres exceptionnelles pour vous..."
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Destinataires: <span className="font-semibold text-foreground">{subscribers.length} abonnés</span>
                    </p>
                    <button
                      onClick={handleSendNewsletter}
                      disabled={sending || !newsletterSubject || !newsletterContent}
                      className="px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                    >
                      {sending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Envoyer à tous
                        </>
                      )}
                    </button>
                  </div>
                  
                  {sending && (
                    <div className="text-center text-sm text-muted-foreground mt-2">
                      Envoi des emails en cours... Cela peut prendre quelques minutes.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Abonnés ({subscribers.length})</h3>
                
                {subscribers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Aucun abonné pour le moment.</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {subscribers
                      .sort((a, b) => b.subscribedAt.localeCompare(a.subscribedAt))
                      .map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{sub.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Inscrit le: {new Date(sub.subscribedAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <button 
                            onClick={() => deleteRecord(`newsletter/${sub.id}`)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Promotions */}
          {tab === "promo" && (
            <div className="space-y-6">
              <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Créer une nouvelle promotion</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Titre</label>
                    <input
                      type="text"
                      value={promoForm.title}
                      onChange={(e) => setPromoForm({...promoForm, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="Offre spéciale Noël"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Code promo</label>
                    <input
                      type="text"
                      value={promoForm.code}
                      onChange={(e) => setPromoForm({...promoForm, code: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="NOEL2026"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Réduction (%)</label>
                    <input
                      type="number"
                      value={promoForm.discount}
                      onChange={(e) => setPromoForm({...promoForm, discount: parseInt(e.target.value) || 0})}
                      min="1"
                      max="100"
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Date de fin</label>
                    <input
                      type="date"
                      value={promoForm.endDate}
                      onChange={(e) => setPromoForm({...promoForm, endDate: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Sous-titre</label>
                  <input
                    type="text"
                    value={promoForm.subtitle}
                    onChange={(e) => setPromoForm({...promoForm, subtitle: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="Profitez de -15% sur tous nos services"
                  />
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={promoForm.isActive}
                      onChange={(e) => setPromoForm({...promoForm, isActive: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm text-foreground">Activer immédiatement</span>
                  </label>
                  
                  <button
                    onClick={handleCreatePromo}
                    disabled={!promoForm.title || !promoForm.code}
                    className="px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Créer la promotion
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Promotions actives ({promos.filter(p => p.isActive).length})</h3>
                
                {promos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Aucune promotion créée.</p>
                ) : (
                  <div className="space-y-4">
                    {promos
                      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                      .map((promo) => (
                        <div key={promo.id} className={`p-5 rounded-xl border ${promo.isActive ? 'border-primary/30 bg-primary/5' : 'border-border/50 bg-secondary/30'}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-foreground">{promo.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${promo.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                  {promo.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{promo.subtitle}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="font-mono bg-secondary px-2 py-1 rounded">{promo.code}</span>
                                <span>Réduction: {promo.discount}%</span>
                                <span>Fin: {new Date(promo.endDate).toLocaleDateString('fr-FR')}</span>
                                <span>Créée: {new Date(promo.createdAt).toLocaleDateString('fr-FR')}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleTogglePromo(promo.id, promo.isActive)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${promo.isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                              >
                                {promo.isActive ? 'Désactiver' : 'Activer'}
                              </button>
                              <button 
                                onClick={() => deleteRecord(`promos/${promo.id}`)}
                                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
          )}
          
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
        </div>
      </section>
    </Layout>
  );
}
