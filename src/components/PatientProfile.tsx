
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, MapPin, Heart, Droplet, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export const PatientProfile = () => {
  const { user, patients } = useAuth();
  
  const patient = patients.find(p => p.id === user?.patientId);

  if (!patient) {
    return (
      <div className="text-slate-900">
        <h1 className="text-2xl font-bold mb-4">Patient Profile</h1>
        <p className="text-slate-600">Patient profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-600">Your personal information and health details</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Full Name</h3>
              <p className="text-slate-700">{patient.name}</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Date of Birth</h3>
              <p className="text-slate-700">{format(new Date(patient.dob), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                Contact Number
              </h3>
              <p className="text-slate-700">{patient.contact}</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Email
              </h3>
              <p className="text-slate-700">{patient.email || 'Not provided'}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                Address
              </h3>
              <p className="text-slate-700">{patient.address || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Emergency Contact</h3>
              <p className="text-slate-700">{patient.emergencyContact || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Patient Since</h3>
              <p className="text-slate-700">{format(new Date(patient.createdAt), 'MMMM dd, yyyy')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Heart className="h-5 w-5 text-red-500" />
            Health Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                <Droplet className="h-4 w-4 text-red-500" />
                Blood Group
              </h3>
              {patient.bloodGroup ? (
                <Badge variant="outline" className="text-slate-900 border-slate-300">
                  {patient.bloodGroup}
                </Badge>
              ) : (
                <p className="text-slate-500">Not specified</p>
              )}
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Allergies
              </h3>
              <p className="text-slate-700">{patient.allergies || 'None reported'}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-medium text-slate-900 mb-2">General Health Information</h3>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-slate-700">{patient.healthInfo || 'No additional health information provided'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
