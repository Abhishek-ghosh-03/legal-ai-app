import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Download, 
  MessageSquare, 
  Scale, 
  Search, 
  Plus, 
  ChevronRight, 
  ChevronDown,
  FileText,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  Send,
  MoreVertical
} from "lucide-react";

export default function DocumentView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [summary, setSummary] = useState("");
  const [clauses, setClauses] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [search, setSearch] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const [openIndex, setOpenIndex] = useState(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const fetchSummary = async () => {
    try {
      const res = await API.get(`/docs/${id}/summary`);
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClauses = async () => {
    try {
      const res = await API.get(`/docs/${id}/clauses`);
      setClauses(res.data.clauses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await API.get("/docs");
      setDocuments(res.data.docs || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setIsAsking(true);
    setAnswer("");
    try {
      const res = await API.post(`/docs/${id}/query`, { question });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("Could not process your query. Please try again.");
    } finally {
      setIsAsking(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await API.get(`/docs/${id}/download-summary`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `analysis-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.name?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchSummary();
    fetchClauses();
    fetchDocuments();
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* TOP HEADER */}
      <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Scale size={16} />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900 hidden sm:block">Legal<span className="text-blue-600">AI</span></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={handleDownload}
               className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
             >
               <Download size={14} /> Export analysis
             </button>
             <button 
               onClick={() => navigate("/dashboard?upload=true")}
               className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all sm:hidden"
             >
               <Plus size={20} />
             </button>
          </div>
        </div>
      </header>

      {/* SEARCH BAR (MOBILE) */}
      <div className="lg:hidden p-4">
        <div className="relative">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search case archives..." 
             className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 font-bold text-sm"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="flex-1 max-w-screen-2xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT ARCHIVE (DESKTOP) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
           <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 h-fit sticky top-28">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <Clock size={14} /> Intelligence Log
              </h3>
              
              <div className="relative mb-6">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Filter cases..." 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all font-bold text-[10px] uppercase tracking-widest"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                {filteredDocs.slice(0, 8).map((doc) => (
                  <button 
                    key={doc._id}
                    onClick={() => navigate(`/document/${doc._id}`)}
                    className={`w-full text-left p-4 rounded-2xl transition-all group flex items-start gap-3 border ${
                      doc._id === id 
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" 
                        : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-100 text-slate-600"
                    }`}
                  >
                    <FileText size={16} className={doc._id === id ? "text-white" : "text-slate-400"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black truncate">{doc.name || "Untitled case"}</p>
                      <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${doc._id === id ? "text-blue-100" : "text-slate-400"}`}>
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
           </div>
        </aside>

        {/* CENTER CONTENT: INSIGHTS & CLAUSES */}
        <main className="lg:col-span-6 space-y-8">
           
           {/* SUMMARY CARD */}
           <motion.section 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <Zap className="text-blue-600" size={24} />
                  Intelligence Brief
                </h2>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  Verified by AI
                </div>
              </div>

              <div className="prose prose-slate prose-sm max-w-none">
                 <p className="text-slate-600 font-medium leading-relaxed italic text-lg mb-8 border-l-4 border-blue-600/20 pl-6">
                   "{summary || "Synthesizing document intelligence... please wait while our engine cross-references legal nodes."}"
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10">
                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-3xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600">
                       <Zap size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence</p>
                       <p className="text-sm font-black text-slate-900">High Accuracy</p>
                    </div>
                 </div>
                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-3xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600">
                       <ShieldCheck size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance</p>
                       <p className="text-sm font-black text-slate-900">Standard Match</p>
                    </div>
                 </div>
              </div>
           </motion.section>

           {/* CLAUSES ACCORDION */}
           <motion.section 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100"
           >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <FileText className="text-slate-600" size={24} />
                  Structural Nodes
                </h2>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{clauses.length} Extractable Entities</span>
              </div>

              <div className="space-y-4">
                {clauses.map((c, i) => (
                  <div 
                    key={i} 
                    className={`rounded-3xl border transition-all ${
                      openIndex === i ? "bg-slate-900 border-slate-900 shadow-xl" : "bg-slate-50 border-slate-100 hover:border-blue-200"
                    }`}
                  >
                    <button 
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="w-full text-left p-6 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                           openIndex === i ? "bg-blue-600 text-white" : "bg-white border border-slate-100 text-slate-400"
                        }`}>
                           {i + 1}
                        </div>
                        <span className={`font-black text-sm uppercase tracking-widest ${openIndex === i ? "text-white" : "text-slate-900"}`}>
                          {c.title}
                        </span>
                      </div>
                      {openIndex === i ? <ChevronDown className="text-blue-400" size={20} /> : <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors" size={20} />}
                    </button>
                    
                    <AnimatePresence>
                      {openIndex === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-8 pt-0 text-slate-400 font-medium text-sm leading-relaxed border-t border-white/5 mt-2">
                             <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                {c.meaning}
                             </div>
                             <div className="mt-4 flex gap-4">
                                <button className="text-[9px] font-black uppercase text-blue-400 tracking-widest hover:text-white transition-colors">Cross Reference</button>
                                <button className="text-[9px] font-black uppercase text-slate-500 tracking-widest hover:text-white transition-colors">Risk Assessment</button>
                             </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
           </motion.section>
        </main>

        {/* RIGHT SIDEBAR: AI CO-PILOT */}
        <aside className="lg:col-span-3 space-y-8">
           <div className="bg-slate-900 rounded-[2rem] shadow-xl border border-white/5 flex flex-col h-[700px] sticky top-28 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white relative">
                       <MessageSquare size={20} />
                       <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                    </div>
                    <div>
                       <h3 className="text-white text-xs font-black uppercase tracking-widest">AI Co-Pilot</h3>
                       <p className="text-[10px] text-emerald-500 font-bold uppercase">Online Now</p>
                    </div>
                 </div>
                 <MoreVertical size={16} className="text-slate-500" />
              </div>

              <div className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar">
                 <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                       <Info size={10} /> System Prompt
                    </p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      "I've indexed this {documents.find(d => d._id === id)?.name || "document"}. Ask me anything about specific clauses or potential liabilities."
                    </p>
                 </div>

                 {answer && (
                   <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="bg-blue-600 rounded-2xl rounded-tr-none p-4 shadow-lg"
                   >
                      <p className="text-white text-xs font-semibold leading-relaxed">
                        {answer}
                      </p>
                      <p className="text-[8px] font-bold text-blue-200 mt-2 text-right">0.8s Latency</p>
                   </motion.div>
                 )}

                 {isAsking && (
                   <div className="flex gap-1.5 p-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-200" />
                   </div>
                 )}
              </div>

              <div className="p-6 bg-slate-950 border-t border-white/5">
                 <div className="relative group">
                    <textarea 
                      placeholder="Ask co-pilot..."
                      rows={2}
                      className="w-full bg-slate-900 text-white rounded-2xl p-4 pr-12 text-xs font-bold outline-none border border-transparent focus:border-blue-600 transition-all resize-none"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                    <button 
                      onClick={handleAsk}
                      disabled={isAsking || !question.trim()}
                      className="absolute bottom-4 right-4 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all disabled:opacity-40"
                    >
                      <Send size={14} />
                    </button>
                 </div>
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
}