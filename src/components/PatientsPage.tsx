
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const PatientsPage = () => {
  const { patients, addPatient, updatePatient, deletePatient } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    contact: '',
    email: '',
    address: '',
    healthInfo: '',
    bloodGroup: '',
    allergies: '',
    emergencyContact: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      dob: '',
      contact: '',
      email: '',
      address: '',
      healthInfo: '',
      bloodGroup: '',
      allergies: '',
      emergencyContact: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPatient) {
      updatePatient(editingPatient, formData);
      toast.success('Patient updated successfully');
      setEditingPatient(null);
    } else {
      addPatient(formData);
      toast.success('Patient added successfully');
      setShowAddDialog(false);
    }
    
    resetForm();
  };

  const handleEdit = (patient: any) => {
    setFormData({
      name: patient.name || '',
      dob: patient.dob || '',
      contact: patient.contact || '',
      email: patient.email || '',
      address: patient.address || '',
      healthInfo: patient.healthInfo || '',
      bloodGroup: patient.bloodGroup || '',
      allergies: patient.allergies || '',
      emergencyContact: patient.emergencyContact || ''
    });
    setEditingPatient(patient.id);
  };

  const handleDelete = (patientId: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      deletePatient(patientId);
      toast.success('Patient deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Management</h1>
          <p className="text-slate-600">Manage patient records and information</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>Enter patient information below</DialogDescription>
            </DialogHeader>
            <PatientForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowAddDialog(false);
                resetForm();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Patients ({patients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{format(new Date(patient.dob), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{patient.contact}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>
                    {patient.bloodGroup && (
                      <Badge variant="outline">{patient.bloodGroup}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(patient)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(patient.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingPatient && (
        <Dialog open={true} onOpenChange={() => setEditingPatient(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Patient</DialogTitle>
              <DialogDescription>Update patient information</DialogDescription>
            </DialogHeader>
            <PatientForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => {
                setEditingPatient(null);
                resetForm();
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface PatientFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const PatientForm = ({ formData, setFormData, onSubmit, onCancel }: PatientFormProps) => {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="dob">Date of Birth *</Label>
          <Input
            id="dob"
            type="date"
            value={formData.dob}
            onChange={(e) => handleChange('dob', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="contact">Contact Number *</Label>
          <Input
            id="contact"
            value={formData.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <Input
            id="bloodGroup"
            value={formData.bloodGroup}
            onChange={(e) => handleChange('bloodGroup', e.target.value)}
            placeholder="e.g., O+, A-, B+"
          />
        </div>
        <div>
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input
            id="emergencyContact"
            value={formData.emergencyContact}
            onChange={(e) => handleChange('emergencyContact', e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          rows={2}
        />
      </div>
      
      <div>
        <Label htmlFor="healthInfo">Health Information</Label>
        <Textarea
          id="healthInfo"
          value={formData.healthInfo}
          onChange={(e) => handleChange('healthInfo', e.target.value)}
          rows={2}
        />
      </div>
      
      <div>
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea
          id="allergies"
          value={formData.allergies}
          onChange={(e) => handleChange('allergies', e.target.value)}
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Patient</Button>
      </div>
    </form>
  );
};
