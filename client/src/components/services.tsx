import { motion } from "framer-motion";
import { Search, Palette, Rocket, Check, Target, Users, Zap, Globe, Heart, TrendingUp } from "lucide-react";

const services = [
  {
    phase: "Phase 1",
    title: "Brand Discovery + Market Fit",
    icon: Search,
    color: "cyan",
    gradient: "from-cyan-500 to-blue-600",
    shadowColor: "cyan-500/20",
    borderColor: "cyan-400/30",
    items: [
      "Competitor analysis",
      "TG profiling & positioning",
      "Messaging framework"
    ]
  },
  {
    phase: "Phase 2",
    title: "Identity & Digital Infrastructure",
    icon: Palette,
    color: "purple",
    gradient: "from-purple-500 to-pink-600",
    shadowColor: "purple-500/20",
    borderColor: "purple-400/30",
    items: [
      "Logo/Packaging design",
      "Instagram & LinkedIn branding",
      "Reels, carousels, influencer marketing"
    ]
  },
  {
    phase: "Phase 3",
    title: "Launch Plan (30–60 days)",
    icon: Rocket,
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
    shadowColor: "blue-500/20",
    borderColor: "blue-400/30",
    items: [
      "Paid ads strategy",
      "Website launch",
      "Influencer campaigns & PR"
    ]
  }
];

const additionalServices = [
  {
    title: "Content Strategy",
    icon: Target,
    color: "emerald",
    gradient: "from-emerald-500 to-teal-600",
    shadowColor: "emerald-500/20",
    borderColor: "emerald-400/30",
    description: "Data-driven content that resonates with your audience"
  },
  {
    title: "Community Building",
    icon: Users,
    color: "orange",
    gradient: "from-orange-500 to-red-600",
    shadowColor: "orange-500/20",
    borderColor: "orange-400/30",
    description: "Building engaged communities around your brand"
  },
  {
    title: "Performance Marketing",
    icon: Zap,
    color: "yellow",
    gradient: "from-yellow-500 to-orange-600",
    shadowColor: "yellow-500/20",
    borderColor: "yellow-400/30",
    description: "ROI-focused campaigns that deliver results"
  },
  {
    title: "Global Expansion",
    icon: Globe,
    color: "indigo",
    gradient: "from-indigo-500 to-purple-600",
    shadowColor: "indigo-500/20",
    borderColor: "indigo-400/30",
    description: "Scale your brand across international markets"
  },
  {
    title: "Brand Loyalty",
    icon: Heart,
    color: "pink",
    gradient: "from-pink-500 to-rose-600",
    shadowColor: "pink-500/20",
    borderColor: "pink-400/30",
    description: "Creating lasting emotional connections with customers"
  },
  {
    title: "Growth Analytics",
    icon: TrendingUp,
    color: "green",
    gradient: "from-green-500 to-emerald-600",
    shadowColor: "green-500/20",
    borderColor: "green-400/30",
    description: "Data insights that drive strategic decisions"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 neon-text">
            What Oodio Can Offer
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Your journey to digital success in three strategic phases, backed by comprehensive expertise
          </p>
        </motion.div>

        {/* Main Service Phases */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.phase}
                className="service-card group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className={`glass-effect glass-hover rounded-3xl p-8 h-full relative overflow-hidden border-2 border-transparent hover:border-${service.borderColor} hover:shadow-2xl hover:shadow-${service.shadowColor} transition-all duration-500`}>
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Phase Badge */}
                  <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${service.gradient} text-white text-sm font-bold mb-6 shadow-lg`}>
                    {service.phase}
                  </div>
                  
                  {/* Icon */}
                  <div className={`service-icon w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 shadow-lg shadow-${service.shadowColor}`}>
                    <Icon size={36} className="text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h4 className="text-2xl font-bold mb-6 text-white">
                      {service.title}
                    </h4>
                    <ul className="space-y-4 text-gray-300">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <Check size={18} className={`text-${service.color}-400 mr-3 mt-1 flex-shrink-0`} />
                          <span className="text-sm font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Services Grid */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Our <span className="neon-text">Expertise</span> Extends Beyond
          </h3>
          <p className="text-lg text-gray-400">
            Comprehensive solutions for every aspect of your digital presence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                className="service-card group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`glass-effect glass-hover rounded-2xl p-6 h-full relative overflow-hidden border border-transparent hover:border-${service.borderColor} hover:shadow-xl hover:shadow-${service.shadowColor} transition-all duration-500`}>
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 shadow-lg shadow-${service.shadowColor}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h4 className="text-lg font-bold mb-3 text-white">
                      {service.title}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
