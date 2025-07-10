import { useState, useEffect } from 'react';
import { projectsAPI, clientsAPI, contactsAPI, newsletterAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Star, Mail, Phone, MapPin, ArrowRight, Users, Briefcase, Award, Menu } from 'lucide-react';
import '../App.css';

const LandingPage = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    city: ''
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientsAPI.getAll();
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactsAPI.create(contactForm);
      setMessage('Thank you for your message! We will get back to you soon.');
      setContactForm({ fullName: '', email: '', mobileNumber: '', city: '' });
    } catch (error) {
      setMessage('Error submitting form. Please try again.');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await newsletterAPI.subscribe(newsletterEmail);
      setMessage('Successfully subscribed to newsletter!');
      setNewsletterEmail('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error subscribing to newsletter.');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#projects" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Projects</a>
              <a href="#clients" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Clients</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Contact</a>
              <a href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                Admin
              </a>
            </nav>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          {/* Mobile Nav */}
          {mobileNavOpen && (
            <nav className="md:hidden flex flex-col space-y-2 pb-4 animate-fade-in-down">
              <a href="#projects" className="text-gray-700 hover:text-blue-600 font-medium px-2 py-2 rounded transition-colors duration-200" onClick={() => setMobileNavOpen(false)}>Projects</a>
              <a href="#clients" className="text-gray-700 hover:text-blue-600 font-medium px-2 py-2 rounded transition-colors duration-200" onClick={() => setMobileNavOpen(false)}>Clients</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium px-2 py-2 rounded transition-colors duration-200" onClick={() => setMobileNavOpen(false)}>Contact</a>
              <a href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium" onClick={() => setMobileNavOpen(false)}>
                Admin
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Building Amazing Digital Experiences
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            We create innovative solutions that help businesses grow and succeed in the digital world.
            From web development to mobile apps, we deliver excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
              View Our Work <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="border-gray-300 hover:bg-gray-50 transition-colors duration-200">
              Get In Touch
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{projects.length}+</h3>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{clients.length}+</h3>
              <p className="text-gray-600">Happy Clients</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">5+</h3>
              <p className="text-gray-600">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Projects</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our latest work and see how we've helped businesses achieve their goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project._id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${project.image}`}
                    alt={project.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-gray-600 mb-4">
                    {project.description}
                  </CardDescription>
                  <div className="mt-auto">
                    <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      Read More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Happy Clients Section */}
      <section id="clients" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Happy Clients</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about working with us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clients.map((client) => (
              <Card key={client._id} className="bg-white hover:shadow-lg transition-shadow duration-300 h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic flex-grow">"{client.description}"</p>
                  <div className="flex items-center mt-auto">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${client.image}`}
                      alt={client.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{client.name}</h4>
                      <p className="text-sm text-gray-500">{client.designation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">
              Ready to start your next project? Let's discuss how we can help you achieve your goals.
            </p>
          </div>
          
          <Card className="bg-white shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={contactForm.fullName}
                      onChange={(e) => setContactForm({...contactForm, fullName: e.target.value})}
                      required
                      className="w-full"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                      className="w-full"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number *
                    </label>
                    <Input
                      type="tel"
                      value={contactForm.mobileNumber}
                      onChange={(e) => setContactForm({...contactForm, mobileNumber: e.target.value})}
                      required
                      className="w-full"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <Input
                      type="text"
                      value={contactForm.city}
                      onChange={(e) => setContactForm({...contactForm, city: e.target.value})}
                      required
                      className="w-full"
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 transition-colors duration-200"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-blue-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Mail className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-xl text-blue-100">
              Subscribe to our newsletter and get the latest updates on our projects and services.
            </p>
          </div>
          
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              className="flex-1 bg-white focus:ring-2 focus:ring-blue-300"
              placeholder="Enter your email address"
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-white text-blue-600 hover:bg-gray-100 transition-colors duration-200"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Portfolio</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Building amazing digital experiences that help businesses grow and succeed.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#projects" className="text-gray-400 hover:text-white transition-colors duration-200">Projects</a></li>
                <li><a href="#clients" className="text-gray-400 hover:text-white transition-colors duration-200">Clients</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
                <li><a href="/admin" className="text-gray-400 hover:text-white transition-colors duration-200">Admin</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-400 hover:text-white transition-colors duration-200">info@portfolio.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-400 hover:text-white transition-colors duration-200">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-400 hover:text-white transition-colors duration-200">New York, NY</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Portfolio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Message Toast */}
      {message && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up">
          {message}
        </div>
      )}
    </div>
  );
};

export default LandingPage;