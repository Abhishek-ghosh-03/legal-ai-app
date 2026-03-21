import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-white/60 backdrop-blur-sm min-h-screen pt-2 px-1">
      <div className="flex justify-between items-center bg-white p-2 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] mx-1">

        {/* LOGO */}
        <h1 className="text-lg sm:text-xl font-bold text-blue-600">
          ⚖️ LegalAI
        </h1>

        {/* BUTTONS */}
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-2 text-sm bg-white rounded-lg shadow hover:bg-gray-100"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Sign Up
          </button>
        </div>

      </div>
      <AppLayout>
        {/* 🔥 HERO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 px-4 md:px-12 py-10 md:py-16 items-center">

          {/* LEFT */}
          <div className="text-center md:text-left">
            <p className="text-sm text-blue-600 mb-2">
              AI Powered Legal Solutions
            </p>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Your AI Legal Advisor
            </h1>

            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Understand complex legal documents, get instant answers,
              and make informed decisions with our advanced AI-powered
              legal assistant.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 text-sm w-full sm:w-auto"
              >
                Get Started Free
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="border px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
              >
                Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-700">
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

          {/* RIGHT CARD */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
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

        {/* 🔥 FEATURES */}
        <section className="text-center py-12 md:py-16">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Powerful Features
          </h2>

          <p className="text-gray-500 mb-8 text-sm md:text-base">
            Everything you need to manage legal documents
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-12">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-4 md:p-6 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              >
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </AppLayout>

      {/* 🔥 TESTIMONIALS */}
      <section className="text-center py-12 md:py-16 bg-[#eef2f7]">
        <h2 className="text-xl md:text-2xl font-bold mb-8">
          Trusted by Legal Professionals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-12">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-4 md:p-6 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            >
              <p className="text-sm text-gray-600 mb-4">
                "{t.text}"
              </p>
              <h4 className="font-semibold">{t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 CTA */}
      <section className="py-12 md:py-16 flex justify-center bg-pink-200 px-4">
        <div className="bg-blue-600 text-white p-6 md:p-10 rounded-xl text-center w-full md:w-[60%] shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
          <h2 className="text-lg md:text-2xl font-bold mb-4">
            Ready to Transform Your Legal Workflow?
          </h2>

          <p className="mb-6 text-sm md:text-base">
            Join thousands of legal professionals using LegalAI
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-blue-600 px-4 py-2 rounded text-sm w-full sm:w-auto"
            >
              Start Free Trial
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="border px-4 py-2 rounded text-sm w-full sm:w-auto"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* 🔥 FOOTER */}
      <footer className="bg-black text-white px-4 md:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
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

/* DATA */

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