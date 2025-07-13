import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { PlayCircle } from "lucide-react";

const categories = [
  { id: "all", label: "All Work" },
  { id: "video", label: "Video Editing" },
  { id: "content", label: "Content Writing" },
  { id: "design", label: "Thumbnail Design" }
];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { data: portfolioItems, isLoading } = usePortfolio();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ url: string; type: "image" | "video"; title: string } | null>(null);

  const filteredItems = portfolioItems?.filter(item => 
    activeFilter === "all" || item.category === activeFilter
  ) || [];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "video": return "cyan";
      case "content": return "purple";
      case "design": return "blue";
      default: return "cyan";
    }
  };

  const handleItemClick = (item: any) => {
    const isVideo = /\.(mp4|mov|avi)$/i.test(item.image);
    setModalContent({
      url: item.image,
      type: isVideo ? "video" : "image",
      title: item.title
    });
    setModalOpen(true);
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
          <p className="text-xl text-gray-300">
            Showcasing our expertise across different creative domains
          </p>
        </motion.div>

        {/* Portfolio Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === category.id
                  ? "btn-gradient"
                  : "glass-effect glass-hover"
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
                const isVideo = /\.(mp4|mov|avi)$/i.test(item.image);
                return (
                  <motion.div
                    key={`${item.id}-${activeFilter}`}
                    className="portfolio-item"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    layout
                  >
                    <div
                      className="glass-effect glass-hover rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="relative overflow-hidden">
                        {isVideo ? (
                          <>
                            <video
                              src={item.image}
                              className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110 bg-black"
                              controls={false}
                              muted
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <PlayCircle size={64} className="text-white/80" />
                            </div>
                          </>
                        ) : (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-3 neon-text">
                          {item.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {item.description}
                        </p>
                        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full glass-effect">
                          <span className="text-xs font-medium text-cyan-400">
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </span>
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
      {/* Modal/Lightbox */}
      {modalOpen && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setModalOpen(false)}>
          <div className="relative max-w-3xl w-full p-4" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-white text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
            {modalContent.type === "video" ? (
              <video src={modalContent.url} controls autoPlay className="w-full max-h-[70vh] rounded-lg bg-black" />
            ) : (
              <img src={modalContent.url} alt={modalContent.title} className="w-full max-h-[70vh] object-contain rounded-lg bg-black" />
            )}
            <div className="mt-2 text-center text-white text-lg font-semibold">{modalContent.title}</div>
          </div>
        </div>
      )}
    </section>
  );
}
