import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Download, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { getDownloadCodeByCode, markDownloadCodeAsUsed } from "@/lib/firebase";

export default function DownloadPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");

  const handleDownload = async () => {
    if (!code.trim()) {
      setError("Veuillez entrer un code de téléchargement");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // Look up the download code in Firebase
      const downloadCode = await getDownloadCodeByCode(code.trim());
      
      if (!downloadCode) {
        setError("Code invalide ou déjà utilisé");
        setLoading(false);
        return;
      }

      // Check if code has expired
      if (downloadCode.expiresAt && new Date() > new Date(downloadCode.expiresAt)) {
        setError("Ce code a expiré");
        setLoading(false);
        return;
      }

      // Set file info
      setFileName(downloadCode.fileName);
      setFilePath(downloadCode.filePath);

      // Mark the code as used
      await markDownloadCodeAsUsed(downloadCode.id);
      
      // Trigger download with multiple fallback methods for maximum reliability
      let downloadInitiated = false;
      
      try {
        // Method 1: Direct download using anchor element
        const link = document.createElement("a");
        link.href = downloadCode.filePath;
        link.download = downloadCode.fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        downloadInitiated = true;
        
        // Wait a bit to see if download starts, then try alternative method if needed
        setTimeout(() => {
          if (!downloadInitiated) {
            // Alternative method if browser doesn't trigger download automatically
            window.location.href = downloadCode.filePath;
          }
        }, 1000);
      } catch (err) {
        console.error("Direct download failed, attempting fetch method:", err);
      }
      
      if (!downloadInitiated) {
        // Method 2: Fetch and create blob URL (for cross-origin files)
        try {
          const response = await fetch(downloadCode.filePath, {
            mode: 'cors'
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = downloadCode.fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the blob URL
          URL.revokeObjectURL(blobUrl);
          downloadInitiated = true;
        } catch (fetchErr) {
          console.error("Fetch download method failed:", fetchErr);
          
          // Method 3: Fallback - redirect to file URL
          try {
            window.location.href = downloadCode.filePath;
            downloadInitiated = true;
          } catch (redirectErr) {
            console.error("Redirect method also failed:", redirectErr);
            
            // Method 4: Fallback - open in new tab (may be blocked by popup blockers)
            window.open(downloadCode.filePath, '_blank');
            console.warn("Download opened in new tab. Popup may be blocked by browser.");
          }
        }
      }

      setSuccess(true);
    } catch (err) {
      console.error("Download error:", err);
      setError("Une erreur est survenue lors du téléchargement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-card rounded-2xl p-8 border border-border/50 shadow-card"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Téléchargement sécurisé
                </h2>
                <p className="text-muted-foreground">
                  Entrez votre code de téléchargement pour accéder au fichier
                </p>
              </div>

              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    Téléchargement réussi !
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Votre fichier <strong>{fileName}</strong> a été téléchargé avec succès.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Le téléchargement devrait commencer automatiquement. Si ce n'est pas le cas, vérifiez vos paramètres de navigateur.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Ce code ne peut être utilisé qu'une seule fois.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="download-code" className="block text-sm font-medium text-foreground mb-2">
                      Code de téléchargement
                    </label>
                    <input
                      id="download-code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="Entrez votre code ici"
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="text-destructive text-sm text-center">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleDownload}
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Vérification...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Télécharger le fichier
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}