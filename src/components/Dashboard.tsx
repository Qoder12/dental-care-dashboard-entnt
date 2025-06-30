
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const Dashboard = () => {
  const { user, patients, incidents } = useAuth();

  if (user?.role === 'Patient') {
    return <PatientDashboard />;
  }

  const totalPatients = patients.length;
  const upcomingAppointments = incidents.filter(i => 
    new Date(i.appointmentDate) > new Date() && i.status !== 'Cancelled'
  );
  const completedTreatments = incidents.filter(i => i.status === 'Completed');
  const totalRevenue = completedTreatments.reduce((sum, i) => sum + (i.cost || 0), 0);
  const pendingTreatments = incidents.filter(i => 
    i.status === 'Scheduled' || i.status === 'In Progress'
  );

  const nextAppointments = upcomingAppointments
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    .slice(0, 10);

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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-600">Welcome to your dental practice management system</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-medical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">Active patient records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Clock className="h-4 w-4 text-medical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-medical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
            <p className="text-xs text-muted-foreground">From completed treatments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Treatments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-medical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTreatments.length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-medical-500" />
              Next 10 Appointments
            </CardTitle>
            <CardDescription>Upcoming scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextAppointments.length === 0 ? (
                <p className="text-center text-slate-500 py-4">No upcoming appointments</p>
              ) : (
                nextAppointments.map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  return (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{patient?.name}</p>
                        <p className="text-sm text-slate-600">{appointment.title}</p>
                        <p className="text-xs text-slate-500">
                          {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy - h:mm a')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Treatment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-medical-500" />
              Treatment Overview
            </CardTitle>
            <CardDescription>Current treatment statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Completed</p>
                    <p className="text-sm text-green-700">Successfully finished</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {completedTreatments.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">In Progress</p>
                    <p className="text-sm text-blue-700">Currently ongoing</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {incidents.filter(i => i.status === 'In Progress').length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">Scheduled</p>
                    <p className="text-sm text-yellow-700">Waiting for appointment</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {incidents.filter(i => i.status === 'Scheduled').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const { user, patients, incidents } = useAuth();
  
  const patient = patients.find(p => p.id === user?.patientId);
  const patientIncidents = incidents.filter(i => i.patientId === user?.patientId);
  const upcomingAppointments = patientIncidents.filter(i => 
    new Date(i.appointmentDate) > new Date() && i.status !== 'Cancelled'
  );
  const completedTreatments = patientIncidents.filter(i => i.status === 'Completed');

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {patient.name}</h1>
        <p className="text-slate-600">Your dental care dashboard</p>
      </div>

      {/* Patient KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-medical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Treatments</CardTitle>
            <CheckCircle className="h-4 w-4 text-medical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTreatments.length}</div>
            <p className="text-xs text-muted-foreground">Total treatments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-medical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${completedTreatments.reduce((sum, t) => sum + (t.cost || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Treatment costs</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest appointments and treatments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patientIncidents.length === 0 ? (
              <p className="text-center text-slate-500 py-4">No appointments found</p>
            ) : (
              patientIncidents
                .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
                .slice(0, 5)
                .map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{incident.title}</p>
                      <p className="text-sm text-slate-600">{incident.description}</p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(incident.appointmentDate), 'MMM dd, yyyy - h:mm a')}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                      {incident.cost && (
                        <p className="text-sm font-medium text-slate-900 mt-1">
                          ${incident.cost}
                        </p>
                      )}
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
