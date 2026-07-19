export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black/95 text-white">
      {/* Simple Admin Sidebar/Header */}
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center bg-black">
        <h1 className="font-serif tracking-widest text-accent text-xl">L'Etoile Admin</h1>
        <div className="text-sm text-gray-400">Restoran Sahibi Paneli</div>
      </nav>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
