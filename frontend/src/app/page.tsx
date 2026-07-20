"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Category { id: number; name: string; displayOrder: number; }
interface MenuItem { id: number; name: string; description: string; price: string; imageUrl: string; categoryId: number; }
interface SiteSettings { 
  id: number; name: string; logoUrl: string; primaryColor: string; 
  heroTitle: string; heroSubtitle: string; visionTitle: string; visionText: string; visionChefName: string; ctaTitle: string; ctaText: string; 
}

// Helper to stagger words
const StaggeredText = ({ text, className }: { text: string, className: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: horizontalScrollRef,
  });
  
  // Transform scroll Y into scroll X for the horizontal section
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]); // Adjust -75% depending on number of items

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5092/api/categories").then(res => res.json()),
      fetch("http://localhost:5092/api/menuitems").then(res => res.json()),
      fetch("http://localhost:5092/api/settings").then(res => res.json())
    ]).then(([cats, items, sets]) => {
      setCategories(cats);
      setMenuItems(items);
      setSettings(sets);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const signatureDishes = menuItems.filter(item => item.imageUrl).slice(0, 4);
  const filteredMenu = activeCategoryId ? menuItems.filter(item => item.categoryId === activeCategoryId) : menuItems;
  const siteName = settings?.name || "L'Etoile";

  return (
    <main className="bg-black text-white min-h-screen overflow-hidden selection:bg-accent selection:text-black">
      
      {/* 1. Cinematic Hero with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="object-cover w-full h-full opacity-60 scale-105"
            style={{ filter: "brightness(0.4) contrast(1.2)" }}
          >
            {/* Free high-quality culinary placeholder video */}
            <source src="https://cdn.pixabay.com/video/2021/08/18/85499-591745499_large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-4 md:px-12 flex flex-col items-center text-center mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-8"
          >
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-20 md:h-28 mx-auto" />
            ) : (
              <h2 className="uppercase tracking-[0.6em] text-accent text-sm md:text-base font-bold drop-shadow-2xl">{siteName}</h2>
            )}
          </motion.div>
          
          {/* Staggered Title */}
          <div className="overflow-hidden mb-6 py-4">
             <StaggeredText 
               text={settings?.heroTitle || "A Symphony <br/> of <span class='italic font-light text-accent'>Flavors</span>"} 
               className="text-6xl md:text-8xl lg:text-[10rem] font-serif leading-[0.9] tracking-tighter" 
             />
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
            className="text-gray-300 text-lg md:text-2xl font-light max-w-2xl mt-4"
          >
            {settings?.heroSubtitle || "Experience the pinnacle of culinary artistry."}
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/50"
        >
          <span className="uppercase tracking-[0.3em] text-[10px]">Scroll to Discover</span>
          <div className="w-[1px] h-16 bg-white/20 overflow-hidden relative">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-accent"
            />
          </div>
        </motion.div>
      </section>

      {/* 2. The Vision - Split Screen Avant-Garde */}
      <section className="relative py-32 md:py-48 px-4 md:px-12 bg-black">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 relative z-10">
            <motion.h3 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
              className="text-accent uppercase tracking-[0.4em] text-xs font-bold mb-8"
            >
              The Vision
            </motion.h3>
            
            <StaggeredText 
              text={settings?.visionTitle || "Art on a Plate.<br/><span class='italic text-white/50'>Passion in Every Bite.</span>"}
              className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] mb-10"
            />
          </div>

          <div className="lg:col-span-7">
             <motion.div 
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}
                className="prose prose-invert prose-lg max-w-none text-gray-400 font-light leading-relaxed whitespace-pre-wrap"
             >
               {settings?.visionText || `At ${siteName}, dining is not merely a necessity, but an art form that speaks to the soul. We blend carefully selected ingredients from around the world with classical French gastronomy techniques to offer an unforgettable experience.\n\nEvery plate is a reflection of our culinary team's passion and pursuit of perfection.`}
             </motion.div>
             
             <motion.div 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }}
                className="mt-16 flex items-center gap-6 border-t border-white/10 pt-8"
             >
                <div className="w-20 h-20 rounded-full bg-white/5 overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=200&auto=format&fit=crop" alt="Chef" className="w-full h-full object-cover grayscale opacity-80" />
                </div>
                <div>
                  <div className="text-3xl font-serif text-white">{settings?.visionChefName || "Alexander Rossi"}</div>
                  <div className="text-accent text-xs tracking-widest uppercase mt-2">Executive Chef</div>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Horizontal Scroll Hijack - Signature Dishes */}
      {signatureDishes.length > 0 && (
        <section ref={horizontalScrollRef} className="relative h-[300vh] bg-black hidden md:block">
          <div className="sticky top-0 h-screen flex items-center overflow-hidden">
            
            <div className="absolute top-12 left-12 z-20">
              <h2 className="text-4xl font-serif uppercase tracking-widest text-white/20">Signature Collection</h2>
            </div>

            <motion.div style={{ x }} className="flex gap-16 px-[10vw]">
              {signatureDishes.map((dish, idx) => (
                <div key={dish.id} className="relative w-[60vw] max-w-[800px] h-[70vh] flex-shrink-0 group">
                  <div className="absolute inset-0 bg-white/5 overflow-hidden rounded-sm">
                    <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100 group-hover:scale-105" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-12 left-12">
                    <div className="text-accent font-serif text-2xl mb-4 italic">0{idx + 1}</div>
                    <h3 className="text-6xl md:text-7xl font-serif text-white mb-4 uppercase leading-none">{dish.name}</h3>
                    <p className="text-xl text-gray-300 max-w-lg font-light mb-6 line-clamp-2">{dish.description}</p>
                    <div className="text-3xl text-accent font-light">{dish.price}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Mobile fallback for signature dishes */}
      {signatureDishes.length > 0 && (
        <section className="py-24 px-4 bg-black md:hidden">
          <h2 className="text-3xl font-serif text-accent mb-12 text-center italic">Signature Collection</h2>
          <div className="space-y-16">
            {signatureDishes.map((dish, idx) => (
               <div key={dish.id} className="relative aspect-[3/4] overflow-hidden group">
                  <img src={dish.imageUrl} alt={dish.name} className="absolute inset-0 w-full h-full object-cover opacity-70 grayscale" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-4xl font-serif text-white mb-2">{dish.name}</h3>
                    <div className="text-2xl text-accent font-light">{dish.price}</div>
                  </div>
               </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Minimalist Menu Grid */}
      <section className="py-32 md:py-48 px-4 md:px-12 max-w-[1600px] mx-auto bg-black">
        <div className="mb-20 flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/10 pb-12">
           <h2 className="text-6xl md:text-8xl font-serif text-white tracking-tighter">La Carte</h2>
           
           <div className="flex gap-6 flex-wrap interactive">
              <button
                onClick={() => setActiveCategoryId(null)}
                className={`text-sm uppercase tracking-widest transition-colors ${activeCategoryId === null ? 'text-accent' : 'text-gray-500 hover:text-white'}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`text-sm uppercase tracking-widest transition-colors ${activeCategoryId === cat.id ? 'text-accent' : 'text-gray-500 hover:text-white'}`}
                >
                  {cat.name}
                </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
           {filteredMenu.map((dish, idx) => (
              <motion.div 
                key={dish.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (idx % 2) * 0.1, duration: 0.8 }}
                className="group relative block interactive"
              >
                 <div className="flex justify-between items-baseline border-b border-white/5 pb-4 mb-4">
                    <h4 className="text-3xl font-serif text-white group-hover:text-accent transition-colors duration-500">{dish.name}</h4>
                    <span className="text-2xl text-accent/80 font-light pl-4">{dish.price}</span>
                 </div>
                 <p className="text-gray-500 font-light max-w-md">{dish.description}</p>
              </motion.div>
           ))}
        </div>
      </section>

      {/* 5. Giant CTA */}
      <section className="py-48 px-4 relative overflow-hidden bg-black flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale" />
        
        <div className="relative z-10 text-center max-w-5xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
            <h2 className="text-6xl md:text-[8rem] font-serif text-white leading-[0.85] tracking-tighter mb-12" dangerouslySetInnerHTML={{ __html: settings?.ctaTitle || "Unforgettable <br/><span class='text-accent italic'>Evenings</span>" }}></h2>
            
            <p className="text-xl md:text-3xl font-light text-gray-400 mb-16 max-w-3xl mx-auto">
              {settings?.ctaText || "Reserve your table today."}
            </p>
            
            <Button size="lg" className="rounded-none border border-accent bg-transparent text-accent hover:bg-accent hover:text-black uppercase tracking-[0.3em] px-16 py-8 text-sm transition-all duration-500 interactive">
              Make a Reservation
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black pt-32 pb-16 px-4 md:px-12 border-t border-white/10">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2">
            <h2 className="text-5xl font-serif text-white mb-6 uppercase tracking-tighter">{siteName}</h2>
            <p className="text-gray-500 font-light max-w-sm">{settings?.address || "123 Culinary Avenue, Gourmet District"}</p>
          </div>
          <div>
            <h4 className="text-accent uppercase tracking-[0.2em] text-xs font-bold mb-6">Contact</h4>
            <div className="text-gray-400 font-light space-y-2">
              <p>Reservations: {settings?.phone || "+1 (555) 0123-456"}</p>
              <p>Email: info@letoile.com</p>
            </div>
          </div>
          <div>
            <h4 className="text-accent uppercase tracking-[0.2em] text-xs font-bold mb-6">Socials</h4>
            <div className="flex flex-col gap-2 text-gray-400 font-light">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-600 text-xs tracking-widest uppercase border-t border-white/5 pt-8">
           <div> {new Date().getFullYear()} {siteName}. All Rights Reserved.</div>
           <div className="mt-4 md:mt-0">Designed by Antigravity</div>
        </div>
      </footer>
    </main>
  );
}
