import { useState, useCallback } from "react";
import API from "../services/api";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadBox({ setDocuments, refreshDocs, refreshStats }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, uploading, success, error

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setStatus("idle");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/docs/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (setDocuments) setDocuments(prev => [res.data, ...prev]);
      if (refreshDocs) refreshDocs();
      if (refreshStats) refreshStats();

      setStatus("success");
      setTimeout(() => {
        setFile(null);
        setStatus("idle");
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 text-center group ${
          isDragActive ? "bg-blue-50 border-blue-400" : "bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-white"
        }`}
      >
        <input {...getInputProps()} />
        
        <div className={`w-20 h-20 rounded-3xl border border-slate-100 bg-white flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-blue-600 transition-all shadow-sm ${isDragActive ? "scale-110 text-blue-600 shadow-xl" : ""}`}>
           {file ? <FileText size={32} /> : <Upload size={32} />}
        </div>

        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">
            {file ? file.name : (isDragActive ? "Release to Index" : "Index Legal Document")}
          </h3>
          <p className="text-xs text-slate-400 font-medium tracking-tight">
            PDF documents only • Max 10MB
          </p>
        </div>

        {file && status === "idle" && (
           <button 
             onClick={(e) => { e.stopPropagation(); setFile(null); }}
             className="absolute top-4 right-4 p-2 bg-white rounded-full text-slate-400 hover:text-red-500 hover:shadow-lg transition-all"
           >
              <X size={16} />
           </button>
        )}
      </div>

      <AnimatePresence>
        {file && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-6"
          >
            <button
              onClick={(e) => { e.stopPropagation(); handleUpload(); }}
              disabled={status === "uploading" || status === "success"}
              className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.98] ${
                status === "success" 
                  ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                  : status === "error"
                    ? "bg-red-500 text-white shadow-red-500/20"
                    : "bg-slate-900 text-white hover:bg-blue-600 shadow-slate-900/10"
              }`}
            >
              {status === "uploading" ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Initializing Engine
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 size={18} /> Analysis Complete
                </>
              ) : status === "error" ? (
                <>
                  <AlertCircle size={18} /> Engine Error • Retry
                </>
              ) : (
                "Initiate Knowledge Extraction"
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}