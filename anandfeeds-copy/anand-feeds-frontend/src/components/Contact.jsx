"use client";

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: "/marker.webp",
  iconSize: [50, 50], // Set the size here (width, height)
  iconAnchor: [12, 24], // Adjusts the point of the icon that corresponds to the marker's location
});

const position = [30.3564, 76.3647];

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="mt-16 w-full sm:w-[90%] md:w-[80%] mx-auto" id="contactus">
      <h2 className="text-3xl font-bold font-sans uppercase text-center bg-gradient-to-b from-pink-500 to-indigo-600 bg-clip-text text-transparent">
        Contact Us
      </h2>
      <div className="mx-auto bg-white rounded-xl overflow-hidden mt-6 border-[2px] border-gray flex flex-col md:flex-row">
        {/* Adjust the size of the map container */}
        <div className="w-full md:w-1/2 h-64 md:h-auto z-0">
          <MapContainer center={position} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} key={1} icon={icon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Contact Form Section */}
        <div className="w-full md:w-1/2 flex items-center px-4 py-6 md:px-8 md:py-12">
          <div className="w-full">
            <div className="uppercase tracking-wide text-sm text-pink-500 font-semibold mb-1">Get in touch</div>
            <h2 className="block mt-1 text-lg leading-tight font-medium text-black">We'd love to hear from you</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  required
                ></textarea>
              </div>

              {/* Consent Checkbox */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">I agree to receive communications from the company.</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center w-full sm:w-auto justify-center"
                >
                  <Send className="mr-2" size={18} />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
