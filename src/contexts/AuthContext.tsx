
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Patient';
  patientId?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  email?: string;
  address?: string;
  healthInfo: string;
  bloodGroup?: string;
  allergies?: string;
  emergencyContact?: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;
  cost?: number;
  treatment?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  nextDate?: string;
  files?: FileAttachment[];
  createdAt: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

interface AuthContextType {
  user: User | null;
  patients: Patient[];
  incidents: Incident[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addIncident: (incident: Omit<Incident, 'id' | 'createdAt'>) => void;
  updateIncident: (id: string, incident: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
  getPatientIncidents: (patientId: string) => Incident[];
  uploadFile: (file: File) => Promise<FileAttachment>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: User[] = [
  { id: '1', role: 'Admin', email: 'admin@entnt.in' },
  { id: '2', role: 'Patient', email: 'john@entnt.in', patientId: 'p1' },
  { id: '3', role: 'Patient', email: 'jane@entnt.in', patientId: 'p2' },
  { id: '4', role: 'Patient', email: 'bob@entnt.in', patientId: 'p3' }
];

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'John Doe',
    dob: '1990-05-10',
    contact: '1234567890',
    email: 'john@entnt.in',
    address: '123 Main St, New York, NY 10001',
    healthInfo: 'No known allergies. Regular dental checkups.',
    bloodGroup: 'O+',
    allergies: 'None',
    emergencyContact: '9876543210',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'p2',
    name: 'Jane Smith',
    dob: '1985-08-22',
    contact: '2345678901',
    email: 'jane@entnt.in',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    healthInfo: 'Diabetic, takes medication daily. History of gum disease.',
    bloodGroup: 'A+',
    allergies: 'Penicillin, Latex',
    emergencyContact: '8765432109',
    createdAt: '2024-02-10T14:30:00Z'
  },
  {
    id: 'p3',
    name: 'Bob Johnson',
    dob: '1978-12-03',
    contact: '3456789012',
    email: 'bob@entnt.in',
    address: '789 Pine Rd, Chicago, IL 60601',
    healthInfo: 'High blood pressure, previous root canal treatment.',
    bloodGroup: 'B-',
    allergies: 'Latex, Aspirin',
    emergencyContact: '7654321098',
    createdAt: '2024-03-05T09:15:00Z'
  }
];

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'i1',
    patientId: 'p1',
    title: 'Routine Cleaning',
    description: 'Regular dental cleaning and fluoride treatment',
    comments: 'Patient has excellent oral hygiene. No issues found.',
    appointmentDate: '2024-07-15T10:00:00',
    cost: 120,
    treatment: 'Professional cleaning, fluoride application, oral health assessment',
    status: 'Completed',
    files: [
      {
        id: 'f1',
        name: 'cleaning_invoice.pdf',
        type: 'application/pdf',
        url: 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQJQL0+4BXQJKQ4AJZlhZgMZgJgBhBwC6ZwJoATM4oZvJU5ZAH0Ak8BkBg8ACCAA8AEQAVABMAEoARABDACEAAAA8eNoBXkJT8M8Acxwyk8lgASkB8DYGZAAgOhYZgcHQGgJLaWJVAELc2sSXZP8GZBBBIKzSzqAJc8sEDRsZGcCAQGAgID8yNdoAAkAALNAQQ4e8tKQcAAAaAFCCM0ZCZQgHJQJ7VXQJTABGQAR2AAAAVgAQBgAIZBEKJApAAQAAaGRZeU1m3jOAA8dkBmY7oGAQfHJgJQKChAIHkJGCAOgOyZcUmAALAZgIAAdEAUADQAFAZEaAJAQYRAR2CAAyAAaCAUADQAFAAEAFQARABUAFQARAAD2CyAAAQAVABEAFYH5JHgA=',
        size: 12480
      }
    ],
    createdAt: '2024-06-01T10:00:00Z'
  },
  {
    id: 'i2',
    patientId: 'p1',
    title: 'Tooth Sensitivity Treatment',
    description: 'Treatment for cold sensitivity in upper molar',
    comments: 'Applied desensitizing gel. Patient reports improvement.',
    appointmentDate: '2024-08-01T14:30:00',
    cost: 80,
    treatment: 'Desensitizing treatment, fluoride varnish application',
    status: 'Completed',
    nextDate: '2024-09-15T14:30:00',
    files: [],
    createdAt: '2024-06-15T14:00:00Z'
  },
  {
    id: 'i3',
    patientId: 'p2',
    title: 'Composite Filling',
    description: 'Small cavity filling in lower left molar',
    comments: 'Patient tolerated procedure well. No complications.',
    appointmentDate: '2024-08-10T11:00:00',
    cost: 150,
    treatment: 'Composite resin filling, bite adjustment',
    status: 'Completed',
    files: [
      {
        id: 'f2',
        name: 'xray_before.jpg',
        type: 'image/jpeg',
        url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
        size: 2048
      }
    ],
    createdAt: '2024-06-20T11:00:00Z'
  },
  {
    id: 'i4',
    patientId: 'p3',
    title: 'Root Canal Treatment - Session 1',
    description: 'Initial root canal procedure for infected tooth #14',
    comments: 'Infection present, cleaned canals, temporary filling placed.',
    appointmentDate: '2024-07-30T09:00:00',
    cost: 400,
    treatment: 'Root canal cleaning, disinfection, temporary filling',
    status: 'Completed',
    nextDate: '2024-08-15T09:00:00',
    files: [],
    createdAt: '2024-06-25T09:00:00Z'
  },
  {
    id: 'i5',
    patientId: 'p1',
    title: 'Teeth Whitening',
    description: 'Professional teeth whitening treatment',
    comments: 'Patient very satisfied with results.',
    appointmentDate: '2024-09-15T14:30:00',
    status: 'Scheduled',
    files: [],
    createdAt: '2024-07-01T14:00:00Z'
  },
  {
    id: 'i6',
    patientId: 'p2',
    title: 'Periodontal Maintenance',
    description: 'Deep cleaning and gum health assessment',
    comments: 'Gum inflammation reduced significantly.',
    appointmentDate: '2024-08-20T10:00:00',
    status: 'Scheduled',
    files: [],
    createdAt: '2024-07-05T10:00:00Z'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);

  useEffect(() => {
    // Load data from localStorage
    const storedUser = localStorage.getItem('dental-user');
    const storedPatients = localStorage.getItem('dental-patients');
    const storedIncidents = localStorage.getItem('dental-incidents');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    } else {
      localStorage.setItem('dental-patients', JSON.stringify(INITIAL_PATIENTS));
    }

    if (storedIncidents) {
      setIncidents(JSON.parse(storedIncidents));
    } else {
      localStorage.setItem('dental-incidents', JSON.stringify(INITIAL_INCIDENTS));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate authentication
    const mockUser = MOCK_USERS.find(u => u.email === email);
    
    // Simple password validation (in real app, this would be hashed)
    const validPasswords = {
      'admin@entnt.in': 'admin123',
      'john@entnt.in': 'patient123',
      'jane@entnt.in': 'patient123',
      'bob@entnt.in': 'patient123'
    };

    if (mockUser && validPasswords[email as keyof typeof validPasswords] === password) {
      setUser(mockUser);
      localStorage.setItem('dental-user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dental-user');
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    localStorage.setItem('dental-patients', JSON.stringify(updatedPatients));
  };

  const updatePatient = (id: string, patientData: Partial<Patient>) => {
    const updatedPatients = patients.map(p => 
      p.id === id ? { ...p, ...patientData } : p
    );
    setPatients(updatedPatients);
    localStorage.setItem('dental-patients', JSON.stringify(updatedPatients));
  };

  const deletePatient = (id: string) => {
    const updatedPatients = patients.filter(p => p.id !== id);
    const updatedIncidents = incidents.filter(i => i.patientId !== id);
    setPatients(updatedPatients);
    setIncidents(updatedIncidents);
    localStorage.setItem('dental-patients', JSON.stringify(updatedPatients));
    localStorage.setItem('dental-incidents', JSON.stringify(updatedIncidents));
  };

  const addIncident = (incidentData: Omit<Incident, 'id' | 'createdAt'>) => {
    const newIncident: Incident = {
      ...incidentData,
      id: `i${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updatedIncidents = [...incidents, newIncident];
    setIncidents(updatedIncidents);
    localStorage.setItem('dental-incidents', JSON.stringify(updatedIncidents));
  };

  const updateIncident = (id: string, incidentData: Partial<Incident>) => {
    const updatedIncidents = incidents.map(i => 
      i.id === id ? { ...i, ...incidentData } : i
    );
    setIncidents(updatedIncidents);
    localStorage.setItem('dental-incidents', JSON.stringify(updatedIncidents));
  };

  const deleteIncident = (id: string) => {
    const updatedIncidents = incidents.filter(i => i.id !== id);
    setIncidents(updatedIncidents);
    localStorage.setItem('dental-incidents', JSON.stringify(updatedIncidents));
  };

  const getPatientIncidents = (patientId: string) => {
    return incidents.filter(i => i.patientId === patientId);
  };

  const uploadFile = async (file: File): Promise<FileAttachment> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileAttachment: FileAttachment = {
          id: `file_${Date.now()}`,
          name: file.name,
          type: file.type,
          url: reader.result as string,
          size: file.size
        };
        resolve(fileAttachment);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      patients,
      incidents,
      login,
      logout,
      addPatient,
      updatePatient,
      deletePatient,
      addIncident,
      updateIncident,
      deleteIncident,
      getPatientIncidents,
      uploadFile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
