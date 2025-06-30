
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';

export const MyAppointments = () => {
  const { user, incidents, patients } = useAuth();
  
  const patient = patients.find(p => p.id === user?.patientId);
  const myAppointments = incidents.filter(i => i.patientId === user?.patientId);
  
  const now = new Date();
  const upcomingAppointments = myAppointments.filter(i => 
    new Date(i.appointmentDate) >= now
  ).sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  
  const pastAppointments = myAppointments.filter(i => 
    new Date(i.appointmentDate) < now
  ).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  console.log('Current time:', now);
  console.log('My appointments:', myAppointments.map(a => ({ title: a.title, date: a.appointmentDate, parsed: new Date(a.appointmentDate) })));
  console.log('Upcoming appointments:', upcomingAppointments.length);
  console.log('Past appointments:', pastAppointments.length);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Scheduled': return 'bg-slate-100 text-slate-800 border-slate-200';
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
    return <div className="text-slate-900">Patient profile not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
        <p className="text-slate-600">View your scheduled and past appointments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{upcomingAppointments.length}</div>
            <p className="text-xs text-slate-600">Scheduled appointments</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {pastAppointments.filter(a => a.status === 'Completed').length}
            </div>
            <p className="text-xs text-slate-600">Total treatments</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ${myAppointments.reduce((sum, a) => sum + (a.cost || 0), 0)}
            </div>
            <p className="text-xs text-slate-600">All appointments</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Clock className="h-5 w-5 text-blue-600" />
            Upcoming Appointments ({upcomingAppointments.length})
          </CardTitle>
          <CardDescription className="text-slate-600">Your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <p className="text-center text-slate-500 py-4">No upcoming appointments</p>
            ) : (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-slate-900">{appointment.title}</h3>
                      <p className="text-sm text-slate-600">{appointment.description}</p>
                      <p className="text-sm text-slate-700 font-medium">
                        {format(new Date(appointment.appointmentDate), 'EEEE, MMMM dd, yyyy - h:mm a')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  {appointment.comments && (
                    <p className="text-sm text-slate-600 mt-2">
                      <strong>Notes:</strong> {appointment.comments}
                    </p>
                  )}
                  {appointment.nextDate && (
                    <p className="text-sm text-slate-600 mt-1">
                      <strong>Next appointment:</strong> {format(new Date(appointment.nextDate), 'MMM dd, yyyy - h:mm a')}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Calendar className="h-5 w-5 text-blue-600" />
            Past Appointments ({pastAppointments.length})
          </CardTitle>
          <CardDescription className="text-slate-600">Your appointment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastAppointments.length === 0 ? (
              <p className="text-center text-slate-500 py-4">No past appointments</p>
            ) : (
              pastAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-slate-900">{appointment.title}</h3>
                      <p className="text-sm text-slate-600">{appointment.description}</p>
                      <p className="text-sm text-slate-700">
                        {format(new Date(appointment.appointmentDate), 'EEEE, MMMM dd, yyyy - h:mm a')}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      {appointment.cost && (
                        <p className="text-sm font-medium text-slate-900 mt-1">
                          ${appointment.cost}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {appointment.treatment && (
                    <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">Treatment:</p>
                      <p className="text-sm text-blue-800">{appointment.treatment}</p>
                    </div>
                  )}
                  
                  {appointment.comments && (
                    <p className="text-sm text-slate-600 mt-2">
                      <strong>Notes:</strong> {appointment.comments}
                    </p>
                  )}
                  
                  {appointment.files && appointment.files.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-slate-900 mb-2">Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {appointment.files.map((file: any) => (
                          <Button
                            key={file.id}
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(file)}
                            className="flex items-center gap-2 text-slate-700 border-slate-300"
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
