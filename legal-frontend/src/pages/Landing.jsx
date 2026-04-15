import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare, 
  Zap, 
  FileText, 
  Lock, 
  ChevronRight,
  Menu,
  X,
  Scale
} from "lucide-react";
import { useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-blue-600 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Scale size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">Legal<span className="text-blue-600">AI</span></span>
          </div>


          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-blue-600 transition-all"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="px-6 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
            >
              Get Started
            </button>
          </div>

          <button className="md:hidden text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200 p-6 flex flex-col gap-4 shadow-xl"
          >
            <button onClick={() => navigate("/login")} className="w-full py-4 text-center font-bold border border-slate-200 rounded-2xl">Sign In</button>
            <button onClick={() => navigate("/register")} className="w-full py-4 text-center font-bold bg-blue-600 text-white rounded-2xl">Start Free Trial</button>
          </motion.div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="pt-24 md:pt-40 pb-16 px-6 overflow-hidden relative text-center lg:text-left">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-blue-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-indigo-100/30 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-6 md:mb-8 border border-blue-100 mx-auto lg:mx-0">
              <Zap size={14} />
              AI-Powered Compliance
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] md:leading-[0.9] mb-6 md:mb-8">
              Navigate <br/>
              <span className="text-blue-600">Legal Complexity</span> <br/>
              With AI.
            </h1>
            <p className="text-base md:text-xl text-slate-500 font-medium mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Break down thousands of pages of legal text in seconds. Get instant summaries, risk analysis, and actionable insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => navigate("/register")}
                className="group w-full sm:w-auto px-8 py-5 bg-blue-600 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-base md:text-lg flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-blue-600/20 active:scale-95"
              >
                Start Analyzing Free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-sm md:max-w-none mx-auto w-full"
          >
            <div className="relative z-10 p-5 md:p-8 glass rounded-[2.5rem] md:rounded-[3rem] border border-white/40 shadow-2xl overflow-hidden flex flex-col">
               <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest">Analysis Engine</div>
               </div>

               <div className="space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="text-blue-600" size={14} />
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest truncate">Master_Service_Agreement.pdf</span>
                    </div>
                    <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-blue-600 h-full" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                        <ShieldCheck className="text-emerald-600 mb-1" size={18} />
                        <span className="block text-[8px] font-black text-emerald-600 uppercase mb-0.5">Risk Score</span>
                        <span className="text-lg font-black text-emerald-700">9.4/10</span>
                     </div>
                     <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl">
                        <Zap className="text-blue-600 animate-pulse" size={18} />
                        <span className="block text-[8px] font-black text-amber-600 uppercase mb-0.5">Complexity</span>
                        <span className="text-lg font-black text-amber-700">High</span>
                     </div>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-2xl text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={12} className="text-blue-400" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">AI Summary</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium leading-normal">
                        This agreement has standard liability caps but contains an unusual termination clause in Section 14.3.
                      </p>
                  </div>
               </div>
            </div>

            {/* DECORATIVE ELEMENTS */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/5 blur-[120px] -z-10" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}