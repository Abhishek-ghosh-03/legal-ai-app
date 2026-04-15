import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import UploadBox from "../components/UploadBox";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Clock, 
  Search,
  Scale,
  Bell,
  User,
  MoreVertical,
  Activity as ActivityIcon,
  ChevronRight,
  TrendingUp,
  Files
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalDocs: 0,
    totalQueries: 0,
    totalSummaries: 0,
    growth: 0
  });

  const location = useLocation();
  const openUpload = new URLSearchParams(location.search).get("upload");
  const uploadRef = useRef(null);

  const fetchStats = async () => {
    try {
      const res = await API.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDocs = async () => {
    try {
      const res = await API.get("/docs");
      setDocuments(res.data.docs || []);
    } catch {
      setDocuments([]);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchDocs();
  }, []);

  useEffect(() => {
    if (openUpload && uploadRef.current) {
      uploadRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [openUpload]);

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white hidden lg:flex flex-col z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
             <Scale size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter">Legal<span className="text-blue-400">AI</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem active icon={<LayoutDashboard size={20} />} title="Overview" to="/dashboard" />
          <SidebarItem icon={<Files size={20} />} title="All Documents" to="/documents" />
          <SidebarItem icon={<BarChart3 size={20} />} title="Analytics" to="/analytics" />
          <SidebarItem icon={<Settings size={20} />} title="Settings" to="/settings" />
        </nav>

        <div className="p-4">
           <div className="bg-slate-800/50 rounded-3xl p-6 border border-white/5">
              <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest mb-2">
                 <Plus size={12} /> Pro Plan
              </div>
              <p className="text-xs text-slate-400 font-medium mb-4 leading-relaxed">Unlock advanced risk analysis and unlimited docs.</p>
              <button className="w-full py-2.5 bg-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Upgrade</button>
           </div>
        </div>

        <div className="p-8 border-t border-white/5">
           <button 
             onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
             }}
             className="flex items-center gap-3 text-slate-400 hover:text-white transition-all font-bold text-sm"
           >
             <LogOut size={18} /> Logout
           </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        
        {/* TOP BAR */}
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-4 bg-slate-100 rounded-2xl px-4 py-2 w-96 border border-slate-200/50 focus-within:bg-white focus-within:border-blue-600 transition-all">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search case files..." className="bg-transparent border-none outline-none text-sm font-bold w-full" />
           </div>

           <div className="flex items-center gap-6">
              <button className="relative w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center transition-all">
                 <Bell size={20} className="text-slate-600" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
              </button>
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-slate-900">Abhishek Ghosh</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Senior Partner</p>
                 </div>
                 <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-black">
                    AG
                 </div>
              </div>
           </div>
        </header>

        {/* CONTENT */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8 flex-1">
           
           <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight">Legal Command Center</h1>
                 <p className="text-slate-500 font-medium">System status optimal. Analysis engine ready.</p>
              </div>
              <button 
                onClick={() => uploadRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                <Plus size={16} /> New Analysis
              </button>
           </header>

           {/* KPi GRID */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<FileText />} title="Active Files" value={stats.totalDocs} trend="+12%" color="blue" />
              <StatCard icon={<TrendingUp />} title="Summaries" value={stats.totalSummaries} trend="+8%" color="emerald" />
              <StatCard icon={<ActivityIcon />} title="Total Queries" value={stats.totalQueries} trend="+5%" color="slate" />
              <StatCard icon={<BarChart3 />} title="Efficiency" value={`${stats.growth}%`} trend="+2.1%" color="amber" />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: RECENT & UPLOAD */}
              <div className="lg:col-span-8 space-y-8">
                 
                 {/* UPLOAD BOX */}
                 <section ref={uploadRef} className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100">
                    <UploadBox 
                      setDocuments={setDocuments}
                      refreshDocs={fetchDocs}
                      refreshStats={fetchStats}
                    />
                 </section>

                 {/* RECENT DOCUMENTS TABLE */}
                 <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                          <Clock className="text-blue-600" size={20} />
                          Recent Case Files
                       </h2>
                       <button className="text-sm font-bold text-blue-600 hover:text-slate-900 transition-colors">See all archives</button>
                    </div>

                    <div className="space-y-4">
                       {documents.length > 0 ? documents.slice(0, 5).map((doc, idx) => (
                         <motion.div 
                           key={doc._id}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: idx * 0.05 }}
                           onClick={() => navigate(`/document/${doc._id}`)}
                           className="group flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:border-blue-200 transition-all cursor-pointer hover:shadow-xl hover:shadow-blue-600/5"
                         >
                            <div className="flex items-center gap-6">
                               <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                                  <FileText size={24} />
                               </div>
                               <div>
                                  <h4 className="font-black text-slate-900 mb-1">{doc.name || "Untitled Document"}</h4>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Modified {new Date(doc.createdAt).toLocaleDateString()}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-12">
                               <div className="hidden sm:block text-right">
                                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest">Processed</span>
                               </div>
                               <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                         </motion.div>
                       )) : (
                         <div className="text-center py-20 px-10 border-2 border-dashed border-slate-100 rounded-3xl">
                            <Files size={32} className="mx-auto text-slate-200 mb-4" />
                            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No documents indexed yet.</p>
                         </div>
                       )}
                    </div>
                 </section>
              </div>

              {/* RIGHT COLUMN: ALERTS & STATS */}
              <aside className="lg:col-span-4 space-y-8">
                  {/* ALERTS */}
                  <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/30 blur-3xl -z-0" />
                     <h2 className="text-lg font-black tracking-tight mb-8 relative z-10 flex items-center gap-3">
                        <Bell size={20} className="text-blue-400" />
                        AI In-Sights
                     </h2>
                     <div className="space-y-6 relative z-10">
                        {[
                          "Potential risk in Section 12.4 of 'MSA.pdf'",
                          "3 documents pending review",
                          "Subscription expires in 4 days"
                        ].map((alert, i) => (
                          <div key={i} className="flex gap-4 group">
                             <div className="w-1 h-auto bg-blue-600 rounded-full group-hover:bg-blue-400 transition-all" />
                             <p className="text-sm text-slate-300 font-medium leading-relaxed group-hover:text-white transition-colors">{alert}</p>
                          </div>
                        ))}
                     </div>
                     <button className="w-full mt-10 py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Clear All Notifications</button>
                  </section>

                  {/* MINI ACTIVITY CARD */}
                  <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                     <div className="flex items-center justify-between mb-8">
                        <h2 className="font-black text-slate-900 tracking-tight">Recent Activity</h2>
                        <MoreVertical size={16} className="text-slate-400" />
                     </div>
                     <div className="space-y-8">
                        {["Uploaded Contract.pdf", "Asked: What is Section 4?", "Summary generated"].map((act, i) => (
                           <div key={i} className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                 <Plus size={14} />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900">{act}</p>
                                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">2 hours ago</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>
              </aside>
           </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, title, active, to }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
        active 
          ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className={`${active ? "text-white" : "text-slate-500 group-hover:text-blue-400"} transition-colors`}>{icon}</span>
      <span className="font-black text-sm uppercase tracking-widest leading-none">{title}</span>
    </Link>
  );
}

function StatCard({ icon, title, value, trend, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100"
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-blue-200 transition-all group">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[color]} group-hover:scale-110 transition-transform`}>
           {icon}
        </div>
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">{trend}</span>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">{value}</h3>
      </div>
    </div>
  );
}