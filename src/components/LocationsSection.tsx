import React from 'react';
import { MapPin, Phone, Clock, ExternalLink, Navigation } from 'lucide-react';

export function LocationsSection() {
  return (
    <section id="locations" className="py-16 bg-white scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-text mb-4">Our Locations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visit our stores to experience our wide range of quality furniture, electronics, and appliances.
            Our friendly staff is ready to assist you in finding the perfect solutions for your home.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Flagship Store */}
          <div className="bg-secondary-bg p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center text-secondary-corporate">
                  <MapPin className="h-5 w-5 mr-2 text-primary-cta" />
                  NEW PIONEER MALL
                </h3>
                <p className="text-gray-600">Our New Flagship Store</p>
              </div>
              <span className="px-3 py-1 bg-primary-cta text-white text-sm rounded-full">
                Opening Soon
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Navigation className="h-5 w-5 mr-3 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-600">Plot 1, Kampala Road, Pioneer Mall</p>
                  <p className="text-gray-600">Central Division, Kampala</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Opening Hours</p>
                  <p className="text-gray-600">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                  <p className="text-gray-600">Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-gray-600">+256702554028</p>
                  <p className="text-gray-600">+256784772829</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-primary-cta mb-2">Grand Opening Special</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-cta mr-2"></span>
                    Up to 50% off on selected items
                  </li>
                  <li className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-cta mr-2"></span>
                    Free delivery within Kampala
                  </li>
                  <li className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-cta mr-2"></span>
                    Special financing options available
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Distribution Center */}
          <div className="bg-secondary-bg p-8 rounded-xl shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center text-secondary-corporate">
                  <MapPin className="h-5 w-5 mr-2 text-primary-cta" />
                  NAMANVE DISTRIBUTION CENTER
                </h3>
                <p className="text-gray-600">Main Distribution Hub</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Navigation className="h-5 w-5 mr-3 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-600">Plot 123, Namanve Industrial Park</p>
                  <p className="text-gray-600">Kampala-Jinja Highway</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Operating Hours</p>
                  <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-gray-600">+256702554028</p>
                  <p className="text-gray-600">+256784772829</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-primary-cta mb-2">Bulk Orders & Wholesale</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-cta mr-2"></span>
                    Special rates for bulk purchases
                  </li>
                  <li className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-cta mr-2"></span>
                    Dedicated account managers
                  </li>
                  <li className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-cta mr-2"></span>
                    Nationwide delivery available
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}