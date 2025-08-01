// Types de base
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'student' | 'committee_member' | 'company_owner';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: number;
  userId: number;
  studentNumber: string;
  program: string;
  year: number;
  gpa: number;
  status: 'active' | 'inactive' | 'graduated';
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface StudentRegistration {
  id: number;
  studentId: number;
  interviewId: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  student?: Student;
  interview?: Interview;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: number;
  title: string;
  description?: string;
  date: string;
  duration: number; // en minutes
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: 'technical' | 'behavioral' | 'hr' | 'final';
  studentId: number;
  committeeId?: number;
  companyId?: number;
  location?: string;
  notes?: string;
  score?: number;
  feedback?: string;
  student?: Student;
  committee?: Committee;
  company?: Company;
  createdAt: string;
  updatedAt: string;
}

export interface Committee {
  id: number;
  name: string;
  description?: string;
  type: 'technical' | 'hr' | 'academic' | 'mixed';
  status: 'active' | 'inactive' | 'archived';
  maxMembers: number;
  currentMembers: number;
  chairpersonId?: number;
  department?: string;
  specialization?: string;
  chairperson?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: number;
  name: string;
  description?: string;
  industry?: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  status: 'active' | 'inactive' | 'pending';
  foundedYear?: number;
  employeeCount?: number;
  revenue?: string;
  logo?: string;
  ownerId?: number;
  owner?: User;
  createdAt: string;
  updatedAt: string;
}

// Types pour les formulaires
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface InterviewForm {
  title: string;
  description?: string;
  date: string;
  duration: number;
  type: string;
  studentId: number;
  committeeId?: number;
  companyId?: number;
  location?: string;
  notes?: string;
}

export interface StudentForm {
  userId: number;
  studentNumber: string;
  program: string;
  year: number;
  gpa: number;
}

export interface CommitteeForm {
  name: string;
  description?: string;
  type: string;
  maxMembers: number;
  department?: string;
  specialization?: string;
  chairpersonId?: number;
}

export interface CompanyForm {
  name: string;
  description?: string;
  industry?: string;
  size: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  foundedYear?: number;
  employeeCount?: number;
  revenue?: string;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

// Types pour les filtres
export interface InterviewFilters {
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  studentId?: number;
  committeeId?: number;
  companyId?: number;
}

export interface StudentFilters {
  status?: string;
  program?: string;
  year?: number;
}

export interface CommitteeFilters {
  status?: string;
  type?: string;
  department?: string;
}

export interface CompanyFilters {
  status?: string;
  industry?: string;
  size?: string;
  city?: string;
  country?: string;
}

// Types pour les statistiques
export interface DashboardStats {
  totalInterviews: number;
  completedInterviews: number;
  pendingInterviews: number;
  totalStudents: number;
  totalCommittees: number;
  totalCompanies: number;
  averageScore: number;
  interviewsByType: Record<string, number>;
  interviewsByStatus: Record<string, number>;
}

// Types pour les notifications
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
} 