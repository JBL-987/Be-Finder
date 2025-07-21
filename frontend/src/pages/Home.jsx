import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  MapPin,
  BarChart3,
  Brain,
  Target,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Building,
  Zap,
  Star,
  Globe,
} from "lucide-react";

export default function Home({ login }) {
  const [activeTab, setActiveTab] = useState("analyze");

  const handleLogin = async () => {
      try {
        await login();
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Error connecting to ICP",
          text: "Something went wrong!",
        });
      }
  };

  const features = [
    {
      id: "analyze",
      icon: <Brain className="h-6 w-6" />,
      title: "AI Analysis",
      description:
        "Advanced AI algorithms analyze market trends, demographics, and competition",
    },
    {
      id: "predict",
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Predict Success",
      description:
        "Forecast business potential with data-driven predictions and insights",
    },
    {
      id: "visualize",
      icon: <MapPin className="h-6 w-6" />,
      title: "Map Integration",
      description: "Interactive maps showing optimal locations with detailed analytics",
    },
    {
      id: "optimize",
      icon: <Target className="h-6 w-6" />,
      title: "Location Optimizer",
      description: "Find the perfect spot based on your business type and budget",
    },
  ];

  const testimonials = [
    {
      quote:
        "Locatify helped me find the perfect location for my cafe. Sales exceeded projections by 40% in the first month!",
      author: "Maria S., Cafe Owner",
      rating: 5,
    },
    {
      quote:
        "The AI predictions were spot on. I avoided a costly mistake and found a location that's thriving.",
      author: "David L., Retail Store Owner",
      rating: 5,
    },
    {
      quote:
        "Amazing tool! The map visualizations and demographic data gave me confidence in my decision.",
      author: "Jennifer K., Restaurant Owner",
      rating: 5,
    },
  ];

  const benefits = [
    "Save thousands on market research and location scouting",
    "Get AI-powered location recommendations in minutes",
    "Access real-time demographic and foot traffic data",
    "Visualize competition and market opportunities on maps",
    "Predict revenue potential before signing a lease",
    "Make data-driven decisions with confidence",
  ];

  const stats = [
    { number: "95%", label: "Success Rate", icon: <Target className="h-8 w-8" /> },
    { number: "50k+", label: "Locations Analyzed", icon: <MapPin className="h-8 w-8" /> },
    { number: "2.5x", label: "Average ROI Increase", icon: <TrendingUp className="h-8 w-8" /> },
    { number: "30+", label: "Business Types", icon: <Building className="h-8 w-8" /> },
  ];

  return (
    <main className="overflow-hidden">
      <div className="bg-dark-bg text-dark-text-primary">
        {/* Hero Section */}
        <section className="min-h-screen relative flex flex-col justify-center items-center p-4 pt-16">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-dark-bg"></div>
            <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-700"></div>
            <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-1000"></div>
          </div>
          <div className="max-w-6xl z-20 text-center relative">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/30 mb-6">
                <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                <span className="text-sm font-medium">AI-Powered Location Intelligence</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
              Find Your Perfect Business Location
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-dark-text-secondary max-w-4xl mx-auto leading-relaxed">
              Be-Finder uses advanced AI and real-time data to predict the best locations for your business. 
              Get recommendations based on demographics, foot traffic, competition, and market trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={handleLogin}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-medium hover:opacity-90 transition-all transform hover:scale-105 flex items-center justify-center">
                <MapPin className="h-5 w-5 mr-2" />
                Discover Locations
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white/30 rounded-lg text-lg font-medium hover:bg-white/10 transition-all">
                Watch Demo
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-dark-text-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Powered by Advanced AI
              </h2>
              <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
                Our intelligent system analyzes millions of data points to give you the most accurate location recommendations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveTab(feature.id)}
                  className={`p-6 rounded-xl transition-all ${
                    activeTab === feature.id
                      ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/50 transform scale-105"
                      : "bg-dark-surface/50 hover:bg-dark-bg/50"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`p-4 rounded-full mb-4 ${
                        activeTab === feature.id ? "bg-blue-600" : "bg-dark-bg"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-dark-text-secondary text-sm">{feature.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border-dark-border">
              {activeTab === "analyze" && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-bold mb-4 text-blue-400">
                      AI Market Analysis
                    </h3>
                    <p className="text-dark-text-secondary mb-6 text-lg">
                      Our advanced AI algorithms process real-time market data, demographic information, 
                      and economic indicators to provide comprehensive location analysis for any business type.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Real-time demographic analysis</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Competition density mapping</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Foot traffic pattern analysis</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Economic trend forecasting</span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-6 border-dark-border">
                      <div className="aspect-square bg-dark-bg/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <Brain className="h-24 w-24 text-blue-400 opacity-70" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "predict" && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-bold mb-4 text-blue-400">
                      Success Prediction
                    </h3>
                    <p className="text-dark-text-secondary mb-6 text-lg">
                      Leverage machine learning models trained on thousands of successful businesses 
                      to predict your potential success rate at any location.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Revenue potential forecasting</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Risk assessment analysis</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Market saturation evaluation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Growth potential scoring</span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-6 border-dark-border">
                      <div className="aspect-square bg-dark-bg/50 rounded-lg flex items-center justify-center relative">
                        <TrendingUp className="h-24 w-24 text-green-400 opacity-70" />
                        <div className="absolute bottom-4 left-4 right-4 h-2 bg-green-500/20 rounded-full">
                          <div className="h-full bg-green-500 rounded-full w-3/4 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "visualize" && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-bold mb-4 text-blue-400">
                      Interactive Maps
                    </h3>
                    <p className="text-dark-text-secondary mb-6 text-lg">
                      Visualize location data through interactive maps with layers showing demographics, 
                      competition, foot traffic, and more to make informed decisions.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Heat map visualizations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Multi-layer data overlay</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Real-time traffic analysis</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Competitor location mapping</span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-6 border-dark-border">
                      <div className="aspect-square bg-dark-bg/50 rounded-lg flex items-center justify-center relative">
                        <Globe className="h-24 w-24 text-blue-400 opacity-70" />
                        <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                        <div className="absolute bottom-6 right-6 w-2 h-2 bg-green-500 rounded-full animate-ping delay-300"></div>
                        <div className="absolute top-1/2 left-8 w-2 h-2 bg-yellow-500 rounded-full animate-ping delay-700"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "optimize" && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-bold mb-4 text-blue-400">
                      Location Optimization
                    </h3>
                    <p className="text-dark-text-secondary mb-6 text-lg">
                      Get personalized location recommendations based on your business type, budget, 
                      and specific requirements using our optimization algorithms.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Business-specific recommendations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Budget-based filtering</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>Custom criteria matching</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>ROI optimization scoring</span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-6 border-dark-border">
                      <div className="aspect-square bg-dark-bg/50 rounded-lg flex items-center justify-center relative">
                        <Target className="h-24 w-24 text-purple-400 opacity-70" />
                        <div className="absolute inset-8 border-2 border-purple-500/30 rounded-full animate-pulse"></div>
                        <div className="absolute inset-12 border-2 border-purple-500/20 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Why Choose Be-Finder?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 rounded-2xl border-dark-border">
                <h3 className="text-2xl font-bold mb-6 text-blue-400">
                  Business Benefits
                </h3>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-dark-text-secondary">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 rounded-2xl border-dark-border">
                <h3 className="text-2xl font-bold mb-6 text-blue-400">
                  Powered By Advanced Tech
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-dark-bg/30 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Machine Learning AI</h4>
                      <p className="text-sm text-dark-text-secondary">
                        Advanced algorithms for location analysis
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-dark-bg/30 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mr-4">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Real-time Data</h4>
                      <p className="text-sm text-dark-text-secondary">
                        Live market and demographic information
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-dark-bg/30 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-4">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Predictive Analytics</h4>
                      <p className="text-sm text-dark-text-secondary">
                        Forecast business success potential
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-xl border-dark-border hover:transform hover:scale-105 transition-all"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-dark-text-secondary mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <p className="font-semibold text-blue-400">
                    {testimonial.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Ready to Find Your Perfect Location?
            </h2>
            <p className="text-xl text-dark-text-secondary mb-8">
              Join thousands of successful businesses that found their ideal location with Be-Finder's AI-powered recommendations.
            </p>
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-medium hover:opacity-90 transition-all transform hover:scale-105 flex items-center mx-auto">
              <MapPin className="mr-2 h-5 w-5" />
              Start Location Search
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}