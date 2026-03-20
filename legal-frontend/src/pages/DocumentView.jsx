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


  const handleAddClause = async () => {
    if (!newClause.title.trim()) return;

    try {
      const res = await API.post(`/docs/${id}/clauses`, newClause);

      setClauses((prev) => [...prev, res.data]);

      setNewClause({ title: "", meaning: "" });
      setShowAddClause(false);
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


        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow hover:bg-gray-100"
            >
              Back
            </button>

            <h1 className="text-2xl font-bold text-blue-600">
              Documents
            </h1>
          </div>

          <button
            onClick={() => navigate("/dashboard?upload=true")}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            + New Document
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">


          <div className="col-span-3 bg-white p-4 rounded-xl shadow-sm">
            <input
              placeholder="Search documents..."
              className="border p-2 w-full mb-4 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="space-y-2">
              {filteredDocs.slice(0,3).map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => navigate(`/document/${doc._id}`)}
                >
                  <SidebarItem
                    title={doc.name || "Untitled Document"}
                    date={new Date(doc.createdAt).toDateString()}
                    active={doc._id === id}
                  />
                </div>
              ))}
            </div>
          </div>


          <div className="col-span-4 bg-white p-5 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-2">📄 Summary</h2>

            <p className="text-sm text-gray-700 mb-4">
              {summary || "Loading summary..."}
            </p>

            <button onClick={handleDownload} className="bg-blue-600 text-white w-full py-2 rounded">
              Download Document
            </button>
          </div>


          <div className="col-span-3 bg-white p-5 rounded-xl shadow-sm flex flex-col">
            <h2 className="font-semibold mb-2">Clauses</h2>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {clauses.length === 0 ? (
                <p className="text-sm text-gray-400">No clauses found</p>
              ) : (
                clauses.map((c, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setOpenIndex(openIndex === i ? null : i)
                    }
                    className="border px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{c.title}</span>
                      <span>{openIndex === i ? "▲" : "›"}</span>
                    </div>

                    {openIndex === i && (
                      <p className="text-sm text-gray-600 mt-2">
                        {c.meaning || "No details available"}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>


            <button
              onClick={() => setShowAddClause(!showAddClause)}
              className="mt-4 border w-full py-2 rounded hover:bg-gray-100"
            >
              + Add Clause
            </button>

            {showAddClause && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Clause Title"
                  className="border w-full p-2 rounded"
                  value={newClause.title}
                  onChange={(e) =>
                    setNewClause({ ...newClause, title: e.target.value })
                  }
                />

                <textarea
                  placeholder="Clause Meaning"
                  className="border w-full p-2 rounded"
                  value={newClause.meaning}
                  onChange={(e) =>
                    setNewClause({ ...newClause, meaning: e.target.value })
                  }
                />

                <button
                  onClick={handleAddClause}
                  className="bg-blue-600 text-white w-full py-2 rounded"
                >
                  Save Clause
                </button>
              </div>
            )}
          </div>


          <div className="col-span-2 space-y-4">


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
                Get Answer
              </button>

              {answer && (
                <div className="mt-3 text-sm bg-gray-100 p-2 rounded">
                  {answer}
                </div>
              )}
            </div>


            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h2 className="font-semibold mb-3">Quick Stats</h2>

              <Stat label="Total Clauses" value={clauses.length} color="text-blue-600" />
              <Stat label="Word Count" value="1245" color="text-purple-600" />
              <Stat label="Read Time" value="4 min" color="text-green-600" />
            </div>

          </div>
        </div>
      </AppLayout>
    </div>
  );
}

/* 🔹 COMPONENTS */

function SidebarItem({ title, date, active }) {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer ${
        active
          ? "bg-blue-600 text-white"
          : "border hover:bg-gray-50"
      }`}
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs opacity-70">{date}</p>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="flex justify-between text-sm mb-2">
      <span>{label}</span>
      <span className={color}>{value}</span>
    </div>
  );
}