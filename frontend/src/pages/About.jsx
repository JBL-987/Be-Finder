import React from "react";
import { Brain, Target, Users, MapPin, BarChart3, Zap } from "lucide-react";

const About = () => {
    return (
      <div className="min-h-screen bg-dark-bg text-dark-text-primary pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
              About Be-Finder
            </h1>
            <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
              Empowering smart business location decisions through AI-powered profitability analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-green-400">Our Mission</h2>
              <p className="text-dark-text-secondary mb-4">
                At Be-Finder, we empower entrepreneurs and business owners to make informed location decisions using advanced AI technology and comprehensive profitability analysis.
              </p>
              <p className="text-dark-text-secondary mb-4">
                Our platform combines Gemini AI with sophisticated business analytics to evaluate location potential, predict customer traffic, and assess business viability.
              </p>
              <p className="text-dark-text-secondary">
                We believe every business deserves the best possible start, and location is often the key to success.
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-8 border border-green-800/30">
              <h3 className="text-2xl font-bold mb-4 text-green-400">Platform Features</h3>
              <ul className="list-none mb-0 space-y-3">
                <li className="text-dark-text-secondary flex items-center">
                  <Brain className="h-5 w-5 text-green-400 mr-3" />
                  AI-powered location analysis using Gemini
                </li>
                <li className="text-dark-text-secondary flex items-center">
                  <Users className="h-5 w-5 text-blue-400 mr-3" />
                  Daily customer traffic predictions
                </li>
                <li className="text-dark-text-secondary flex items-center">
                  <BarChart3 className="h-5 w-5 text-purple-400 mr-3" />
                  Comprehensive profitability assessment
                </li>
                <li className="text-dark-text-secondary flex items-center">
                  <Zap className="h-5 w-5 text-yellow-400 mr-3" />
                  5-minute analysis process
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-dark-surface/50 rounded-lg border border-dark-border">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-400">Precision Analysis</h3>
              <p className="text-dark-text-secondary">
                Advanced AI algorithms analyze location photos to determine area distribution and business potential with high accuracy.
              </p>
            </div>

            <div className="text-center p-6 bg-dark-surface/50 rounded-lg border border-dark-border">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-400">Location Intelligence</h3>
              <p className="text-dark-text-secondary">
                Comprehensive evaluation of residential density, road access, and open space distribution for optimal business placement.
              </p>
            </div>

            <div className="text-center p-6 bg-dark-surface/50 rounded-lg border border-dark-border">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-400">Smart Insights</h3>
              <p className="text-dark-text-secondary">
                Data-driven recommendations help you understand customer potential and make confident business location decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};
  
export default About;