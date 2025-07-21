import React from "react";
import { Check, Star } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses getting started",
      features: [
        "Up to 100 transactions/month",
        "Basic AI categorization",
        "Standard reporting",
        "Email support",
        "Mobile app access"
      ],
      isPopular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 1,000 transactions/month",
        "Advanced AI automation",
        "Custom reporting",
        "Priority support",
        "API access",
        "Multi-user support",
        "Blockchain verification"
      ],
      isPopular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations",
      features: [
        "Unlimited transactions",
        "Full AI suite",
        "White-label options",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced security",
        "SLA guarantee",
        "Training & onboarding"
      ],
      isPopular: false
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the perfect plan for your business needs. All plans include our core AI features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-gray-900/50 rounded-lg p-8 border ${plan.isPopular ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-blue-900/30'} hover:border-blue-500/50 transition-all duration-300`}>
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star size={16} />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <p className="text-gray-300 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-blue-400">{plan.price}</span>
                  <span className="text-gray-300 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full font-medium rounded-lg text-sm px-5 py-3 text-center transition-all ${
                plan.isPopular 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}>
                Get Started
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-8 border border-blue-900/30 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-blue-400">Enterprise Solutions</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Need a custom solution? Our enterprise team can create a tailored package that fits your specific requirements.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Custom Integration</h3>
                <p className="text-gray-300">Seamlessly integrate with your existing systems</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
                <p className="text-gray-300">24/7 priority support with dedicated account manager</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Flexible Pricing</h3>
                <p className="text-gray-300">Volume-based pricing that scales with your business</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 font-medium rounded-lg text-lg px-8 py-4 text-center transition-all">
              Contact Sales
            </button>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-300">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-300">Yes, we offer a 14-day free trial for all plans. No credit card required.</p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-300">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
              <p className="text-gray-300">Absolutely. We use enterprise-grade encryption and blockchain technology to ensure maximum security.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;