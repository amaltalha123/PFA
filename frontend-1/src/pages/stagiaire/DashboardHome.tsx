import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';

// Interface pour la note
interface Note {
  id: number;
  date: string;
  contenue: string;
  color: string;
}

const DashboardHome: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<{ [key: string]: Note }>({});
  const [newNote, setNewNote] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [noteColor, setNoteColor] = useState('#3B82F6');
  const [activeTab, setActiveTab] = useState('calendar');

  // Fonctions pour naviguer dans le calendrier
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Formater une date en clé (YYYY-MM-DD)
  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Ouvrir la modal pour ajouter une note
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNewNote(notes[formatDateKey(date)]?.contenue || '');
    setNoteColor(notes[formatDateKey(date)]?.color || '#3B82F6');
    setShowModal(true);
  };

  useEffect(() => {
  const fetchNotes = async () => {
    try {
      const response = await axiosClient.get(`/notes/all`);
      
      if (response.data.success) {
        const notesMap: { [key: string]: Note } = {};
        response.data.notes.forEach((note: Note) => {
          notesMap[note.date] = note;
        });
        setNotes(notesMap);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des notes:", error);
    }
  };
  
    fetchNotes();
  }, []);
  // Sauvegarder la note
  const saveNote = async () => {
    if (selectedDate) {
      const dateKey = formatDateKey(selectedDate);
      const updatedNotes = { ...notes };
      
      if (newNote.trim()) {
        const note: Note = {
          id: Date.now(), // Utilisation du timestamp comme ID unique
          date: dateKey,
          contenue: newNote,
          color: noteColor
        };
        
        updatedNotes[dateKey] = note;

        // Appel API pour enregistrer la note
        try {
          await axiosClient.post('/notes/add', note);
        } catch (error) {
          console.error("Erreur lors de l'enregistrement de la note :", error);
        }
      } else {
        delete updatedNotes[dateKey];
      }
      
      setNotes(updatedNotes);
      setShowModal(false);
    }
  };


  // Mettre à jour la note
const updateNote = async () => {
  if (selectedDate) {
    const dateKey = formatDateKey(selectedDate);
    const updatedNotes = { ...notes };

    if (newNote.trim()) {
      const note: Note = {
        id: notes[dateKey].id, // Utiliser l'ID existant
        date: dateKey,
        contenue: newNote,
        color: noteColor
      };

      updatedNotes[dateKey] = note;

      // Appel API pour mettre à jour la note
      try {
        await axiosClient.put(`/notes/update/${note.id}`, {
          contenue: note.contenue,
          date: note.date,
          color: note.color
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la note :", error);
      }

    } else {
      delete updatedNotes[dateKey];
    }

    setNotes(updatedNotes);
    setShowModal(false);
  }
};

  // Supprimer la note
  const deleteNote = async () => {
    if (selectedDate) {
      const dateKey = formatDateKey(selectedDate);
      const noteToDelete = notes[dateKey];
      const updatedNotes = { ...notes };
      delete updatedNotes[dateKey];

      // Appel API pour supprimer la note
      if (noteToDelete?.id) {
        try {
          await axiosClient.delete(`/notes/delete/${noteToDelete.id}`);
        } catch (error) {
          console.error("Erreur lors de la suppression de la note :", error);
        }
      }

      setNotes(updatedNotes);
      setShowModal(false);
    }
  };

  // Générer les jours du mois
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    const daysFromPreviousMonth = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1;
    const previousMonthLastDay = new Date(year, month, 0).getDate();
    
    for (let i = 0; i < daysFromPreviousMonth; i++) {
      const day = previousMonthLastDay - daysFromPreviousMonth + i + 1;
      const date = new Date(year, month - 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        hasNote: false
      });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateKey = formatDateKey(date);
      const noteData = notes[dateKey];
      
      days.push({
        date,
        isCurrentMonth: true,
        hasNote: !!noteData,
        note: noteData?.contenue,
        color: noteData?.color
      });
    }
    
    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        hasNote: false
      });
    }
    
    return days;
  };

  const days = generateCalendarDays();
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  
  const colorOptions = [
    { name: 'Bleu', value: '#3B82F6' },
    { name: 'Vert', value: '#10B981' },
    { name: 'Jaune', value: '#F59E0B' },
    { name: 'Rose', value: '#EC4899' },
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Rouge', value: '#EF4444' }
  ];

    return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-6">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête du tableau de bord */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-2">Bienvenue, voici votre espace de travail personnel</p>
        </div>

        {/* Navigation par onglets */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'calendar' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendrier
          </button>
        </div>

        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendrier compact */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={goToPreviousMonth}
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <h2 className="text-lg font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  
                  <button 
                    onClick={goToNextMonth}
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                <button 
                  onClick={goToToday}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors"
                >
                  Aujourd'hui
                </button>
              </div>
              
              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Grille du calendrier */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const isToday = 
                    day.date.getDate() === new Date().getDate() &&
                    day.date.getMonth() === new Date().getMonth() &&
                    day.date.getFullYear() === new Date().getFullYear();
                  
                  return (
                    <div 
                      key={index}
                      onClick={() => handleDateClick(day.date)}
                      className={`h-12 p-1 rounded-md cursor-pointer transition-all
                        ${day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                        ${isToday ? 'bg-blue-100 border border-blue-300' : ''}
                      `}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start">
                          <span className={`text-xs font-medium
                            ${isToday ? 'bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center' : ''}
                          `}>
                            {day.date.getDate()}
                          </span>
                          
                          {day.hasNote && (
                            <span 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: day.color }}
                            ></span>
                          )}
                        </div>
                        
                        {day.hasNote && (
                          <div 
                            className="mt-1 text-[10px] p-1 rounded text-white truncate"
                            style={{ backgroundColor: day.color }}
                          >
                            {day.note}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Modal pour ajouter/modifier une note */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Note pour le {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Ajoutez votre note ici..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
            />
            
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Couleur :</p>
              <div className="flex space-x-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNoteColor(color.value)}
                    className={`w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${noteColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
           <div className="flex justify-between mt-4">
  <button
    onClick={deleteNote}
    disabled={!notes[formatDateKey(selectedDate)]}
    className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    Supprimer
  </button>

  <div className="space-x-2">
    <button
      onClick={() => setShowModal(false)}
      className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
    >
      Annuler
    </button>

    {notes[formatDateKey(selectedDate)] ? (
      <button
        onClick={updateNote}
        className="px-3 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
      >
        Modifier
      </button>
    ) : (
      <button
        onClick={saveNote}
        className="px-3 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
      >
        Enregistrer
      </button>
    )}
  </div>
</div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
