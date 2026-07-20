"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";

interface Category { id: number; name: string; displayOrder: number; }
interface MenuItem { id: number; name: string; description: string; price: string; imageUrl: string; categoryId: number; }
interface SiteSettings { id: number; name: string; logoUrl: string; primaryColor: string; }

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroScale = useTransform(scrollY, [0, 1000], [1, 1.1]);
  const opacityFade = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, itemRes, setRes] = await Promise.all([
          fetch("http://localhost:5092/api/categories"),
          fetch("http://localhost:5092/api/menu-items"),
          fetch("http://localhost:5092/api/settings")
        ]);
        setCategories(await catRes.json());
        setMenuItems(await itemRes.json());
        if(setRes.ok) setSettings(await setRes.json());
        setLoading(false);
      } catch (error) {
        console.error("Veri çekilemedi:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredMenu = activeCategoryId 
    ? menuItems.filter(m => m.categoryId === activeCategoryId)
    : menuItems;

  const signatureDishes = menuItems.filter(m => m.imageUrl).slice(0, 3); // Grab top 3 with images

  const scrollToMenu = () => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const siteName = settings?.name || "L'Etoile";

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      
      {/* 1. Dynamic Parallax Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY, scale: heroScale }}
        >
          {/* Lüks bir restoran görseli */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-background" />
        </motion.div>

        <motion.div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center" style={{ opacity: opacityFade }}>
          <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {settings?.logoUrl ? (
               <img src={settings.logoUrl} alt={siteName} className="h-28 md:h-36 mb-8 mx-auto object-contain drop-shadow-2xl" />
            ) : (
               <h2 className="uppercase tracking-[0.4em] text-accent text-sm md:text-base font-semibold mb-6 tracking-widest drop-shadow-lg">{siteName}</h2>
            )}
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-6 leading-none drop-shadow-2xl">
              A Symphony <br className="hidden md:block" /> of <span className="italic font-light text-accent/90">Flavors</span>
            </h1>
            
            <p className="text-gray-300 text-lg md:text-2xl font-light mb-12 max-w-3xl mx-auto drop-shadow-md">
              Experience the pinnacle of culinary artistry, where traditional techniques meet modern innovation.
            </p>

            <Button 
              size="lg" 
              className="rounded-full px-10 py-7 text-lg bg-accent text-black hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
              onClick={scrollToMenu}
            >
              Discover Our Menu
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 z-20 flex flex-col items-center text-white/50 cursor-pointer hover:text-white transition-colors"
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          onClick={scrollToMenu}
        >
          <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* 2. Editorial Chef's Vision */}
      <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl -z-10" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <motion.div 
            className="md:col-span-5 relative h-[600px] rounded-t-full rounded-b-md overflow-hidden border border-white/10"
            initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1000&auto=format&fit=crop')" }} />
          </motion.div>
          
          <motion.div 
            className="md:col-span-7 md:pl-12"
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }}
          >
            <h3 className="text-accent uppercase tracking-[0.3em] text-sm font-semibold mb-4 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-accent inline-block"></span>
              The Vision
            </h3>
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-[1.1] text-white">Art on a Plate. <br/><span className="italic font-light text-white/70">Passion in Every Bite.</span></h2>
            
            <div className="space-y-6 text-gray-400 font-light text-lg leading-relaxed">
              <p>
                At {siteName}, dining is not merely a necessity, but an art form that speaks to the soul. We blend carefully selected ingredients from around the world with classical French gastronomy techniques to offer an unforgettable experience.
              </p>
              <p>
                Every plate is a reflection of our culinary team's passion and pursuit of perfection. We invite you to join us on this unique journey of flavors.
              </p>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=200&auto=format&fit=crop" alt="Chef" className="w-16 h-16 rounded-full object-cover border border-white/20 grayscale" />
              <div>
                <div className="font-serif text-2xl text-white">Alexander Rossi</div>
                <div className="text-accent text-sm tracking-widest uppercase mt-1">Executive Chef</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Signature Dishes (Horizontal Carousel Concept) */}
      {!loading && signatureDishes.length > 0 && (
        <section className="py-24 bg-black/40 border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 text-center">
            <h3 className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-3">Chef's Recommendations</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-white">Signature Dishes</h2>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {signatureDishes.map((dish, i) => (
              <motion.div 
                key={dish.id}
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative h-[450px] rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" style={{ backgroundImage: `url(${dish.imageUrl})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-3xl font-serif text-white mb-2">{dish.name}</h3>
                    <div className="text-accent text-xl font-light">{dish.price}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Full Menu Section */}
      <section id="menu-section" className="py-32 px-4 md:px-8 max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h3 className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-3">Explore Our</h3>
            <h2 className="text-5xl md:text-6xl font-serif text-white">Complete Menu</h2>
            <Separator className="w-24 h-[1px] bg-accent mx-auto mt-8" />
          </motion.div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20 animate-pulse">Menü yükleniyor...</div>
        ) : (
          <>
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <button
                onClick={() => setActiveCategoryId(null)}
                className={`px-8 py-3 rounded-full border transition-all duration-500 text-xs tracking-[0.1em] uppercase ${
                  activeCategoryId === null ? "bg-accent border-accent text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.2)]" : "border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`px-8 py-3 rounded-full border transition-all duration-500 text-xs tracking-[0.1em] uppercase ${
                    activeCategoryId === category.id ? "bg-accent border-accent text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.2)]" : "border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Menu Grid - Premium Glassmorphism Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={activeCategoryId} transition={{ duration: 0.5 }}
            >
              {filteredMenu.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-10">Bu kategoride henüz ürün bulunmuyor.</div>
              ) : (
                filteredMenu.map((dish, index) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="relative h-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/50 transition-all duration-500 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] flex flex-col">
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-transparent transition-all duration-500" />
                      
                      {dish.imageUrl && (
                        <div className="relative h-60 overflow-hidden w-full m-0 p-0 border-b border-white/5">
                          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${dish.imageUrl})` }} />
                          <Badge variant="outline" className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white border-white/20 tracking-wider">
                            {categories.find(c => c.id === dish.categoryId)?.name}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="p-8 flex-grow flex flex-col justify-between relative z-10">
                        <div>
                          <div className="flex justify-between items-start mb-4 gap-4">
                            <h4 className="text-2xl font-serif text-white group-hover:text-accent transition-colors duration-300">{dish.name}</h4>
                            <span className="text-xl text-accent font-light tracking-wide">{dish.price}</span>
                          </div>
                          <p className="text-gray-400 text-sm font-light leading-relaxed">
                            {dish.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </>
        )}
      </section>

      {/* 5. Ambiance & Reservation CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-fixed z-0" />
        
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <h2 className="text-5xl md:text-7xl font-serif text-white mb-8">Unforgettable <br/><span className="text-accent italic">Evenings Await</span></h2>
            <p className="text-gray-300 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto">
              Reserve your table today and immerse yourself in an atmosphere of elegance, warmth, and culinary brilliance.
            </p>
            <Button size="lg" className="rounded-full px-12 py-8 text-xl bg-accent text-black hover:bg-white transition-all duration-500 shadow-[0_0_40px_rgba(212,175,55,0.4)]">
              Book Your Experience
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="uppercase tracking-[0.4em] text-accent text-2xl font-serif mb-6">{siteName}</h2>
          <div className="flex justify-center gap-8 mb-8 text-gray-400 text-sm font-light uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-gray-500 text-sm font-light mb-8">
            {settings?.address || "123 Culinary Avenue, Gourmet District"} <br/>
            Reservations: {settings?.phone || "+1 (555) 0123-456"}
          </p>
          <p className="text-white/20 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} {siteName}. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
