
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Upload, File, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const AppointmentsPage = () => {
  const { patients, incidents, addIncident, updateIncident, deleteIncident, uploadFile } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingIncident, setEditingIncident] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    comments: '',
    appointmentDate: '',
    cost: '',
    treatment: '',
    status: 'Scheduled' as 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled',
    nextDate: '',
    files: [] as any[]
  });

  const resetForm = () => {
    setFormData({
      patientId: '',
      title: '',
      description: '',
      comments: '',
      appointmentDate: '',
      cost: '',
      treatment: '',
      status: 'Scheduled',
      nextDate: '',
      files: []
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const incidentData = {
      ...formData,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      nextDate: formData.nextDate || undefined
    };
    
    if (editingIncident) {
      updateIncident(editingIncident, incidentData);
      toast.success('Appointment updated successfully');
      setEditingIncident(null);
    } else {
      addIncident(incidentData);
      toast.success('Appointment scheduled successfully');
      setShowAddDialog(false);
    }
    
    resetForm();
  };

  const handleEdit = (incident: any) => {
    setFormData({
      patientId: incident.patientId,
      title: incident.title,
      description: incident.description,
      comments: incident.comments || '',
      appointmentDate: incident.appointmentDate.slice(0, 16),
      cost: incident.cost?.toString() || '',
      treatment: incident.treatment || '',
      status: incident.status,
      nextDate: incident.nextDate ? incident.nextDate.slice(0, 16) : '',
      files: incident.files || []
    });
    setEditingIncident(incident.id);
  };

  const handleDelete = (incidentId: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      deleteIncident(incidentId);
      toast.success('Appointment deleted successfully');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const uploadedFile = await uploadFile(file);
        uploadedFiles.push(uploadedFile);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (uploadedFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...uploadedFiles]
      }));
      toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
    }
  };

  const removeFile = (fileId: string) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointment Management</h1>
          <p className="text-slate-600">Schedule and manage patient appointments</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>Create a new appointment for a patient</DialogDescription>
            </DialogHeader>
            <AppointmentForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowAddDialog(false);
                resetForm();
              }}
              patients={patients}
              onFileUpload={handleFileUpload}
              onRemoveFile={removeFile}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            All Appointments ({incidents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => {
                const patient = patients.find(p => p.id === incident.patientId);
                return (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">{patient?.name}</TableCell>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>
                      {format(new Date(incident.appointmentDate), 'MMM dd, yyyy - h:mm a')}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {incident.cost ? `$${incident.cost}` : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(incident)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(incident.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingIncident && (
        <Dialog open={true} onOpenChange={() => setEditingIncident(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Appointment</DialogTitle>
              <DialogDescription>Update appointment details</DialogDescription>
            </DialogHeader>
            <AppointmentForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => {
                setEditingIncident(null);
                resetForm();
              }}
              patients={patients}
              onFileUpload={handleFileUpload}
              onRemoveFile={removeFile}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface AppointmentFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  patients: any[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (fileId: string) => void;
}

const AppointmentForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  patients, 
  onFileUpload, 
  onRemoveFile 
}: AppointmentFormProps) => {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientId">Patient *</Label>
          <Select value={formData.patientId} onValueChange={(value) => handleChange('patientId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="appointmentDate">Appointment Date & Time *</Label>
          <Input
            id="appointmentDate"
            type="datetime-local"
            value={formData.appointmentDate}
            onChange={(e) => handleChange('appointmentDate', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Routine Cleaning, Root Canal"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Detailed description of the appointment"
          required
        />
      </div>

      <div>
        <Label htmlFor="comments">Comments</Label>
        <Textarea
          id="comments"
          value={formData.comments}
          onChange={(e) => handleChange('comments', e.target.value)}
          placeholder="Additional notes or observations"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="cost">Cost ($)</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost}
            onChange={(e) => handleChange('cost', e.target.value)}
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="treatment">Treatment</Label>
        <Textarea
          id="treatment"
          value={formData.treatment}
          onChange={(e) => handleChange('treatment', e.target.value)}
          placeholder="Treatment details"
        />
      </div>

      <div>
        <Label htmlFor="nextDate">Next Appointment Date</Label>
        <Input
          id="nextDate"
          type="datetime-local"
          value={formData.nextDate}
          onChange={(e) => handleChange('nextDate', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="files">Upload Files</Label>
        <Input
          id="files"
          type="file"
          multiple
          onChange={onFileUpload}
          accept="image/*,.pdf,.doc,.docx"
          className="mb-2"
        />
        {formData.files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">Uploaded files:</p>
            {formData.files.map((file: any) => (
              <div key={file.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-slate-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Appointment</Button>
      </div>
    </form>
  );
};
