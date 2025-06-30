
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, Activity, FileText } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, isWithinInterval } from 'date-fns';

export const ReportsPage = () => {
  const { patients, incidents } = useAuth();

  // Calculate statistics
  const totalPatients = patients.length;
  const totalAppointments = incidents.length;
  const completedAppointments = incidents.filter(i => i.status === 'Completed').length;
  const totalRevenue = incidents.filter(i => i.status === 'Completed').reduce((sum, i) => sum + (i.cost || 0), 0);

  // Status distribution
  const statusData = [
    { name: 'Completed', value: incidents.filter(i => i.status === 'Completed').length, color: '#22c55e' },
    { name: 'Scheduled', value: incidents.filter(i => i.status === 'Scheduled').length, color: '#eab308' },
    { name: 'In Progress', value: incidents.filter(i => i.status === 'In Progress').length, color: '#3b82f6' },
    { name: 'Cancelled', value: incidents.filter(i => i.status === 'Cancelled').length, color: '#ef4444' }
  ];

  // Monthly revenue data
  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date()
  });

  const monthlyRevenue = last6Months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthIncidents = incidents.filter(i => 
      i.status === 'Completed' && 
      isWithinInterval(new Date(i.appointmentDate), { start: monthStart, end: monthEnd })
    );
    const revenue = monthIncidents.reduce((sum, i) => sum + (i.cost || 0), 0);
    
    return {
      month: format(month, 'MMM yyyy'),
      revenue: revenue,
      appointments: monthIncidents.length
    };
  });

  // Treatment type data
  const treatmentTypes = incidents.reduce((acc, incident) => {
    const title = incident.title;
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const treatmentData = Object.entries(treatmentTypes).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count).slice(0, 6);

  // Top patients by visits
  const patientVisits = patients.map(patient => {
    const visits = incidents.filter(i => i.patientId === patient.id).length;
    const totalSpent = incidents
      .filter(i => i.patientId === patient.id && i.status === 'Completed')
      .reduce((sum, i) => sum + (i.cost || 0), 0);
    
    return {
      name: patient.name,
      visits,
      totalSpent
    };
  }).sort((a, b) => b.visits - a.visits).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-slate-600">Comprehensive insights into your dental practice</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalPatients}</div>
            <p className="text-xs text-slate-600">Active patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalAppointments}</div>
            <p className="text-xs text-slate-600">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Completion Rate</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0}%
            </div>
            <p className="text-xs text-slate-600">{completedAppointments} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">${totalRevenue}</div>
            <p className="text-xs text-slate-600">From completed treatments</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Monthly Revenue
            </CardTitle>
            <CardDescription>Revenue trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#1e293b'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <FileText className="h-5 w-5 text-blue-600" />
              Appointment Status
            </CardTitle>
            <CardDescription>Distribution of appointment statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#1e293b'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treatment Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Popular Treatments</CardTitle>
            <CardDescription>Most common treatment types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={treatmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#1e293b'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Top Patients</CardTitle>
            <CardDescription>Patients with most visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patientVisits.map((patient, index) => (
                <div key={patient.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{patient.name}</p>
                      <p className="text-sm text-slate-600">{patient.visits} visits</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">${patient.totalSpent}</p>
                    <p className="text-sm text-slate-600">total spent</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
