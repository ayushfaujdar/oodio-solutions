import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", label: "All Work" },
  { id: "video", label: "Video Editing" },
  { id: "content", label: "Content Writing" },
  { id: "design", label: "Thumbnail Design" }
];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { data: portfolioItems, isLoading } = usePortfolio();

  const filteredItems = portfolioItems?.filter(item => 
    activeFilter === "all" || item.category === activeFilter
  ) || [];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "video": return "cyan";
      case "content": return "purple";
      case "design": return "blue";
      default: return "gray";
    }
  };

  return (
    <section id="portfolio" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
            Our Portfolio
          </h2>
          <p className="text-xl text-gray-300">Showcasing our expertise across different creative domains</p>
        </motion.div>

        {/* Portfolio Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              variant={activeFilter === category.id ? "default" : "outline"}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === category.id
                  ? "btn-gradient border-none"
                  : "glass-effect glass-hover border-white/20 hover:border-cyan-400/50"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              <p className="mt-4 text-gray-400">Loading portfolio...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No portfolio items found for this category.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredItems.map((item) => {
                const color = getCategoryColor(item.category);
                return (
                  <motion.div
                    key={`${item.id}-${activeFilter}`}
                    className="portfolio-item group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    layout
                  >
                    <div className={`glass-effect glass-hover rounded-3xl overflow-hidden border-2 border-transparent hover:border-${color}-400/30 hover:shadow-2xl hover:shadow-${color}-500/20 transition-all duration-500`}>
                      <div className="relative overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      </div>
                      <div className="p-6">
                        <h3 className={`text-xl font-bold mb-3 text-${color}-400`}>
                          {item.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {item.description}
                        </p>
                        <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-${color}-500/20 to-${color}-600/20 border border-${color}-400/30 text-${color}-400 text-xs font-medium`}>
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
