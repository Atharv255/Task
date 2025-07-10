import { useState, useEffect } from 'react';
import { projectsAPI, clientsAPI, contactsAPI, newsletterAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Briefcase, 
  Mail, 
  MessageSquare,
  Home,
  Calendar
} from 'lucide-react';
import ImageCropper from '../components/ImageCropper';
import '../App.css';

const AdminPanel = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form states
  const [projectForm, setProjectForm] = useState({ name: '', description: '', image: null });
  const [clientForm, setClientForm] = useState({ name: '', description: '', designation: '', image: null });
  const [editingProject, setEditingProject] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [projectsRes, clientsRes, contactsRes, newslettersRes] = await Promise.all([
        projectsAPI.getAll(),
        clientsAPI.getAll(),
        contactsAPI.getAll(),
        newsletterAPI.getAll()
      ]);
      
      setProjects(projectsRes.data);
      setClients(clientsRes.data);
      setContacts(contactsRes.data);
      setNewsletters(newslettersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error loading data');
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setImageError('');
    setLoading(true);

    if (!projectForm.image) {
      setImageError('Please select and crop an image before submitting.');
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', projectForm.name);
      formData.append('description', projectForm.description);
      if (projectForm.image) {
        formData.append('image', projectForm.image);
      }

      if (editingProject) {
        await projectsAPI.update(editingProject._id, formData);
        setMessage('Project updated successfully!');
      } else {
        await projectsAPI.create(formData);
        setMessage('Project created successfully!');
      }
      
      setProjectForm({ name: '', description: '', image: null });
      setEditingProject(null);
      setShowProjectDialog(false);
      fetchAllData();
    } catch (error) {
      setMessage('Error saving project');
    }
    
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', clientForm.name);
      formData.append('description', clientForm.description);
      formData.append('designation', clientForm.designation);
      if (clientForm.image) {
        formData.append('image', clientForm.image);
      }

      if (editingClient) {
        await clientsAPI.update(editingClient._id, formData);
        setMessage('Client updated successfully!');
      } else {
        await clientsAPI.create(formData);
        setMessage('Client created successfully!');
      }
      
      setClientForm({ name: '', description: '', designation: '', image: null });
      setEditingClient(null);
      setShowClientDialog(false);
      fetchAllData();
    } catch (error) {
      setMessage('Error saving client');
    }
    
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        setMessage('Project deleted successfully!');
        fetchAllData();
      } catch (error) {
        setMessage('Error deleting project');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientsAPI.delete(id);
        setMessage('Client deleted successfully!');
        fetchAllData();
      } catch (error) {
        setMessage('Error deleting client');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactsAPI.delete(id);
        setMessage('Contact deleted successfully!');
        fetchAllData();
      } catch (error) {
        setMessage('Error deleting contact');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteNewsletter = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await newsletterAPI.unsubscribe(id);
        setMessage('Subscription deleted successfully!');
        fetchAllData();
      } catch (error) {
        setMessage('Error deleting subscription');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const openProjectDialog = (project = null) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({
        name: project.name,
        description: project.description,
        image: null
      });
    } else {
      setEditingProject(null);
      setProjectForm({ name: '', description: '', image: null });
    }
    setShowProjectDialog(true);
  };

  const openClientDialog = (client = null) => {
    if (client) {
      setEditingClient(client);
      setClientForm({
        name: client.name,
        description: client.description,
        designation: client.designation,
        image: null
      });
    } else {
      setEditingClient(null);
      setClientForm({ name: '', description: '', designation: '', image: null });
    }
    setShowClientDialog(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setRawImage(ev.target.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob) => {
    setProjectForm({ ...projectForm, image: new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' }) });
    setShowCropper(false);
    setRawImage(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setRawImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Home className="w-4 h-4 mr-2" />
              Back to Site
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{newsletters.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Project Management</CardTitle>
                    <CardDescription>Manage your portfolio projects</CardDescription>
                  </div>
                  <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => openProjectDialog()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white">
                      <DialogHeader>
                        <DialogTitle>
                          {editingProject ? 'Edit Project' : 'Add New Project'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingProject ? 'Update project details' : 'Create a new project for your portfolio'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleProjectSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Project Name</label>
                          <Input
                            value={projectForm.name}
                            onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                            required
                            placeholder="Enter project name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Description</label>
                          <Textarea
                            value={projectForm.description}
                            onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                            required
                            placeholder="Enter project description"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Project Image</label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required={!editingProject}
                          />
                          {showCropper && rawImage && (
                            <ImageCropper
                              image={rawImage}
                              aspect={16/9}
                              onCropComplete={handleCropComplete}
                              onCancel={handleCropCancel}
                            />
                          )}
                          {imageError && (
                            <div className="text-red-500 text-xs mt-1">{imageError}</div>
                          )}
                        </div>
                        <Button type="submit" disabled={loading || !projectForm.image} className="w-full">
                          {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project._id} className="overflow-hidden">
                      <div className="relative w-full aspect-[16/9] bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${project.image}`}
                          alt={project.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1 z-10">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => openProjectDialog(project)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProject(project._id)}
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                        <p className="text-gray-600 text-sm">{project.description}</p>
                        <div className="mt-3 flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Client Management</CardTitle>
                    <CardDescription>Manage client testimonials and information</CardDescription>
                  </div>
                  <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => openClientDialog()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Client
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white">
                      <DialogHeader>
                        <DialogTitle>
                          {editingClient ? 'Edit Client' : 'Add New Client'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingClient ? 'Update client details' : 'Add a new client testimonial'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleClientSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Client Name</label>
                          <Input
                            value={clientForm.name}
                            onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
                            required
                            placeholder="Enter client name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Designation</label>
                          <Input
                            value={clientForm.designation}
                            onChange={(e) => setClientForm({...clientForm, designation: e.target.value})}
                            required
                            placeholder="e.g., CEO, Web Developer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Testimonial</label>
                          <Textarea
                            value={clientForm.description}
                            onChange={(e) => setClientForm({...clientForm, description: e.target.value})}
                            required
                            placeholder="Enter client testimonial"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Client Photo</label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setClientForm({...clientForm, image: e.target.files[0]})}
                            required={!editingClient}
                          />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full">
                          {loading ? 'Saving...' : (editingClient ? 'Update Client' : 'Add Client')}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clients.map((client) => (
                    <Card key={client._id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-3">
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${client.image}`}
                            alt={client.name}
                            className="w-12 h-12 rounded-full object-cover mr-3"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{client.name}</h3>
                            <p className="text-sm text-gray-600">{client.designation}</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => openClientDialog(client)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteClient(client._id)}
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm italic">"{client.description}"</p>
                        <div className="mt-3 flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(client.createdAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Form Submissions</CardTitle>
                <CardDescription>View and manage contact form responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <Card key={contact._id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Name</p>
                              <p className="font-semibold">{contact.fullName}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Email</p>
                              <p className="font-semibold">{contact.email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Mobile</p>
                              <p className="font-semibold">{contact.mobileNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">City</p>
                              <p className="font-semibold">{contact.city}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </Badge>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteContact(contact._id)}
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletter">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscriptions</CardTitle>
                <CardDescription>View and manage newsletter subscribers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsletters.map((newsletter) => (
                    <Card key={newsletter._id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Mail className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold">{newsletter.email}</p>
                              <p className="text-sm text-gray-600">
                                Subscribed on {new Date(newsletter.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteNewsletter(newsletter._id)}
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Message Toast */}
      {message && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

