
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, DollarSign, Activity } from 'lucide-react';
import { format } from 'date-fns';

export const MedicalHistory = () => {
  const { user, incidents, patients } = useAuth();
  
  const patient = patients.find(p => p.id === user?.patientId);
  const medicalHistory = incidents
    .filter(i => i.patientId === user?.patientId)
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  const completedTreatments = medicalHistory.filter(i => i.status === 'Completed');
  const totalCost = completedTreatments.reduce((sum, i) => sum + (i.cost || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const downloadFile = (file: any) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!patient) {
    return (
      <div className="text-slate-900">
        <h1 className="text-2xl font-bold mb-4">Medical History</h1>
        <p className="text-slate-600">Patient profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Medical History</h1>
        <p className="text-slate-600">Complete history of your dental treatments and procedures</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Visits</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{medicalHistory.length}</div>
            <p className="text-xs text-slate-600">All appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Completed Treatments</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{completedTreatments.length}</div>
            <p className="text-xs text-slate-600">Successful procedures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">${totalCost}</div>
            <p className="text-xs text-slate-600">All treatments</p>
          </CardContent>
        </Card>
      </div>

      {/* Treatment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <FileText className="h-5 w-5 text-blue-600" />
            Treatment History
          </CardTitle>
          <CardDescription>Chronological record of all your dental procedures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {medicalHistory.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No medical history available</p>
            ) : (
              medicalHistory.map((treatment, index) => (
                <div key={treatment.id} className="relative">
                  {index < medicalHistory.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-200"></div>
                  )}
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-slate-900 text-lg">{treatment.title}</h3>
                            <p className="text-sm text-slate-600">
                              {format(new Date(treatment.appointmentDate), 'EEEE, MMMM dd, yyyy - h:mm a')}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={`border ${getStatusColor(treatment.status)}`}>
                              {treatment.status}
                            </Badge>
                            {treatment.cost && (
                              <span className="font-semibold text-slate-900">${treatment.cost}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-slate-900 mb-1">Description</h4>
                            <p className="text-slate-700">{treatment.description}</p>
                          </div>
                          
                          {treatment.treatment && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <h4 className="font-medium text-blue-900 mb-1">Treatment Details</h4>
                              <p className="text-blue-800 text-sm">{treatment.treatment}</p>
                            </div>
                          )}
                          
                          {treatment.comments && (
                            <div>
                              <h4 className="font-medium text-slate-900 mb-1">Doctor's Notes</h4>
                              <p className="text-slate-700 text-sm italic">"{treatment.comments}"</p>
                            </div>
                          )}
                          
                          {treatment.nextDate && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                              <h4 className="font-medium text-yellow-900 mb-1">Follow-up Scheduled</h4>
                              <p className="text-yellow-800 text-sm">
                                {format(new Date(treatment.nextDate), 'MMMM dd, yyyy - h:mm a')}
                              </p>
                            </div>
                          )}
                          
                          {treatment.files && treatment.files.length > 0 && (
                            <div>
                              <h4 className="font-medium text-slate-900 mb-2">Attachments</h4>
                              <div className="flex flex-wrap gap-2">
                                {treatment.files.map((file: any) => (
                                  <Button
                                    key={file.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadFile(file)}
                                    className="flex items-center gap-2 text-slate-700 border-slate-300 hover:bg-slate-50"
                                  >
                                    <FileText className="h-4 w-4" />
                                    {file.name}
                                    <Download className="h-3 w-3" />
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
