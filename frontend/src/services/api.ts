import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Student, 
  Interview, 
  Committee, 
  Company, 
  StudentRegistration,
  ApiResponse, 
  PaginatedResponse,
  LoginForm,
  RegisterForm,
  InterviewForm,
  StudentForm,
  CommitteeForm,
  CompanyForm,
  InterviewFilters,
  StudentFilters,
  CommitteeFilters,
  CompanyFilters,
  DashboardStats
} from '../types';

// Configuration de base d'axios
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  login: async (credentials: LoginForm): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response: AxiosResponse<ApiResponse<{ token: string; user: User }>> = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterForm): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get('/auth/me');
    return response.data;
  },
};

// Service des utilisateurs
export const userService = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    const response: AxiosResponse<ApiResponse<User[]>> = await api.get('/users');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.post('/users', userData);
    return response.data;
  },

  update: async (id: number, userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Service des étudiants
export const studentService = {
  getAll: async (filters?: StudentFilters): Promise<PaginatedResponse<Student>> => {
    const response: AxiosResponse<PaginatedResponse<Student>> = await api.get('/students', { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Student>> => {
    const response: AxiosResponse<ApiResponse<Student>> = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (studentData: StudentForm): Promise<ApiResponse<Student>> => {
    const response: AxiosResponse<ApiResponse<Student>> = await api.post('/students', studentData);
    return response.data;
  },

  update: async (id: number, studentData: Partial<StudentForm>): Promise<ApiResponse<Student>> => {
    const response: AxiosResponse<ApiResponse<Student>> = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/students/${id}`);
    return response.data;
  },
};

// Service des entretiens
export const interviewService = {
  getAll: async (filters?: InterviewFilters): Promise<PaginatedResponse<Interview>> => {
    const response: AxiosResponse<PaginatedResponse<Interview>> = await api.get('/interviews', { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Interview>> => {
    const response: AxiosResponse<ApiResponse<Interview>> = await api.get(`/interviews/${id}`);
    return response.data;
  },

  create: async (interviewData: InterviewForm): Promise<ApiResponse<Interview>> => {
    const response: AxiosResponse<ApiResponse<Interview>> = await api.post('/interviews', interviewData);
    return response.data;
  },

  update: async (id: number, interviewData: Partial<InterviewForm>): Promise<ApiResponse<Interview>> => {
    const response: AxiosResponse<ApiResponse<Interview>> = await api.put(`/interviews/${id}`, interviewData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/interviews/${id}`);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<ApiResponse<Interview>> => {
    const response: AxiosResponse<ApiResponse<Interview>> = await api.patch(`/interviews/${id}/status`, { status });
    return response.data;
  },

  addScore: async (id: number, score: number, feedback?: string): Promise<ApiResponse<Interview>> => {
    const response: AxiosResponse<ApiResponse<Interview>> = await api.patch(`/interviews/${id}/score`, { score, feedback });
    return response.data;
  },
};

// Service des comités
export const committeeService = {
  getAll: async (filters?: CommitteeFilters): Promise<PaginatedResponse<Committee>> => {
    const response: AxiosResponse<PaginatedResponse<Committee>> = await api.get('/committees', { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Committee>> => {
    const response: AxiosResponse<ApiResponse<Committee>> = await api.get(`/committees/${id}`);
    return response.data;
  },

  create: async (committeeData: CommitteeForm): Promise<ApiResponse<Committee>> => {
    const response: AxiosResponse<ApiResponse<Committee>> = await api.post('/committees', committeeData);
    return response.data;
  },

  update: async (id: number, committeeData: Partial<CommitteeForm>): Promise<ApiResponse<Committee>> => {
    const response: AxiosResponse<ApiResponse<Committee>> = await api.put(`/committees/${id}`, committeeData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/committees/${id}`);
    return response.data;
  },
};

// Service des entreprises
export const companyService = {
  getAll: async (filters?: CompanyFilters): Promise<PaginatedResponse<Company>> => {
    const response: AxiosResponse<PaginatedResponse<Company>> = await api.get('/companies', { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Company>> => {
    const response: AxiosResponse<ApiResponse<Company>> = await api.get(`/companies/${id}`);
    return response.data;
  },

  create: async (companyData: CompanyForm): Promise<ApiResponse<Company>> => {
    const response: AxiosResponse<ApiResponse<Company>> = await api.post('/companies', companyData);
    return response.data;
  },

  update: async (id: number, companyData: Partial<CompanyForm>): Promise<ApiResponse<Company>> => {
    const response: AxiosResponse<ApiResponse<Company>> = await api.put(`/companies/${id}`, companyData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/companies/${id}`);
    return response.data;
  },
};

// Service des inscriptions d'étudiants
export const registrationService = {
  getAll: async (): Promise<ApiResponse<StudentRegistration[]>> => {
    const response: AxiosResponse<ApiResponse<StudentRegistration[]>> = await api.get('/registrations');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<StudentRegistration>> => {
    const response: AxiosResponse<ApiResponse<StudentRegistration>> = await api.get(`/registrations/${id}`);
    return response.data;
  },

  create: async (registrationData: Partial<StudentRegistration>): Promise<ApiResponse<StudentRegistration>> => {
    const response: AxiosResponse<ApiResponse<StudentRegistration>> = await api.post('/registrations', registrationData);
    return response.data;
  },

  update: async (id: number, registrationData: Partial<StudentRegistration>): Promise<ApiResponse<StudentRegistration>> => {
    const response: AxiosResponse<ApiResponse<StudentRegistration>> = await api.put(`/registrations/${id}`, registrationData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/registrations/${id}`);
    return response.data;
  },
};

// Service des statistiques
export const statsService = {
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response: AxiosResponse<ApiResponse<DashboardStats>> = await api.get('/stats/dashboard');
    return response.data;
  },
};

export default api; 