import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import UploadBox from "../components/UploadBox";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AppLayout from "../components/AppLayout";

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
    <AppLayout>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-h-screen overflow-x-hidden">

        {/* SIDEBAR */}
        <div className="relative w-full md:w-64 bg-white rounded-xl p-2 shadow">

          {/* MOBILE TOGGLE */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-between items-center cursor-pointer p-1 rounded hover:bg-gray-100"
          >
            <h1 className="text-lg font-bold text-blue-600">⚖️ LegalAI</h1>
            <span className="md:hidden transition-transform duration-300">
              {isOpen ? "▲" : "▼"}
            </span>
          </div>

          {/* SIDEBAR DROPDOWN */}
          <div
            className={`
              absolute top-full left-0 w-full z-50
              transition-all duration-300 ease-in-out
              ${isOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"}
              
              md:static md:opacity-100 md:translate-y-0 md:pointer-events-auto
            `}
          >

            {/* SCROLLABLE CONTENT */}
            <div className="
              bg-white rounded-xl shadow-lg mt-2 p-3
              max-h-[70vh] overflow-y-auto
              space-y-3

              md:max-h-none md:overflow-visible md:shadow-none md:p-0 md:mt-0
            ">

              <SidebarItem active title="Dashboard" to="/dashboard" />
              <SidebarItem title="Documents" />
              <SidebarItem title="Analytics" to="/analytics" />
              <SidebarItem title="Settings" to="/settings" />

              {/* YOUR DOCS */}
              <div className="mt-4">
                <h2 className="text-sm text-gray-500 mb-2">Your Docs</h2>

                <div className="space-y-2">
                  {documents.slice(0, 3).map((doc, index) => (
                    <div
                      key={doc._id || doc.name || index}
                      onClick={() => navigate(`/document/${doc._id}`)}
                      className="p-2 border rounded cursor-pointer hover:bg-gray-100 text-sm"
                    >
                      <p className="truncate">
                        {doc.name || doc.fileName || doc.title || "Untitled Document"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* LOGOUT (MOBILE) */}
              <div className="mt-3 border-t pt-1 md:hidden">
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/");
                  }}
                  className="w-full text-left px-3 py-2 rounded bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto">

          {/* DESKTOP HEADER ONLY */}
          <div className="hidden md:flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow">
            <h1 className="text-xl font-semibold text-blue-600">
              Dashboard
            </h1>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
              className="border px-4 py-2 rounded-lg hover:bg-gray-100 text-sm"
            >
              Logout
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Docs" value={stats.totalDocs} change="+12% from last month" />
            <StatCard title="Queries" value={stats.totalQueries} change="+5% from last month" />
            <StatCard title="Summaries" value={stats.totalSummaries} change="+8% from last month" />
            <StatCard title="Growth" value={stats.growth} change="Monthly Usage" />
          </div>

          {/* UPLOAD */}
          <div ref={uploadRef} className="mb-6 bg-white p-4 rounded-xl shadow">
            <UploadBox
              setDocuments={setDocuments}
              refreshDocs={fetchDocs}
              refreshStats={fetchStats}
            />
          </div>

          {/* RECENT DOCS */}
          <div className="bg-white p-4 rounded-xl shadow mb-6">
            <h2 className="font-semibold mb-4">Recent Documents</h2>

            {documents.slice(0, 3).map((doc, index) => (
              <div
                key={doc._id || doc.name || index}
                onClick={() => navigate(`/document/${doc._id}`)}
                className="p-2 border rounded mb-2 cursor-pointer hover:bg-gray-50"
              >
                <p className="truncate">
                  {doc.name || doc.fileName || doc.title || "Untitled Document"}
                </p>
              </div>
            ))}
          </div>

          {/* ACTIVITY */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Recent Activity</h2>
            {[
              "Uploaded new document",
              "Generated summary",
              "Asked a question"
            ].map((item, index) => (
              <Activity key={index} text={item} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

/* COMPONENTS */

function SidebarItem({ title, active, to }) {
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded ${active ? "bg-blue-600 text-white" : "hover:bg-gray-100"
        }`}
    >
      {title}
    </Link>
  );
}

function StatCard({ title, value, change }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <h2 className="text-lg font-bold">{value}</h2>
        <p className="text-xs text-green-500">{change}</p>
      </div>
      <div className="bg-blue-500 text-white p-2 rounded">📊</div>
    </div>
  );
}

function Activity({ text }) {
  return (
    <div className="bg-gray-100 p-2 rounded mb-2 text-sm">
      {text}
    </div>
  );
}