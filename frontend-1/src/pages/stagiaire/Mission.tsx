import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, CheckIcon } from '@heroicons/react/24/outline';
import axiosClient from '../../api/axiosClient';

type TaskStatus = 'En cours' | 'Échéantes' | 'Terminé';

interface Task {
  id: number;
  description: string;
  dueDate: string;
  status: TaskStatus;
}

const Mission: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Récupérer les tâches depuis le backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const selectedAssignment = localStorage.getItem('selectedAssignment');
        if (!selectedAssignment) {
          console.error('Aucun assignment sélectionné dans le localStorage.');
          return;
        }

        const assignment = JSON.parse(selectedAssignment);
        const assignmentId = assignment.id;

        const response = await axiosClient.get(`/mission/all/${assignmentId}`); 
        console.log(response.data); // Vérifiez la structure ici

        if (Array.isArray(response.data.data)) {
          setTasks(response.data.data); 
        } else {
          console.error('La réponse de l\'API n\'est pas un tableau:', response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
      }
    };

    fetchTasks();
  }, []);

  // Vérifie les tâches échéantes périodiquement
  useEffect(() => {
    const checkOverdueTasks = () => {
      const now = new Date();
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.status !== 'Terminé' && new Date(task.dueDate) < now) {
            return { ...task, status: 'Échéantes' };
          }
          return task;
        })
      );
    };

    checkOverdueTasks();
    const interval = setInterval(checkOverdueTasks, 3600000); // Vérifie toutes les heures
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsDone = async (taskId: number) => {
    try {
      const selectedAssignment = localStorage.getItem('selectedAssignment');
        if (!selectedAssignment) {
          console.error('Aucun assignment sélectionné dans le localStorage.');
          return;
        }

        const assignment = JSON.parse(selectedAssignment);
        const assignmentId = assignment.id;
      console.log(taskId);
      const response = await axiosClient.put(`/mission/done/${taskId}/${assignmentId}`);
      if (response.data.success) {
        setTasks(tasks.map(task => (task.id === taskId ? { ...task, status: 'Terminé' } : task)));
      } else {
        console.error('Erreur lors de la mise à jour de la mission:', response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la mission:', error);
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const columnColors: Record<TaskStatus, { bg: string; border: string; text: string; headerBg: string }> = {
    'En cours': {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      headerBg: 'bg-yellow-100'
    },
    'Échéantes': {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      headerBg: 'bg-red-100'
    },
    'Terminé': {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      headerBg: 'bg-green-100'
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tableau des Missions</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {['En cours', 'Échéantes', 'Terminé'].map(status => (
          <div 
            key={status} 
            className={`rounded-lg p-0 overflow-hidden ${columnColors[status as TaskStatus].bg} ${columnColors[status as TaskStatus].border} border`}
          >
            <div className={`flex justify-between items-center p-3 ${columnColors[status as TaskStatus].headerBg}`}>
              <div className="flex items-center">
                {status === 'Échéantes' && (
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-600" />
                )}
                <h3 className={`font-medium ${columnColors[status as TaskStatus].text}`}>{status}</h3>
              </div>
              <span className="bg-white px-2 py-1 rounded-full text-xs font-medium">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>
            <div className="p-3 space-y-3">
              {tasks
                .filter(task => task.status === status)
                .map(task => (
                  <div
                    key={task.id}
                    className={`bg-white p-3 rounded-md shadow-sm border ${
                      isOverdue(task.dueDate) && status !== 'Terminé' 
                        ? 'border-red-300' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-gray-800">
                          {task.description.split('\n').map((line, index) => (
                            <p key={index} className="mb-1">{line}</p>
                          ))}
                        </div>

                        {task.dueDate && (
                          <p className={`text-xs mt-2 ${
                            isOverdue(task.dueDate) && status !== 'Terminé' 
                              ? 'text-red-600 font-semibold' 
                              : 'text-gray-500'
                          }`}>
                            <span className="font-medium">Échéance:</span> {new Date(task.dueDate).toLocaleDateString()}
                            {isOverdue(task.dueDate) && status !== 'Terminé' && (
                              <span className="ml-2">(En retard)</span>
                            )}
                          </p>
                        )}
                      </div>
                      {status === 'En cours' && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleMarkAsDone(task.id)} 
                            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                          >
                            <CheckIcon className="h-5 w-5 mr-1" />
                            <span>Done</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mission;
