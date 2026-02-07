import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get, remove, update, onValue, type DatabaseReference } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes, deleteObject, type UploadResult } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDpaDlsN8ykE0xQnuqmfBtE3lNsY3hvI6Y",
  authDomain: "pixalium-d7af8.firebaseapp.com",
  databaseURL: "https://pixalium-d7af8-default-rtdb.firebaseio.com",
  projectId: "pixalium-d7af8",
  storageBucket: "pixalium-d7af8.firebasestorage.app",
  messagingSenderId: "610048683654",
  appId: "1:610048683654:web:6091080d5bf0a97a7dab07",
  measurementId: "G-YV3KEZD5W7",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// ── Database helpers ──

export interface Product {
  id?: string;
  name: string;
  desc: string;
  price: string;
  category: string;
  images?: string[];
  isSourceCode?: boolean;
  createdAt: string;
}

export interface DownloadCode {
  id?: string;
  code: string;
  fileName: string;
  filePath: string;
  isUsed: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface Order {
  id?: string;
  productName: string;
  price: string;
  quantity: number;
  customerMessage?: string;
  createdAt: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  service: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface PortfolioProject {
  id?: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  createdAt: string;
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  subscribedAt: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  createdAt: string;
  approved: boolean;
}

export async function addOrder(order: Omit<Order, "id">) {
  const ordersRef = ref(db, "orders");
  return push(ordersRef, order);
}

export async function addContactMessage(msg: Omit<ContactMessage, "id">) {
  const msgsRef = ref(db, "contacts");
  return push(msgsRef, msg);
}

export async function addPortfolioProject(project: Omit<PortfolioProject, "id">) {
  const projectsRef = ref(db, "portfolio");
  return push(projectsRef, project);
}

export async function addNewsletterSubscriber(email: string) {
  const subscribersRef = ref(db, "newsletter");
  return push(subscribersRef, {
    email: email,
    subscribedAt: new Date().toISOString()
  });
}

export async function addTestimonial(testimonial: Omit<Testimonial, "id" | "approved" | "createdAt">) {
  const testimonialsRef = ref(db, "testimonials");
  return push(testimonialsRef, {
    ...testimonial,
    approved: false, // By default, testimonials need approval
    createdAt: new Date().toISOString()
  });
}

export async function addProduct(product: Omit<Product, "id" | "createdAt">) {
  const productsRef = ref(db, "products");
  return push(productsRef, {
    ...product,
    isSourceCode: product.isSourceCode || false,
    createdAt: new Date().toISOString()
  });
}

export async function addDownloadCode(codeInfo: Omit<DownloadCode, "id" | "isUsed" | "createdAt">) {
  const codesRef = ref(db, "downloadCodes");
  return push(codesRef, {
    ...codeInfo,
    isUsed: false,
    createdAt: new Date().toISOString()
  });
}

export async function getDownloadCodeByCode(code: string): Promise<(DownloadCode & { id: string }) | null> {
  const snapshot = await get(ref(db, "downloadCodes"));
  if (!snapshot.exists()) return null;
  
  const data = snapshot.val();
  for (const [id, val] of Object.entries(data)) {
    const codeEntry = { id, ...(val as DownloadCode) };
    if (codeEntry.code === code && !codeEntry.isUsed) {
      // Check if code has expired
      if (codeEntry.expiresAt && new Date() > new Date(codeEntry.expiresAt)) {
        continue; // Skip expired codes
      }
      return codeEntry as DownloadCode & { id: string };
    }
  }
  return null;
}

export async function markDownloadCodeAsUsed(id: string) {
  const recordRef = ref(db, `downloadCodes/${id}`);
  return update(recordRef, { isUsed: true });
}

export async function uploadFile(file: File, folder: string = 'downloads'): Promise<string> {
  const fileRef = storageRef(storage, `${folder}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(fileRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function getFileDownloadUrl(filePath: string): Promise<string> {
  const fileRef = storageRef(storage, filePath);
  return getDownloadURL(fileRef);
}

export async function updateRecord(path: string, data: Record<string, unknown>) {
  const recordRef = ref(db, path);
  return update(recordRef, data);
}

export async function deleteRecord(path: string) {
  const recordRef = ref(db, path);
  return remove(recordRef);
}

export async function getRecords<T>(path: string): Promise<(T & { id: string })[]> {
  const snapshot = await get(ref(db, path));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, val]) => ({ id, ...(val as T) }));
}

export function subscribeToRecords<T>(
  path: string,
  callback: (records: (T & { id: string })[]) => void
): () => void {
  const recordRef = ref(db, path);
  const unsubscribe = onValue(recordRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    const data = snapshot.val();
    const records = Object.entries(data).map(([id, val]) => ({ id, ...(val as T) }));
    callback(records);
  });
  return unsubscribe;
}

// ── Auth helpers ──

export async function adminLogin(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function adminLogout() {
  return signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
