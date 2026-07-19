"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Category { id: number; name: string; }
interface MenuItem { id: number; name: string; description: string; price: string; imageUrl: string; categoryId: number; }
interface SiteSettings { id: number; name: string; logoUrl: string; primaryColor: string; }

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"menu" | "settings">("menu");
  
  // Auth state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [pwdMessage, setPwdMessage] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");

  // Data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ id: 1, name: "", logoUrl: "", primaryColor: "#D4AF37" });
  const [settingsMessage, setSettingsMessage] = useState("");
  
  // Modal state
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", imageUrl: "", categoryId: 1 });

  useEffect(() => {
    fetch("http://localhost:5092/api/auth/check", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        setLoading(false);
        fetchData();
      })
      .catch(() => {
        router.push("/admin");
      });
  }, [router]);

  const fetchData = async () => {
    try {
      const [catRes, itemRes, settingsRes] = await Promise.all([
        fetch("http://localhost:5092/api/categories"),
        fetch("http://localhost:5092/api/menu-items"),
        fetch("http://localhost:5092/api/settings")
      ]);
      setCategories(await catRes.json());
      setMenuItems(await itemRes.json());
      if (settingsRes.ok) {
        setSettings(await settingsRes.json());
      }
    } catch (err) {
      console.error("Data fetch error", err);
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5092/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/admin");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage("");
    try {
      const res = await fetch("http://localhost:5092/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok) {
        setPwdMessage("✅ " + data.message);
        setTimeout(() => setShowPasswordModal(false), 2000);
      } else {
        setPwdMessage("❌ " + (data.message || "Hata oluştu"));
      }
    } catch {
      setPwdMessage("❌ Sunucu hatası");
    }
  };

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameMessage("");
    try {
      const res = await fetch("http://localhost:5092/api/auth/change-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newUsername }),
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok) {
        setUsernameMessage("✅ " + data.message);
        setTimeout(() => {
          setShowUsernameModal(false);
          handleLogout();
        }, 2000);
      } else {
        setUsernameMessage("❌ " + (data.message || "Hata oluştu"));
      }
    } catch {
      setUsernameMessage("❌ Sunucu hatası");
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editingItem !== null;
    const url = isEdit ? `http://localhost:5092/api/menu-items/${editingItem.id}` : `http://localhost:5092/api/menu-items`;
    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include"
    });

    setShowItemModal(false);
    fetchData();
  };

  const handleDeleteItem = async (id: number) => {
    if(!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    await fetch(`http://localhost:5092/api/menu-items/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    fetchData();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage("");
    try {
      const res = await fetch("http://localhost:5092/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
        credentials: "include"
      });
      if (res.ok) {
        setSettingsMessage("✅ Ayarlar başarıyla kaydedildi.");
        setTimeout(() => setSettingsMessage(""), 3000);
      } else {
        setSettingsMessage("❌ Kayıt sırasında hata oluştu.");
      }
    } catch {
      setSettingsMessage("❌ Sunucu hatası");
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: "", description: "", price: "", imageUrl: "", categoryId: categories[0]?.id || 1 });
    setShowItemModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description, price: item.price, imageUrl: item.imageUrl || "", categoryId: item.categoryId });
    setShowItemModal(true);
  };

  if (loading) return <div className="p-10 text-center text-white">Yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto text-white pb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif">L'Etoile Yönetim Paneli</h2>
        <div className="flex gap-4">
          <Button variant="outline" className="border-white/20 text-gray-300 hover:text-white" onClick={() => setShowUsernameModal(true)}>
            Kullanıcı Adı Değiştir
          </Button>
          <Button variant="outline" className="border-white/20 text-gray-300 hover:text-white" onClick={() => setShowPasswordModal(true)}>
            Şifre Değiştir
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Button 
          variant={activeTab === "menu" ? "default" : "outline"} 
          className={activeTab === "menu" ? "bg-accent text-black" : "border-white/20"}
          onClick={() => setActiveTab("menu")}
        >
          🍽️ Menü Yönetimi
        </Button>
        <Button 
          variant={activeTab === "settings" ? "default" : "outline"} 
          className={activeTab === "settings" ? "bg-accent text-black" : "border-white/20"}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Site Ayarları
        </Button>
      </div>

      {activeTab === "menu" && (
        <div className="grid gap-6">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Mevcut Menü Öğeleri</CardTitle>
                <CardDescription className="text-gray-400">Veritabanına kayıtlı tüm ürünler ({menuItems.length})</CardDescription>
              </div>
              <Button className="bg-accent text-accent-foreground hover:bg-white hover:text-black" onClick={openAddModal}>
                + Yeni Ürün Ekle
              </Button>
            </CardHeader>
            <CardContent>
              {menuItems.length === 0 ? (
                <p className="text-gray-500 text-sm italic">Henüz menüde hiç ürün yok.</p>
              ) : (
                <div className="space-y-4">
                  {menuItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-4 rounded-lg bg-black/50 border border-white/5">
                      <div className="flex items-center gap-4">
                        {item.imageUrl && (
                          <div className="w-16 h-16 rounded overflow-hidden bg-white/10 shrink-0">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-lg">{item.name}</h4>
                          <p className="text-sm text-gray-400">{item.description}</p>
                          <div className="text-xs text-accent mt-1">Kategori: {categories.find(c => c.id === item.categoryId)?.name || "-"}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-accent font-medium">{item.price}</span>
                        <Button variant="outline" size="sm" className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white" onClick={() => openEditModal(item)}>Düzenle</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>Sil</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="grid gap-6">
          <Card className="bg-white/5 border-white/10 text-white max-w-2xl">
            <CardHeader>
              <CardTitle>Genel Site Ayarları</CardTitle>
              <CardDescription className="text-gray-400">Müşterilerin göreceği restoran adı, logo ve ana tema rengi</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                {settingsMessage && <div className="text-sm p-3 bg-white/5 rounded border border-white/10">{settingsMessage}</div>}
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Restoran (Site) Adı</label>
                  <input required value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="w-full p-2 bg-black border border-white/10 rounded focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Logo URL (İsteğe Bağlı)</label>
                  <input value={settings.logoUrl || ""} onChange={e => setSettings({...settings, logoUrl: e.target.value})} placeholder="https://..." className="w-full p-2 bg-black border border-white/10 rounded focus:border-accent outline-none" />
                  {settings.logoUrl && (
                    <div className="mt-3 p-2 bg-black/50 border border-white/5 inline-block rounded">
                       <img src={settings.logoUrl} alt="Logo Önizleme" className="h-12 object-contain" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Tema Ana Rengi (Accent Color)</label>
                  <div className="flex items-center gap-4">
                    <input type="color" value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} className="h-12 w-24 bg-black border border-white/10 rounded cursor-pointer" />
                    <span className="text-sm font-mono">{settings.primaryColor}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Bu renk sitedeki butonlar, başlık vurguları ve ince detaylarda kullanılacaktır.</p>
                </div>
                <div className="pt-4">
                  <Button type="submit" className="bg-accent text-black hover:bg-white w-full py-6 text-lg">Ayarları Kaydet</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-[#1a1a1a] border-white/10 text-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingItem ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveItem} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Ürün Adı</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 p-2 bg-black border border-white/10 rounded focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Açıklama</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-1 p-2 bg-black border border-white/10 rounded focus:border-accent outline-none" rows={3} />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Fiyat (Örn: $45)</label>
                  <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full mt-1 p-2 bg-black border border-white/10 rounded focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Görsel URL</label>
                  <input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="w-full mt-1 p-2 bg-black border border-white/10 rounded focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Kategori</label>
                  <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: Number(e.target.value)})} className="w-full mt-1 p-2 bg-black border border-white/10 rounded focus:border-accent outline-none">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="ghost" onClick={() => setShowItemModal(false)}>İptal</Button>
                  <Button type="submit" className="bg-accent text-black hover:bg-white">Kaydet</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-[#1a1a1a] border-white/10 text-white">
            <CardHeader>
              <CardTitle>Şifre Değiştir</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {pwdMessage && <div className="text-sm p-2 bg-white/5 rounded border border-white/10">{pwdMessage}</div>}
                <div>
                  <label className="text-sm text-gray-400">Mevcut Şifre</label>
                  <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full mt-1 p-2 bg-black border border-white/10 rounded" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Yeni Şifre</label>
                  <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full mt-1 p-2 bg-black border border-white/10 rounded" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="ghost" onClick={() => setShowPasswordModal(false)}>İptal</Button>
                  <Button type="submit" className="bg-accent text-black hover:bg-white">Kaydet</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-[#1a1a1a] border-white/10 text-white">
            <CardHeader>
              <CardTitle>Kullanıcı Adı Değiştir</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangeUsername} className="space-y-4">
                {usernameMessage && <div className="text-sm p-2 bg-white/5 rounded border border-white/10">{usernameMessage}</div>}
                <div>
                  <label className="text-sm text-gray-400">Güvenlik: Mevcut Şifre</label>
                  <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full mt-1 p-2 bg-black border border-white/10 rounded" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Yeni Kullanıcı Adı</label>
                  <input type="text" required value={newUsername} onChange={e => setNewUsername(e.target.value)} className="w-full mt-1 p-2 bg-black border border-white/10 rounded" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="ghost" onClick={() => setShowUsernameModal(false)}>İptal</Button>
                  <Button type="submit" className="bg-accent text-black hover:bg-white">Kaydet</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
