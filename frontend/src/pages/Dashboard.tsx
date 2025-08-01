import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  GraduationCap, 
  Building, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { statsService, interviewService } from '../services/api';
import { DashboardStats, Interview } from '../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInterviews, setRecentInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les statistiques
        const statsResponse = await statsService.getDashboardStats();
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }

        // Récupérer les entretiens récents
        const interviewsResponse = await interviewService.getAll({ limit: 5 });
        if (interviewsResponse.success && interviewsResponse.data) {
          setRecentInterviews(interviewsResponse.data.items);
        }
      } catch (error) {
        toast.error('Erreur lors du chargement du tableau de bord');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge-success">Terminé</span>;
      case 'in_progress':
        return <span className="badge-warning">En cours</span>;
      case 'scheduled':
        return <span className="badge-info">Programmé</span>;
      case 'cancelled':
        return <span className="badge-danger">Annulé</span>;
      default:
        return <span className="badge-info">{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeLabels: Record<string, string> = {
      technical: 'Technique',
      behavioral: 'Comportemental',
      hr: 'RH',
      final: 'Final'
    };
    return <span className="badge-info">{typeLabels[type] || type}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Bienvenue, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <Link
          to="/interviews/new"
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel entretien
        </Link>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Entretiens</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalInterviews}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Terminés</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completedInterviews}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">En attente</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pendingInterviews}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-secondary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Score moyen</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.averageScore ? `${stats.averageScore.toFixed(1)}/100` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Actions rapides</h3>
          </div>
          <div className="card-body space-y-3">
            <Link
              to="/interviews/new"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Plus className="w-5 h-5 mr-3 text-primary-600" />
              <span>Créer un entretien</span>
            </Link>
            <Link
              to="/students/new"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <GraduationCap className="w-5 h-5 mr-3 text-success-600" />
              <span>Ajouter un étudiant</span>
            </Link>
            <Link
              to="/committees/new"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Users className="w-5 h-5 mr-3 text-warning-600" />
              <span>Créer un comité</span>
            </Link>
            <Link
              to="/companies/new"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Building className="w-5 h-5 mr-3 text-secondary-600" />
              <span>Ajouter une entreprise</span>
            </Link>
          </div>
        </div>

        {/* Entretiens récents */}
        <div className="card md:col-span-2">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Entretiens récents</h3>
            <Link
              to="/interviews"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Voir tout
            </Link>
          </div>
          <div className="card-body">
            {recentInterviews.length > 0 ? (
              <div className="space-y-4">
                {recentInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{interview.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {new Date(interview.date).toLocaleDateString('fr-FR')}
                        </span>
                        {getStatusBadge(interview.status)}
                        {getTypeBadge(interview.type)}
                      </div>
                      {interview.student && (
                        <p className="text-sm text-gray-600 mt-1">
                          Étudiant: {interview.student.user?.firstName} {interview.student.user?.lastName}
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/interviews/${interview.id}`}
                      className="btn-outline"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun entretien récent</p>
                <Link
                  to="/interviews/new"
                  className="btn-primary mt-4"
                >
                  Créer le premier entretien
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Graphiques et statistiques détaillées */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Entretiens par type */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Entretiens par type</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {Object.entries(stats.interviewsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {type}
                    </span>
                    <span className="text-sm text-gray-500">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Entretiens par statut */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Entretiens par statut</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {Object.entries(stats.interviewsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {status}
                    </span>
                    <span className="text-sm text-gray-500">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 