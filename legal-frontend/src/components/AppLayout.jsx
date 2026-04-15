export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-slate-100/30 rounded-full blur-[120px] -z-10" />
      
      <main className="relative z-10 w-full">
        {children}
      </main>
    </div>
  );
}