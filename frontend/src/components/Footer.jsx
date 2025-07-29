import { Github } from "lucide-react";

const Footer_Component = ({}) => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="w-full max-w-7xl mx-auto p-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Be-Finder
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
            AI-powered location analysis for your next big move.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/JBL-987/Hi-Countant"
                className="text-dark-text-secondary hover:text-blue-400 transition-colors"
              >
                 <Github size={20} />
              </a>
            </div>
          </div>
         </div>


        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <span className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2025 Be-Finder™. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer_Component;