import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import axiosClient from '../../api/axiosClient';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
interface UserData {
  name: string;
  value: number; 
}

interface StageData {
  type: string;
  count: number; 
}

const DashboardHome: React.FC = () => {
  const [totalStagiaires, setTotalStagiaires] = useState(0);
  const [totalEncadrants, setTotalEncadrants] = useState(0);
  const [totalDepartements, setTotalDepartements] = useState(0);
  const [userData, setUserData] = useState<UserData[]>([]);  
  const [stageData, setStageData] = useState<StageData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stagiairesResponse = await axiosClient.get('/statistic/TotalStagiaires');
        const encadrantsResponse = await axiosClient.get('/statistic/TotalEncadrant');
        const departementsResponse = await axiosClient.get('/departements/all');
        const StageByTypeResponse = await axiosClient.get('/statistic/StageByType');
        console.log(StageByTypeResponse.data.StageByType);
        setStageData(StageByTypeResponse.data.StageByType);
        setTotalStagiaires(stagiairesResponse.data.totalStagiaires); 
        setTotalEncadrants(encadrantsResponse.data.totalEncadrants); 
        setTotalDepartements(departementsResponse.data.data.total);

       
        
        setUserData([
          { name: 'Stagiaires', value: stagiairesResponse.data.totalStagiaires },
          { name: 'Encadrants', value: encadrantsResponse.data.totalEncadrants },
          { name: 'Départements', value: departementsResponse.data.data.total },
        ]);
        // Remplacez ceci par vos données réelles pour les stages
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
        
    
  }, []);

  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tableau de Bord - Statistiques</h2>
      
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Stagiaires</h3>
          <p className="text-3xl font-bold text-blue-600">{totalStagiaires}</p>
          
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Encadrants</h3>
          <p className="text-3xl font-bold text-green-600">{totalEncadrants}</p>
          
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Départements</h3>
          <p className="text-3xl font-bold text-yellow-600">{totalDepartements}</p>
          
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Répartition des Utilisateurs et des Stages</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">Répartition des Utilisateurs</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} utilisateurs`, 'Nombre']}
                    labelFormatter={(label) => `Catégorie: ${label}`}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">Types de Stages</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stageData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="type" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: 'Nombre de stages', 
                      angle: -90, 
                      position: 'insideLeft',
                      fontSize: 12 
                    }} 
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} stages`, 'Nombre']}
                    labelFormatter={(label) => `Type: ${label}`}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      paddingTop: '20px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    name="Nombre de stages"
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  >
                    {stageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section (Optional) */}
      {/* <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Activité Récente</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium">Nouveau stagiaire enregistré</p>
              <p className="text-sm text-gray-500">Il y a 2 heures</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium">Stage technique assigné</p>
              <p className="text-sm text-gray-500">Aujourd'hui, 09:30</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DashboardHome;
