import React from "react";
import { Brain, Shield, Clock, BarChart3, Zap, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Automation",
      description: "Advanced machine learning algorithms automatically categorize transactions, detect anomalies, and generate insights.",
      color: "text-blue-400"
    },
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Immutable ledger technology ensures data integrity and provides transparent audit trails for all transactions.",
      color: "text-purple-400"
    },
    {
      icon: Clock,
      title: "Real-Time Processing",
      description: "Process thousands of transactions instantly with real-time updates and immediate financial reporting.",
      color: "text-blue-400"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive dashboards and reporting tools provide deep insights into your financial data.",
      color: "text-purple-400"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance ensures rapid data processing and seamless user experience.",
      color: "text-blue-400"
    },
    {
      icon: Users,
      title: "Multi-User Support",
      description: "Collaborative workspace with role-based access control for teams and organizations.",
      color: "text-purple-400"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-primary pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Features
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
            Discover the powerful features that make Be-Finder the future of accounting technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-dark-surface/50 rounded-lg p-8 border-dark-border hover:border-blue-500/50 transition-all duration-300">
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 flex items-center justify-center mb-6`}>
                <feature.icon size={32} className={feature.color} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
              <p className="text-dark-text-secondary leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-8 border-dark-border mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-dark-text-secondary">Link your bank accounts and financial sources securely</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Process</h3>
              <p className="text-dark-text-secondary">AI automatically categorizes and processes your transactions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze</h3>
              <p className="text-dark-text-secondary">Get insights and reports to make informed business decisions</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">Ready to Get Started?</h2>
          <p className="text-dark-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using Locatify to streamline their accounting processes
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 font-medium rounded-lg text-lg px-8 py-4 text-center transition-all">
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;