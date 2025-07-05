import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-2xl font-bold mb-4 neon-text">
            Oodio Solutions
          </div>
          <p className="text-gray-400 mb-6">Your Story. Our Strategy. Their Screens.</p>
          <div className="flex justify-center space-x-6 mb-8">
            <a 
              href="#" 
              className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
              aria-label="Twitter"
            >
              <Twitter size={24} />
            </a>
          </div>
          <p className="text-gray-500">© 2024 Oodio Solutions. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
