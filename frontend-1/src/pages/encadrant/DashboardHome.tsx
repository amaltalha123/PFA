import React, { useEffect, useState } from 'react';
import { FiUsers, FiFileText, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import axiosClient from '../../api/axiosClient'; // Adjust the import based on your project structure

const DashboardHome: React.FC = () => {
  // State for each statistic
  const [studentsCount, setStudentsCount] = useState<number | null>(null);
  const [projectsCount, setProjectsCount] = useState<number | null>(null);
  const [meetingsCount, setMeetingsCount] = useState<number | null>(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number | null>(null);

  // State for recent activities and upcoming meetings
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);

  // Fetch statistics from the backend
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [studentsResponse, projectsResponse, meetingsResponse, messagesResponse] = await Promise.all([
          axiosClient.get('/stats/students'), // Adjust the endpoint as needed
          axiosClient.get('/stats/projects'), // Adjust the endpoint as needed
          axiosClient.get('/stats/meetings'), // Adjust the endpoint as needed
          axiosClient.get('/stats/messages'), // Adjust the endpoint as needed
        ]);

        setStudentsCount(studentsResponse.data.count);
        setProjectsCount(projectsResponse.data.count);
        setMeetingsCount(meetingsResponse.data.count);
        setUnreadMessagesCount(messagesResponse.data.count);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  // Fetch recent activities and upcoming meetings
  useEffect(() => {
    const fetchActivitiesAndMeetings = async () => {
      try {
        const activitiesResponse = await axiosClient.get('/activities/recent'); // Adjust the endpoint as needed
        const meetingsResponse = await axiosClient.get('/meetings/upcoming'); // Adjust the endpoint as needed

        setRecentActivities(activitiesResponse.data);
        setUpcomingMeetings(meetingsResponse.data);
      } catch (error) {
        console.error("Error fetching activities and meetings:", error);
      }
    };

    fetchActivitiesAndMeetings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Étudiants encadrés</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{studentsCount !== null ? studentsCount : '...'}</p>
              </div>
              <FiUsers className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Projets en cours</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{projectsCount !== null ? projectsCount : '...'}</p>
              </div>
              <FiFileText className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Rendez-vous cette semaine</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{meetingsCount !== null ? meetingsCount : '...'}</p>
              </div>
              <FiCalendar className="text-purple-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Messages non lus</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{unreadMessagesCount !== null ? unreadMessagesCount : '...'}</p>
              </div>
              <FiMessageSquare className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activités récentes */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Activités récentes</h2>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{activity.student}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
              Voir toutes les activités
            </button>
          </div>

          {/* Prochains rendez-vous */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Prochains rendez-vous</h2>
            <div className="space-y-4">
              {upcomingMeetings.map(meeting => (
                <div key={meeting.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{meeting.student}</p>
                  <p className="text-sm text-gray-600">{meeting.date}</p>
                  <p className="text-sm text-gray-500 mt-1">{meeting.subject}</p>
                  <div className="mt-2 flex space-x-2">
                    <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Confirmer
                    </button>
                    <button className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Reporter
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
              Voir l'agenda complet
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardHome;
