"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

interface Category { id: number; name: string; displayOrder: number; }
interface MenuItem { id: number; name: string; description: string; price: string; imageUrl: string; categoryId: number; }

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, itemRes] = await Promise.all([
          fetch("http://localhost:5092/api/categories"),
          fetch("http://localhost:5092/api/menu-items")
        ]);
        const cats = await catRes.json();
        const items = await itemRes.json();
        setCategories(cats);
        setMenuItems(items);
        setLoading(false);
      } catch (error) {
        console.error("Veri çekilemedi:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredMenu = activeCategoryId === null 
    ? menuItems 
    : menuItems.filter(item => item.categoryId === activeCategoryId);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-33898ed1e81b?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-background via-black/40 to-transparent z-10" />

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
            <h2 className="uppercase tracking-[0.3em] text-accent text-sm md:text-base font-semibold mb-4">L'Etoile</h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight">
              A Symphony of <br/> <span className="italic text-accent/90">Flavors</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
              Experience the pinnacle of culinary artistry, where traditional techniques meet modern innovation in an unforgettable atmosphere.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}>
            <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-accent text-accent-foreground hover:bg-white hover:text-black transition-colors duration-300" onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Discover Our Menu
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Chef's Vision / About Us Section */}
      <section className="py-24 px-4 md:px-8 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          className="w-full md:w-1/2 relative h-[500px] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1000&auto=format&fit=crop')" }} />
        </motion.div>
        
        <motion.div className="w-full md:w-1/2 text-white" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
          <h3 className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-3">Chef's Vision</h3>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">Art on a Plate. <br/> Passion in Every Bite.</h2>
          <p className="text-gray-400 font-light leading-relaxed mb-6">
            L'Etoile'de yemek sadece bir ihtiyaç değil, aynı zamanda duygulara hitap eden bir sanattır. Dünyanın dört bir yanından özenle seçilmiş malzemeleri, Fransız gastronomi teknikleriyle harmanlayarak unutulmaz bir deneyim sunuyoruz.
          </p>
          <p className="text-gray-400 font-light leading-relaxed mb-8">
            Her tabak, mutfak ekibimizin tutkusunun ve mükemmeliyet arayışının bir yansımasıdır. Sizi bu eşsiz lezzet yolculuğuna davet ediyoruz.
          </p>
          <div className="font-serif text-2xl italic text-white/80">- Chef Alexander</div>
        </motion.div>
      </section>

      {/* Menu Section */}
      <section id="menu-section" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h3 className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-3">Culinary Masterpieces</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-white">Our Menu</h2>
            <Separator className="w-24 h-1 bg-accent mx-auto mt-6" />
          </motion.div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Menü yükleniyor...</div>
        ) : (
          <>
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <button
                onClick={() => setActiveCategoryId(null)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 text-sm tracking-wide uppercase ${
                  activeCategoryId === null ? "bg-accent border-accent text-black font-semibold" : "border-white/20 text-gray-400 hover:text-white hover:border-white/50"
                }`}
              >
                Tümü
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`px-6 py-2 rounded-full border transition-all duration-300 text-sm tracking-wide uppercase ${
                    activeCategoryId === category.id ? "bg-accent border-accent text-black font-semibold" : "border-white/20 text-gray-400 hover:text-white hover:border-white/50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={activeCategoryId} transition={{ duration: 0.5 }}
            >
              {filteredMenu.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-10">Bu kategoride henüz ürün bulunmuyor.</div>
              ) : (
                filteredMenu.map((dish, index) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <Card className="bg-white/5 border-white/5 hover:border-accent/50 shadow-none overflow-hidden h-full flex flex-col transition-all duration-500">
                      <div className="relative h-64 overflow-hidden mb-4 bg-white/5">
                        {dish.imageUrl ? (
                          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${dish.imageUrl})` }} />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-600">Görsel Yok</div>
                        )}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                        <Badge variant="outline" className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white border-white/20">
                          {categories.find(c => c.id === dish.categoryId)?.name}
                        </Badge>
                      </div>
                      
                      <CardContent className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-3 gap-4">
                            <h4 className="text-xl font-serif text-white group-hover:text-accent transition-colors duration-300">{dish.name}</h4>
                            <span className="text-xl text-accent font-light">{dish.price}</span>
                          </div>
                          <p className="text-gray-400 text-sm font-light leading-relaxed">
                            {dish.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 py-12 text-center mt-20">
        <h2 className="uppercase tracking-[0.3em] text-accent text-xl font-serif mb-4">L'Etoile</h2>
        <p className="text-muted-foreground text-sm font-light">
          123 Culinary Avenue, Gourmet District <br/>
          Reservations: +1 (555) 0123-456
        </p>
        <p className="text-white/20 text-xs mt-8 uppercase tracking-widest">
          © 2026 L'Etoile Restaurant. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
