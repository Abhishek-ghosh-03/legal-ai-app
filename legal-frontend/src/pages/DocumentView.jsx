import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import AppLayout from "../components/AppLayout";

export default function DocumentView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [summary, setSummary] = useState("");
  const [clauses, setClauses] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [search, setSearch] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [openIndex, setOpenIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [showAddClause, setShowAddClause] = useState(false);
  const [newClause, setNewClause] = useState({
    title: "",
    meaning: ""
  });

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
    try {
      const res = await API.post(`/docs/${id}/query`, { question });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
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
      link.setAttribute("download", "summary.pdf");
      document.body.appendChild(link);
      link.click();
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
  }, [id]);

  return (
    <div className="bg-[#f5f7fb] min-h-screen">
      <AppLayout>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4 md:mb-6 bg-white p-3 md:p-4 rounded-xl shadow">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Back
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-blue-600">
            ⚖️ LegalAI
          </h1>
          <button
            onClick={() => navigate("/dashboard?upload=true")}
            className="border px-3 py-2 rounded text-sm"
          >
            + New
          </button>
        </div>

        {/* 🔥 MOBILE SEARCH OVERLAY */}
        <div className="relative md:hidden mb-4">

          <div className="bg-white p-3 rounded-xl shadow flex items-center gap-2 z-10 relative">
            <input
              placeholder="Search documents..."
              className="flex-1 border p-2 rounded text-sm focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={() => setIsOpen(true)}
            />

            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "▲" : "▼"}
            </button>
          </div>

          <div
            className={`
              absolute left-0 top-full w-full z-50
              transition-all duration-300 ease-in-out
              ${isOpen 
                ? "opacity-100 translate-y-2 pointer-events-auto" 
                : "opacity-0 -translate-y-2 pointer-events-none"}
            `}
          >
            <div className="bg-white rounded-xl shadow-lg p-3 mt-2 max-h-60 overflow-y-auto">

              {filteredDocs.length === 0 && (
                <p className="text-sm text-gray-400">No documents found</p>
              )}

              {filteredDocs.slice(0, 5).map((doc, i) => (
                <div
                  key={doc._id || i}
                  onClick={() => {
                    navigate(`/document/${doc._id}`);
                    setIsOpen(false);
                  }}
                  className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                >
                  <p className="truncate text-sm">
                    {doc.name || "Untitled"}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">

          {/* DESKTOP SIDEBAR */}
          <div className="hidden md:block md:col-span-3 bg-white p-4 rounded-xl shadow-sm">
            <input
              placeholder="Search..."
              className="border p-2 w-full mb-4 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {filteredDocs.slice(0, 3).map((doc, i) => (
              <div key={doc._id || i} onClick={() => navigate(`/document/${doc._id}`)}>
                <SidebarItem
                  title={doc.name || "Untitled"}
                  date={new Date(doc.createdAt).toDateString()}
                  active={doc._id === id}
                />
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="md:col-span-4 bg-white p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-2">📄 Summary</h2>
            <p className="text-sm text-gray-700 mb-4">
              {summary || "Loading..."}
            </p>

            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white w-full py-2 rounded"
            >
              Download
            </button>
          </div>

          {/* CLAUSES */}
          <div className="md:col-span-3 bg-white p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-2">Clauses</h2>

            <div className="space-y-2 max-h-60 md:max-h-[60vh] overflow-y-auto">
              {clauses.map((c, i) => (
                <div
                  key={i}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="border p-3 rounded cursor-pointer"
                >
                  <div className="flex justify-between">
                    <span>{c.title}</span>
                    <span>{openIndex === i ? "▲" : "›"}</span>
                  </div>

                  {openIndex === i && (
                    <p className="text-sm mt-2">{c.meaning}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* QUERY */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h2 className="font-semibold mb-2">Query & Analysis</h2>

              <textarea
                className="border w-full p-2 rounded mb-2"
                placeholder="Type your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />

              <button
                onClick={handleAsk}
                className="bg-blue-600 text-white w-full py-2 rounded"
              >
                Ask
              </button>

              {answer && (
                <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
                  {answer}
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <Stat label="Clauses" value={clauses.length} />
              <Stat label="Read Time" value="4 min" />
            </div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
}

/* COMPONENTS */

function SidebarItem({ title, date, active }) {
  return (
    <div className={`p-3 rounded-lg ${active ? "bg-blue-600 text-white" : "border"}`}>
      <p className="text-sm">{title}</p>
      <p className="text-xs">{date}</p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex justify-between text-sm mb-2">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}