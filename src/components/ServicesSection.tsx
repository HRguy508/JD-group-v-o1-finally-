import React, { useState } from 'react';
import { Truck, Package, ShoppingBag, Globe, PenTool as Tool, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export function ServicesSection() {
  const [expandedService, setExpandedService] = useState<number | null>(null);

  const services = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Transportation & Logistics",
      description: "Efficient transportation services between South Africa and Uganda, ensuring reliable delivery of goods.",
      details: [
        "Door-to-door delivery services across Uganda",
        "Real-time shipment tracking and monitoring",
        "Temperature-controlled transportation for sensitive goods",
        "Customs clearance and documentation handling",
        "Specialized handling for fragile items",
        "Insurance coverage for all shipments"
      ]
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "Warehousing",
      description: "State-of-the-art warehousing facilities in strategic locations across Uganda.",
      details: [
        "Climate-controlled storage facilities",
        "24/7 security surveillance",
        "Inventory management system",
        "Cross-docking services",
        "Short and long-term storage solutions",
        "Regular quality inspections"
      ]
    },
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: "Retail Solutions",
      description: "Complete retail solutions including store setup, inventory management, and retail operations.",
      details: [
        "Store layout and design consultation",
        "POS system implementation",
        "Staff training and development",
        "Visual merchandising services",
        "Inventory optimization",
        "Customer service excellence programs"
      ]
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Import/Export Services",
      description: "Comprehensive import/export services between South Africa and Uganda.",
      details: [
        "Import/Export documentation processing",
        "Customs brokerage services",
        "Trade compliance consulting",
        "Duty and tax calculation",
        "International shipping coordination",
        "Risk assessment and management"
      ]
    },
    {
      icon: <Tool className="h-8 w-8" />,
      title: "Installation & Assembly",
      description: "Professional installation and assembly services for furniture and appliances.",
      details: [
        "Expert furniture assembly team",
        "Appliance installation and setup",
        "Quality assurance inspection",
        "Site preparation services",
        "Post-installation cleanup",
        "Safety compliance verification"
      ]
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "After-Sales Support",
      description: "Dedicated after-sales support and maintenance services.",
      details: [
        "24/7 customer support hotline",
        "Warranty service management",
        "Regular maintenance scheduling",
        "Repair and replacement services",
        "Product usage training",
        "Customer feedback management"
      ]
    },
  ];

  const toggleService = (index: number) => {
    setExpandedService(expandedService === index ? null : index);
  };

  return (
    <section id="services" className="py-16 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary-text mb-8 text-center">Our Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-secondary-bg rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleService(index)}
              >
                <div className="flex justify-between items-start">
                  <div className="text-primary-cta mb-4">{service.icon}</div>
                  {expandedService === index ? (
                    <ChevronUp className="h-5 w-5 text-primary-cta" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary-cta" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                expandedService === index ? 'max-h-96' : 'max-h-0'
              }`}>
                <div className="p-6 pt-0 border-t border-gray-200">
                  <ul className="space-y-2">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="h-2 w-2 rounded-full bg-primary-cta mt-2 mr-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}