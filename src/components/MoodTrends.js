import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// 1. Import and register core Chart.js elements
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Numerical mapping for the mood types (used for the Y-axis)
const MOOD_MAPPING = {
  'Happy 😀': 5,
  'Neutral 😐': 4,
  'Stressed 🥵': 3,
  'Anxious 😟': 2,
  'Sad 😥': 1,
};

// Map numerical scores back to labels for the chart axis
const Y_AXIS_LABELS = { 
    5: 'Happy', 
    4: 'Neutral', 
    3: 'Stressed', 
    2: 'Anxious', 
    1: 'Sad' 
};

const MoodTrends = () => {
  const { currentUser } = useAuth();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  // 2. Fetch data from Firestore and process it for Chart.js
  useEffect(() => {
    const fetchMoodData = async () => {
      if (!currentUser) {
          setLoading(false);
          return;
      }

      try {
        // Query MoodEntry collection, filter by current user, order by time
        const q = query(
          collection(db, 'MoodEntry'),
          where("user_id", "==", currentUser.uid),
          orderBy("timestamp", "asc")
        );
        
        const querySnapshot = await getDocs(q);
        
        const labels = [];
        const dataPoints = [];

        querySnapshot.forEach((doc) => {
          const entry = doc.data();
          
          // X-axis label: Format date (e.g., "Oct 10")
          const date = entry.timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          labels.push(date);
          
          // Y-axis data: Use the numerical mapping
          dataPoints.push(MOOD_MAPPING[entry.mood_type]);
        });
        
        // Update state with processed data
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Daily Mood Score',
              data: dataPoints,
              borderColor: '#4c9aff', // Primary color for the line
              backgroundColor: 'rgba(76, 154, 255, 0.4)', // Light fill color
              tension: 0.3, // Curve the line for a softer look
              pointBackgroundColor: '#4c9aff',
              pointBorderColor: '#fff',
              pointHoverRadius: 6,
            },
          ],
        });

      } catch (error) {
        console.error("Error fetching mood data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [currentUser]);

  // 3. Define Chart options (scales, titles, etc.)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows flexible height/width
    plugins: {
      legend: {
        display: false, // Often cleaner without the single legend item
      },
      title: {
        display: true,
        text: 'Your Emotional Journey Over Time',
        font: { size: 18 },
        color: '#333',
      },
    },
    scales: {
        x: {
            grid: { display: false } // Hide vertical grid lines
        },
        y: {
            min: 1, 
            max: 5,
            ticks: {
                // Display the actual mood name instead of the score (1-5)
                callback: function(value) {
                    return Y_AXIS_LABELS[value] || '';
                },
                color: '#555',
            },
            grid: { color: '#eee' } // Light horizontal grid lines
        }
    }
  };

  // 4. Render the component
  if (loading) return <div style={{textAlign: 'center', padding: '50px', color: '#4c9aff'}}>Loading Mood Data...</div>;

  return (
    <div style={{ maxWidth: '90%', height: '400px', margin: '50px auto', padding: '25px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
      {chartData.labels.length > 0 ? (
        // Chart container
        <div style={{ height: '100%' }}>
            <Line options={chartOptions} data={chartData} />
        </div>
      ) : (
        <p style={{textAlign: 'center', color: '#888', padding: '50px', fontSize: '18px'}}>
            It looks like you haven't logged any moods yet! Log a mood to see your first trend chart.
        </p>
      )}
      
    </div>
  );
};

export default MoodTrends;