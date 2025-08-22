import React, { useState, useEffect } from 'react';
import { PlusIcon, XMarkIcon, ExclamationTriangleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
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
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({ 
    description: '', 
    dueDate: '', 
    status: 'En cours'
  });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null); // État pour la tâche à modifier

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

  const statuses: TaskStatus[] = ['En cours', 'Échéantes', 'Terminé'];

  // Couleurs pour chaque colonne
  const columnColors = {
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

  const handleAddTask = async () => {
    try {
      const selectedAssignment = localStorage.getItem('selectedAssignment');
      if (!selectedAssignment) {
        console.error('Aucun assignment sélectionné dans le localStorage.');
        return;
      }

      const assignment = JSON.parse(selectedAssignment);
      const assignmentId = assignment.id;

      const taskToAdd = {
        ...newTask,
        dueDate: newTask.dueDate,
      };

      const response = await axiosClient.post(`/mission/add/${assignmentId}`, { description: taskToAdd.description, date_limite: taskToAdd.dueDate });

      if (response.data.success) {
        const newTaskWithId = {
          ...response.data.data.Mission,
          id: response.data.data.id
        };
        setTasks([...tasks, newTaskWithId]);
        setNewTask({ description: '', dueDate: '', status: 'En cours' }); // Réinitialiser le formulaire
        setShowForm(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la mission:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task); // Mettre à jour l'état avec la tâche à modifier
    setNewTask({ 
      description: task.description, 
      dueDate: task.dueDate.split('T')[0], // Formatage de la date pour l'input
      status: task.status 
    }); // Pré-remplir le formulaire
    setShowForm(true); // Ouvrir le formulaire
  };

const handleUpdateTask = async () => {
  if (!editingTask) return; // Assurez-vous qu'il y a une tâche à modifier

  console.log("Données envoyées:", { description: newTask.description, date_limite: newTask.dueDate });

  try {
    const response = await axiosClient.put(`/mission/update/${editingTask.id}`, { 
      description: newTask.description, 
      date_limite: newTask.dueDate 
    });

    if (response.data.success) {
      const updatedTask = {
        ...editingTask,
        description: newTask.description,
        dueDate: newTask.dueDate,
      };
      setTasks(tasks.map(task => (task.id === editingTask.id ? updatedTask : task)));
      setNewTask({ description: '', dueDate: '', status: 'En cours' }); // Réinitialiser le formulaire
      setShowForm(false);
      setEditingTask(null); // Réinitialiser l'état d'édition
    } else {
      // Afficher une alerte avec le message d'erreur du backend
      alert(`Erreur lors de la mise à jour de la mission: ${response.data.message}`);
    }
  } catch (error) {
    // Afficher une alerte avec le message d'erreur
    alert(error.response?.data?.message || error.message);
    console.error('Erreur lors de la mise à jour de la mission:', error);
  }
};



  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await axiosClient.delete(`/mission/delete/${taskId}`);
      if (response.data.success) {
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        console.error('Erreur lors de la suppression de la mission:', response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la mission:', error);
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tableau des Missions</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setNewTask({ description: '', dueDate: '', status: 'En cours' }); // Réinitialiser le formulaire
            setEditingTask(null); // Réinitialiser l'état d'édition lors de l'ouverture du formulaire
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Créer une mission
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingTask ? 'Modifier la Mission' : 'Nouvelle Mission'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Description détaillée..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date limite</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  onClick={editingTask ? handleUpdateTask : handleAddTask} // Appeler la fonction appropriée
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editingTask ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {statuses.map(status => (
          <div 
            key={status} 
            className={`rounded-lg p-0 overflow-hidden ${columnColors[status].bg} ${columnColors[status].border} border`}
          >
            <div className={`flex justify-between items-center p-3 ${columnColors[status].headerBg}`}>
              <div className="flex items-center">
                {status === 'Échéantes' && (
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-600" />
                )}
                <h3 className={`font-medium ${columnColors[status].text}`}>{status}</h3>
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
                          {task.description.split('\n').map((line, index) => {
                            if (line.trim().startsWith('-')) {
                              return <li key={index} className="list-disc ml-5">{line.trim().substring(1).trim()}</li>;
                            }
                            return <p key={index} className="mb-1">{line}</p>;
                          })}
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
                          <button onClick={() => handleEditTask(task)}>
                            <PencilIcon className="h-5 w-5 text-blue-600 hover:text-blue-800" />
                          </button>
                          <button onClick={() => handleDeleteTask(task.id)}>
                            <TrashIcon className="h-5 w-5 text-red-600 hover:text-red-800" />
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
