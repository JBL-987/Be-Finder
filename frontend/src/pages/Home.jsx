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
  Zap,
  Star,
  Calculator,
} from "lucide-react";

export default function Home({ login }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "An error occurred during login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const businessBenefits = [
    {
      icon: <Target className="h-8 w-8 text-green-500" />,
      title: "Accurate Location Analysis",
      description: "Gemini AI analyzes location photos to determine residential area, road, and open space distribution with high precision",
      metric: "95% Accuracy"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Daily Customer Prediction",
      description: "Calculate potential customers per day based on population density and location traffic patterns",
      metric: "Real-time Data"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Profitability Analysis",
      description: "Evaluate location business potential based on demographic data and traffic patterns for smart investment decisions",
      metric: "Smart Analysis"
    }
  ];

  const testimonials = [
    {
      quote: "Be-Finder helped me analyze several different locations. This platform is very accurate in predicting business potential!",
      author: "Budi S., Grocery Store Owner",
      rating: 5,
    },
    {
      quote: "The AI analysis is very detailed. I can see how many potential customers per day before opening a business. Very helpful!",
      author: "Sari L., Restaurant Owner",
      rating: 5,
    },
    {
      quote: "This platform saves time and location research costs. In 5 minutes I already know the business potential of my location.",
      author: "Andi K., Cafe Owner",
      rating: 5,
    },
  ];

  const benefits = [
    "Location profitability analysis in minutes",
    "Daily customer prediction with Gemini AI",
    "Business potential evaluation based on location data",
    "Analysis of residential area, road, and open space distribution",
    "Business location investment feasibility estimation",
    "Data-driven accurate business decisions",
  ];

  const stats = [
    { number: "172", label: "Daily Customers", icon: <Users className="h-8 w-8" /> },
    { number: "1000+", label: "Locations Analyzed", icon: <Target className="h-8 w-8" /> },
    { number: "95%", label: "AI Accuracy", icon: <Brain className="h-8 w-8" /> },
    { number: "5 Minutes", label: "Fast Analysis", icon: <Zap className="h-8 w-8" /> },
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
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-full border border-green-500/30 mb-4 sm:mb-6">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-green-400" />
                <span className="text-xs sm:text-sm font-medium">AI-Powered Business Profitability Analysis</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent leading-tight px-2">
              Analyze Your Business Location Profitability
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
              AI platform that analyzes business locations and predicts daily customers,
              profitability potential, and business success with high accuracy using Gemini AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 rounded-lg text-sm sm:text-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center disabled:opacity-50 text-primary-foreground">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-current mr-2"></div>
                ) : (
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                )}
                {isLoading ? 'Loading...' : 'Start Free Analysis'}
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-border rounded-lg text-sm sm:text-lg font-medium hover:bg-accent transition-all">
                Watch Demo
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full">
                      <div className="w-5 h-5 sm:w-8 sm:h-8">
                        {React.cloneElement(stat.icon, { className: "w-full h-full" })}
                      </div>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business Benefits Section */}
        <section id="benefits" className="py-12 sm:py-16 lg:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
                AI-Based Business Analysis
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Advanced platform that analyzes business location profitability with Gemini AI technology and real-time data
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {businessBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="p-6 sm:p-8 rounded-xl bg-card border border-border hover:border-green-500/30 transition-all hover:transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 sm:p-4 rounded-full mb-4 sm:mb-6 bg-gradient-to-r from-green-600/20 to-blue-600/20">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-card-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                      {benefit.description}
                    </p>
                    <div className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-full">
                      <span className="text-xs sm:text-sm font-semibold text-green-400">{benefit.metric}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-2xl p-6 sm:p-8 border border-green-800/30">
              <div className="text-center mb-8 sm:mb-12">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-green-400">
                  How The Platform Works
                </h3>
                <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                  Business location profitability analysis in 4 simple steps
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[
                  {
                    step: "1",
                    title: "Select Location",
                    description: "Click on the map to select the business location you want to analyze",
                    icon: <MapPin className="h-6 w-6" />
                  },
                  {
                    step: "2",
                    title: "Input Parameters",
                    description: "Enter building width, operating hours, and product price",
                    icon: <Target className="h-6 w-6" />
                  },
                  {
                    step: "3",
                    title: "AI Analysis",
                    description: "Gemini AI analyzes location screenshot and calculates business metrics",
                    icon: <Brain className="h-6 w-6" />
                  },
                  {
                    step: "4",
                    title: "View Results",
                    description: "Get profitability analysis and business location feasibility recommendations",
                    icon: <BarChart3 className="h-6 w-6" />
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="relative mb-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6">
                          {React.cloneElement(item.icon, { className: "w-full h-full" })}
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white">
                        {item.step}
                      </div>
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold mb-2 text-card-foreground">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-green-900/20 to-blue-900/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
                Real Analysis Results
              </h2>
              <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
                Example profitability analysis results from our platform
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-dark-surface/50 rounded-xl border border-dark-border hover:border-green-500/30 transition-all">
                  <div className="flex justify-center mb-4 text-green-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-2 text-white">{stat.number}</div>
                  <div className="text-sm text-dark-text-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
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

              <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 p-8 rounded-2xl border border-green-800/30">
                <h3 className="text-2xl font-bold mb-6 text-green-400">
                  Advanced Technology
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-dark-bg/30 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mr-4">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Gemini AI</h4>
                      <p className="text-sm text-dark-text-secondary">
                        Location image analysis with cutting-edge AI
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-dark-bg/30 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                      <Calculator className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Accurate Calculation</h4>
                      <p className="text-sm text-dark-text-secondary">
                        12-step business profitability calculation
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
        <section id="testimonials" className="py-20 px-4 bg-gradient-to-r from-dark-bg to-dark-surface">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
              User Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-900/20 to-blue-900/20 p-6 rounded-xl border border-green-800/30 hover:transform hover:scale-105 transition-all"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-dark-text-secondary mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <p className="font-semibold text-green-400">
                    {testimonial.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
              Ready to Analyze Your Business Profitability?
            </h2>
            <p className="text-xl text-dark-text-secondary mb-8">
              Join thousands of business owners who have optimized their business locations with Be-Finder
            </p>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-lg font-medium hover:opacity-90 transition-all transform hover:scale-105 flex items-center mx-auto disabled:opacity-50">
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <TrendingUp className="mr-2 h-5 w-5" />
              )}
              {isLoading ? 'Loading...' : 'Start Analysis Now'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}