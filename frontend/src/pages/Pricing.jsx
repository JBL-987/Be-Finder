import { Check, Star } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      period: "",
      description: "Perfect for individual entrepreneurs",
      features: [
        "Up to 5 location analyses/month",
        "Basic AI location analysis",
        "Standard profitability reports",
        "Email support",
        "Community access"
      ],
      isPopular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 50 location analyses/month",
        "Advanced AI insights",
        "Detailed profitability reports",
        "Priority support",
        "Export analysis results",
        "Historical data access",
        "Comparison tools"
      ],
      isPopular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations and consultants",
      features: [
        "Unlimited location analyses",
        "Full AI analysis suite",
        "White-label reports",
        "Dedicated account manager",
        "API access",
        "Custom integrations",
        "Team collaboration tools",
        "Training & onboarding"
      ],
      isPopular: false
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-primary pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
            Pricing Plans
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
            Choose the perfect plan for your business location analysis needs. All plans include AI-powered insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-dark-surface/50 rounded-lg p-8 border ${plan.isPopular ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-dark-border'} hover:border-green-500/50 transition-all duration-300`}>
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star size={16} />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <p className="text-dark-text-secondary mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-green-400">{plan.price}</span>
                  <span className="text-dark-text-secondary ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-dark-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full font-medium rounded-lg text-sm px-5 py-3 text-center transition-all ${
                plan.isPopular
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90'
                  : 'bg-dark-border hover:bg-dark-bg text-white'
              }`}>
                Get Started
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-8 border border-green-800/30 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-green-400">Enterprise Solutions</h2>
            <p className="text-dark-text-secondary mb-6 max-w-2xl mx-auto">
              Need a custom solution? Our enterprise team can create a tailored package for your location analysis needs.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Custom Analysis</h3>
                <p className="text-dark-text-secondary">Tailored location analysis for your specific industry</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
                <p className="text-dark-text-secondary">24/7 priority support with dedicated account manager</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Volume Pricing</h3>
                <p className="text-dark-text-secondary">Flexible pricing that scales with your analysis needs</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90 font-medium rounded-lg text-lg px-8 py-4 text-center transition-all">
              Contact Sales
            </button>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-400">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-dark-text-secondary">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">How accurate are the analyses?</h3>
              <p className="text-dark-text-secondary">Our AI-powered analysis achieves 95% accuracy using advanced Gemini AI and real Jakarta demographic data.</p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-dark-text-secondary">We accept all major credit cards and digital payment methods for your convenience.</p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
              <p className="text-dark-text-secondary">Absolutely. We use enterprise-grade encryption and secure Internet Identity authentication.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;