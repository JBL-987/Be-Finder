const About = () => {
    return (
      <div className="min-h-screen bg-dark-bg text-dark-text-primary pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              About Be-Finder
            </h1>
            <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
              Unlock the power of AI-driven location intelligence to transform your business
            </p>
          </div>
  
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-blue-400">Our Mission</h2>
              <p className="text-dark-text-secondary mb-4">
                At Be-Finder, we empower businesses to make data-driven decisions with our cutting-edge AI technology and location analytics.
              </p>
              <p className="text-dark-text-secondary">
                Our platform helps you identify the perfect location for your business, ensuring maximum visibility, accessibility, and success.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-8 border border-dark-border">
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Key Statistics</h3>
              <ul className="list-none mb-0">
                <li className="text-dark-text-secondary mb-2">90% increase in business success with data-driven location decisions</li>
                <li className="text-dark-text-secondary mb-2">80% reduction in location scouting time with our AI-powered platform</li>
                <li className="text-dark-text-secondary">And many more...</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
};
  
export default About;