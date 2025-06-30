
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  FileText,
  Activity
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const adminNavItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Incidents', href: '/incidents', icon: ClipboardList },
  { name: 'Reports', href: '/reports', icon: FileText },
];

const patientNavItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'My Profile', href: '/profile', icon: Users },
  { name: 'Appointments', href: '/my-appointments', icon: Calendar },
  { name: 'Medical History', href: '/medical-history', icon: Activity },
];

export const Sidebar = () => {
  const { user } = useAuth();
  const navItems = user?.role === 'Admin' ? adminNavItems : patientNavItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 bg-medical-500 rounded-lg flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">DentalCare</h2>
            <p className="text-xs text-slate-600">Management System</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-medical-100 text-medical-800 border border-medical-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
