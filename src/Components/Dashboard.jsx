import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { dashboard_img1 } from "../assets/Images";
import { Conference_Management_System } from "../assets/Images";
import { ConfHub } from "../assets/Images";
import { dashboard_bg } from "../assets/Images";
const Dashboard = () => {
  const navigate = useNavigate();
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch conferences in progress and approved by admin
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await axios.get('https://amused-fulfillment-production.up.railway.app/api/conferences', {
          params: {
            filters: {
              requestStatus: {
                $eq: 'approved',
              },
            },
            populate: '*',  // This will populate all related fields
          },
        });
        const allConferences = response.data.data
        console.log('conf',response);
        console.log('aprconf',allConferences);
        setConferences(allConferences);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching conferences:", error);
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  const handleConferenceClick = (conferenceId) => {
    navigate(`/conference/${conferenceId}`);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const filteredConferences = conferences.filter(conference =>
    conference.Conference_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50">
      {/* Navigation */}
      <nav className="relative bg-white/80 backdrop-blur-md border-b border-sky-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-pink-400 rounded-lg flex items-center justify-center">
                <HiSparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-pink-600 bg-clip-text text-transparent">
                ConfHub
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="flex items-center space-x-2 text-sky-600 hover:text-pink-600 transition-colors duration-300">
                <FiHome className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </a>
              <a href="#about" className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors duration-300">
                <FiInfo className="w-4 h-4" />
                <span className="font-medium">About</span>
              </a>
              <a href="#services" className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors duration-300">
                <FiSettings className="w-4 h-4" />
                <span className="font-medium">Services</span>
              </a>
              <a href="#contact" className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors duration-300">
                <FiMail className="w-4 h-4" />
                <span className="font-medium">Contact</span>
              </a>
            </div>

            {/* Login Button */}
            <button 
              onClick={handleLoginClick}
              className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Login
            </button>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-current transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-sky-100 py-4">
              <div className="flex flex-col space-y-4 px-4">
                <a href="#home" className="flex items-center space-x-2 text-sky-600 hover:text-pink-600 transition-colors duration-300">
                  <FiHome className="w-4 h-4" />
                  <span>Home</span>
                </a>
                <a href="#about" className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  <FiInfo className="w-4 h-4" />
                  <span>About</span>
                </a>
                <a href="#services" className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  <FiSettings className="w-4 h-4" />
                  <span>Services</span>
                </a>
                <a href="#contact" className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  <FiMail className="w-4 h-4" />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 via-pink-400/20 to-purple-400/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium text-sky-600 border border-sky-200">
                <HiSparkles className="w-4 h-4" />
                <span>Conference Management System</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-sky-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Streamline Your
                </span>
                <br />
                <span className="text-gray-800">Academic Events</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg">
                From managing program committees to publishing proceedings, our ConfHub system provides a professional solution for organizing successful conferences from start to finish.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                  <span className="flex items-center space-x-2">
                    <span>Get Started</span>
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
                <button className="bg-white/80 backdrop-blur-md hover:bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold transition-all duration-300 border border-sky-200 hover:border-pink-300">
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sky-600">500+</div>
                  <div className="text-sm text-gray-600">Conferences</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">10K+</div>
                  <div className="text-sm text-gray-600">Submissions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">50+</div>
                  <div className="text-sm text-gray-600">Universities</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-pink-400 rounded-3xl transform rotate-6 opacity-20"></div>
              <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-sky-100">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">Active Conferences</h3>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-sky-50 to-pink-50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-semibold">
                          {i}
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-sky-200 rounded-full mb-1"></div>
                          <div className="h-2 bg-pink-200 rounded-full w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conferences Section */}
      <section className="py-20 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-sky-100 to-pink-100 rounded-full px-4 py-2 text-sm font-medium text-sky-600 mb-4">
              <FiCalendar className="w-4 h-4" />
              <span>Active Conferences</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Discover <span className="bg-gradient-to-r from-sky-600 to-pink-600 bg-clip-text text-transparent">Upcoming Events</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join leading conferences and contribute to the academic community with cutting-edge research and innovations.
            </p>
          </div>

      
      <div className="main-page">
        {/* Conferences In Progress Section */}
<section className="conference-list px-8 py-6">
  <div className="flex justify-between items-center mb-6">
    <div className="relative">
      <input
        type="text"
        placeholder="Search conferences by title"
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 text-sm"
      />
      <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <span className="text-sm text-gray-600">4 of 4 conferences</span>
  </div>

  {loading ? (
    <p>Loading conferences...</p>
  ) : conferences.length > 0 ? (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Conference Title</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Submission Deadline</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {conferences.map((conference, index) => (
            <tr
              key={conference.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              onClick={() => handleConferenceClick(conference.id)}
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{conference.Conference_title}</div>
                    <div className="flex items-center mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Open
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs">
                  {conference.Description}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {conference.Start_date}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {conference.Submission_deadline}
                </div>
              </td>
              <td className="px-6 py-4">
                <button 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle submit paper action
                  }}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Submit Paper
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>No conferences in progress at the moment.</p>
  )}
</section>


        {/* About Us Section */}
        <section className="about-us">
          <div className="about-content">
            <h2>About Us</h2>
            <p>
              Our platform streamlines the management of university-level
              conferences, providing tools for organizers to efficiently manage
              tracks, sessions, and submissions. We focus on collaboration,
              simplicity, and success in academic events.
            </p>
          </div>
        </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-sky-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium text-sky-600 border border-sky-200">
                <FiInfo className="w-4 h-4" />
                <span>About ConfHub</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
                Empowering <span className="bg-gradient-to-r from-sky-600 to-pink-600 bg-clip-text text-transparent">Academic Excellence</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform streamlines the management of university-level conferences, providing comprehensive tools for organizers to efficiently manage tracks, sessions, and submissions. We focus on collaboration, simplicity, and success in academic events.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <BsGlobe className="w-5 h-5 text-sky-500" />
                    <span className="font-semibold text-gray-800">Global Reach</span>
                  </div>
                  <p className="text-sm text-gray-600">Connecting researchers worldwide</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <BsPeople className="w-5 h-5 text-pink-500" />
                    <span className="font-semibold text-gray-800">Community Driven</span>
                  </div>
                  <p className="text-sm text-gray-600">Built for academic communities</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-pink-400 rounded-3xl transform -rotate-6 opacity-20"></div>
              <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-sky-100">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: FiUsers, label: "Collaboration", color: "text-sky-500" },
                    { icon: FiBookOpen, label: "Knowledge", color: "text-pink-500" },
                    { icon: FiAward, label: "Excellence", color: "text-purple-500" },
                    { icon: BsFileEarmarkText, label: "Publishing", color: "text-green-500" }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-4 bg-gradient-to-br from-sky-50 to-pink-50 rounded-xl">
                      <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-2`} />
                      <div className="text-sm font-medium text-gray-800">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-sky-100 to-pink-100 rounded-full px-4 py-2 text-sm font-medium text-sky-600 mb-4">
              <FiSettings className="w-4 h-4" />
              <span>Our Services</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Comprehensive <span className="bg-gradient-to-r from-sky-600 to-pink-600 bg-clip-text text-transparent">Conference Solutions</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to organize successful academic conferences from start to finish.
            </p>
          </div>

          <div className="space-y-16">
            {[
              {
                title: "Conference Management",
                description: "Comprehensive tools for submission, review workflows, and real-time dashboards that keep conferences well-organized and efficient.",
                icon: FiSettings,
                gradient: "from-sky-500 to-blue-500"
              },
              {
                title: "Review Management",
                description: "Manage review teams and peer-review processes with automated notifications and built-in collaboration tools.",
                icon: FiUsers,
                gradient: "from-pink-500 to-rose-500"
              },
              {
                title: "Publishing & Proceedings",
                description: "Create detailed conference proceedings or publish to indexing databases, ensuring visibility for your academic contributions.",
                icon: BsFileEarmarkText,
                gradient: "from-purple-500 to-indigo-500"
              }
            ].map((service, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">{service.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{service.description}</p>
                  <button className={`inline-flex items-center space-x-2 bg-gradient-to-r ${service.gradient} hover:scale-105 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl`}>
                    <span>Learn More</span>
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-3xl transform ${index % 2 === 0 ? 'rotate-6' : '-rotate-6'} opacity-20`}></div>
                  <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-sky-100 h-64 flex items-center justify-center">
                    <service.icon className={`w-24 h-24 bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-sky-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium text-sky-600 border border-sky-200 mb-4">
              <FiMail className="w-4 h-4" />
              <span>Get In Touch</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Ready to <span className="bg-gradient-to-r from-sky-600 to-pink-600 bg-clip-text text-transparent">Get Started?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Have questions or ready to organize your next conference? We'd love to hear from you.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-sky-100">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Your Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Your Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us about your conference needs..."
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 resize-none"
                ></textarea>
              </div>
              <div className="text-center">
                <button 
                  type="submit"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FiSend className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <HiSparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-pink-400 bg-clip-text text-transparent">
                  ConfHub
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering academic excellence through seamless conference management solutions.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: BsGlobe, href: "#" },
                  { icon: FiMail, href: "#" },
                  { icon: HiLocationMarker, href: "#" }
                ].map((social, index) => (
                  <a 
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-sky-500 hover:to-pink-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <div className="space-y-2">
                {['Home', 'About Us', 'Services', 'Contact'].map((link, index) => (
                  <a 
                    key={index}
                    href={`#${link.toLowerCase().replace(' ', '')}`}
                    className="block text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Services</h4>
              <div className="space-y-2">
                {['Conference Management', 'Review Process', 'Publishing', 'Analytics'].map((service, index) => (
                  <a 
                    key={index}
                    href="#"
                    className="block text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300"
                  >
                    {service}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-400">
                  <FiMail className="w-5 h-5 text-sky-400" />
                  <span>info@confhub.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <HiLocationMarker className="w-5 h-5 text-pink-400" />
                  <span>University District</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <BsGlobe className="w-5 h-5 text-purple-400" />
                  <span>www.confhub.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                &copy; 2025 ConfHub. All rights reserved.
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;