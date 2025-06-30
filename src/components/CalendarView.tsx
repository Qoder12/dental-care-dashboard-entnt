
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export const CalendarView = () => {
  const { patients, incidents } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDayDialog, setShowDayDialog] = useState(false);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<any[]>([]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    const dayAppointments = incidents.filter(incident => 
      isSameDay(new Date(incident.appointmentDate), date)
    );
    
    if (dayAppointments.length > 0) {
      setSelectedDayAppointments(dayAppointments);
      setShowDayDialog(true);
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return incidents.filter(incident => 
      isSameDay(new Date(incident.appointmentDate), date)
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

  const currentMonth = startOfMonth(selectedDate);
  const endOfCurrentMonth = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: currentMonth, end: endOfCurrentMonth });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Calendar View</h1>
        <p className="text-slate-600">View appointments scheduled for each day</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(selectedDate, 'MMMM yyyy')}
            </CardTitle>
            <CardDescription>
              Click on a date to view scheduled appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border pointer-events-auto"
              modifiers={{
                hasAppointments: (date) => getAppointmentsForDate(date).length > 0
              }}
              modifiersStyles={{
                hasAppointments: { 
                  backgroundColor: '#dbeafe', 
                  color: '#1e40af',
                  fontWeight: 'bold'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>
              {format(new Date(), 'MMMM dd, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getAppointmentsForDate(new Date()).map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                  <div key={appointment.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900">{patient?.name}</p>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{appointment.title}</p>
                    <p className="text-xs text-slate-500">
                      {format(new Date(appointment.appointmentDate), 'h:mm a')}
                    </p>
                  </div>
                );
              })}
              {getAppointmentsForDate(new Date()).length === 0 && (
                <p className="text-center text-slate-500 py-4">
                  No appointments today
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
          <CardDescription>
            Appointment summary for {format(selectedDate, 'MMMM yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const dayAppointments = getAppointmentsForDate(day);
              return (
                <div
                  key={day.toISOString()}
                  className={`p-2 border rounded cursor-pointer hover:bg-slate-50 ${
                    dayAppointments.length > 0 ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleDateSelect(day)}
                >
                  <div className="text-sm font-medium text-slate-900">
                    {format(day, 'd')}
                  </div>
                  {dayAppointments.length > 0 && (
                    <div className="text-xs text-blue-600 mt-1">
                      {dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Details Dialog */}
      <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Appointments for {format(selectedDate, 'MMMM dd, yyyy')}
            </DialogTitle>
            <DialogDescription>
              {selectedDayAppointments.length} appointment{selectedDayAppointments.length !== 1 ? 's' : ''} scheduled
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDayAppointments.map((appointment) => {
              const patient = patients.find(p => p.id === appointment.patientId);
              return (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-slate-900">{appointment.title}</h3>
                      <p className="text-sm text-slate-600">Patient: {patient?.name}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <p className="text-sm text-slate-500 mt-1">
                        {format(new Date(appointment.appointmentDate), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">{appointment.description}</p>
                  {appointment.cost && (
                    <p className="text-sm font-medium text-slate-900 mt-2">
                      Cost: ${appointment.cost}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
