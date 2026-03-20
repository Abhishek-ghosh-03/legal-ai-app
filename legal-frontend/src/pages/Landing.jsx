import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f5f7fb]">


      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <h1 className="text-xl font-bold text-blue-600">⚖️ LegalAI</h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:bg-gray-100 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 text-white rounded-lgflex items-center gap-2 px-3 py-2 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:bg-gray-100 transition"
          >
            Sign Up
          </button>
        </div>
      </div>


      <AppLayout>
      <section className="grid grid-cols-2 gap-10 px-12 py-16 items-center">


        <div>
          <p className="text-sm text-blue-600 mb-2">
            AI Powered Legal Solutions
          </p>

          <h1 className="text-4xl font-bold mb-4">
            Your AI Legal Advisor
          </h1>

          <p className="text-gray-600 mb-6">
            Understand complex legal documents, get instant answers,
            and make informed decisions with our advanced AI-powered
            legal assistant.
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 bg-blue-600 text-white rounded-lgflex items-center gap-2 px-3 py-2 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:bg-gray-100 transition"
            >
              Get Started Free 
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="border px-6 py-3 rounded-lg"
            >
              Watch Demo
            </button>
          </div>

          <div className="flex gap-8 text-sm text-gray-700">
            <div>
              <h3 className="font-bold">10K+</h3>
              <p>Documents Analyzed</p>
            </div>

            <div>
              <h3 className="font-bold">98%</h3>
              <p>Accuracy Rate</p>
            </div>

            <div>
              <h3 className="font-bold">500+</h3>
              <p>Active Users</p>
            </div>
          </div>
        </div>


        <div className="bg-white p-6 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <p className="text-sm text-gray-500 mb-2">
            Document: Service Agreement
          </p>

          <p className="text-xs text-gray-400 mb-2">
            Analysis in progress...
          </p>

          <div className="w-full bg-gray-200 h-2 rounded mb-4">
            <div className="bg-blue-600 h-2 rounded w-[80%]"></div>
          </div>

          <div className="space-y-2 text-sm">
            <p>✔️ Key Clauses Identified</p>
            <p>✔️ Risk Level Low</p>
            <p>✔️ Compliance Check Ready</p>
          </div>
        </div>
      </section>

      <section className="text-center py-16">
        <h2 className="text-2xl font-bold mb-2">
          Powerful Features
        </h2>
        <p className="text-gray-500 mb-8">
          Everything you need to manage legal documents
        </p>

        <div className="grid grid-cols-3 gap-6 px-12">

          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            >
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      </AppLayout>

      <section className="text-center py-16 bg-[#eef2f7]">
        <h2 className="text-2xl font-bold mb-8">
          Trusted by Legal Professionals
        </h2>

        <div className="grid grid-cols-3 gap-6 px-12">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            >
              <p className="text-sm text-gray-600 mb-4">
                "{t.text}"
              </p>
              <h4 className="font-semibold">{t.name}</h4>
            </div>
          ))}
        </div>
      </section>


      <section className="py-16 flex justify-center bg-pink-200">
        <div className="bg-blue-600 text-white p-10 rounded-xl text-center w-[60%] shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Transform Your Legal Workflow?
          </h2>

          <p className="mb-6">
            Join thousands of legal professionals using LegalAI
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-blue-600 px-6 py-2 rounded"
            >
              Start Free Trial
            </button>

            <button
              onClick={() =>
                window.open("https://github.com/", "_blank")
              }
              className="border px-6 py-2 rounded"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      
      <footer className="bg-black text-white px-12 py-10 grid grid-cols-4 gap-6 text-sm">
        <div>
          <h3 className="font-bold mb-2">LegalAI</h3>
          <p>Your AI-powered legal assistant</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Product</h4>
          <p>Features</p>
          <p>Pricing</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Company</h4>
          <p>About</p>
          <p>Contact</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <p>Privacy</p>
          <p>Terms</p>
        </div>
      </footer>
    </div>
  );
}


const features = [
  { title: "Smart Document Analysis", desc: "AI-powered review and clause extraction" },
  { title: "Legal AI Assistant", desc: "Ask questions and get instant answers" },
  { title: "Compliance Tracking", desc: "Track obligations and deadlines" },
  { title: "Legal Analytics", desc: "Insights and reporting" },
  { title: "Fast Processing", desc: "Analyze documents quickly" },
  { title: "Secure & Encrypted", desc: "Your data is protected" }
];

const testimonials = [
  { name: "Sarah Johnson", text: "This AI advisor saved hours of work." },
  { name: "Michael Chen", text: "Clause extraction is incredibly accurate." },
  { name: "Emma Williams", text: "Highly recommended for organizations." }
];