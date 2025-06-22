import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Users, Clock, Video, TrendingUp, Calendar, Activity } from 'lucide-react'
import { SessionData } from '../types'
import { format, subDays, eachDayOfInterval } from 'date-fns'

interface StatisticsTabProps {
  activeSessions: SessionData[]
  historicalSessions: SessionData[]
}

const StatisticsTab: React.FC<StatisticsTabProps> = ({ activeSessions, historicalSessions }) => {
  // Calculate statistics
  const totalSessions = historicalSessions.length + activeSessions.length
  const averageDuration = historicalSessions.length > 0 
    ? Math.round(historicalSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / historicalSessions.length)
    : 0
  
  const totalParticipants = historicalSessions.reduce((sum, session) => sum + session.peakParticipants, 0) +
                           activeSessions.reduce((sum, session) => sum + session.peakParticipants, 0)
  
  const averageParticipants = totalSessions > 0 ? Math.round(totalParticipants / totalSessions) : 0
  
  const recordingsAvailable = historicalSessions.filter(session => session.recordingStatus === 'available').length
  const recordingRate = historicalSessions.length > 0 ? Math.round((recordingsAvailable / historicalSessions.length) * 100) : 0

  // Prepare chart data
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  })

  const dailySessionData = last7Days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const sessionsOnDay = historicalSessions.filter(session => 
      format(new Date(session.startTime), 'yyyy-MM-dd') === dayStr
    )
    
    return {
      date: format(day, 'MMM dd'),
      sessions: sessionsOnDay.length,
      participants: sessionsOnDay.reduce((sum, session) => sum + session.peakParticipants, 0),
      duration: sessionsOnDay.reduce((sum, session) => sum + (session.duration || 0), 0)
    }
  })

  // Course distribution data
  const courseStats = [...activeSessions, ...historicalSessions].reduce((acc, session) => {
    acc[session.courseName] = (acc[session.courseName] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const courseData = Object.entries(courseStats)
    .map(([course, count]) => ({ course, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  // Recording status distribution
  const recordingStatusData = [
    { name: 'Available', value: historicalSessions.filter(s => s.recordingStatus === 'available').length, color: '#28a745' },
    { name: 'Processing', value: historicalSessions.filter(s => s.recordingStatus === 'processing').length, color: '#ffc107' },
    { name: 'None', value: historicalSessions.filter(s => s.recordingStatus === 'none').length, color: '#6c757d' }
  ]

  // Peak hours analysis
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const sessionsAtHour = [...activeSessions, ...historicalSessions].filter(session => {
      const sessionHour = new Date(session.startTime).getHours()
      return sessionHour === hour
    })
    
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      sessions: sessionsAtHour.length,
      participants: sessionsAtHour.reduce((sum, session) => sum + session.peakParticipants, 0)
    }
  }).filter(data => data.sessions > 0)

  return (
    <div>
      {/* Summary Statistics */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-value">{totalSessions}</div>
          <div className="stat-label">
            <Activity size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Total Sessions
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{averageDuration}m</div>
          <div className="stat-label">
            <Clock size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Avg Duration
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{averageParticipants}</div>
          <div className="stat-label">
            <Users size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Avg Participants
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{recordingRate}%</div>
          <div className="stat-label">
            <Video size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Recording Rate
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px' }}>
        
        {/* Daily Sessions Trend */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} />
            Daily Sessions (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySessionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="sessions" 
                stroke="#007bff" 
                strokeWidth={2}
                dot={{ fill: '#007bff', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Course Distribution */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} />
            Sessions by Course
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="course" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="count" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} />
            Peak Usage Hours
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sessions" fill="#28a745" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recording Status Distribution */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={20} />
            Recording Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={recordingStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {recordingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Detailed Metrics */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '20px' }}>Detailed Metrics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ color: '#007bff', marginBottom: '10px' }}>Session Statistics</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <strong>Total Sessions:</strong> {totalSessions}
              </li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <strong>Active Now:</strong> {activeSessions.length}
              </li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <strong>Completed:</strong> {historicalSessions.length}
              </li>
              <li style={{ padding: '8px 0' }}>
                <strong>Avg Duration:</strong> {averageDuration} minutes
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: '#28a745', marginBottom: '10px' }}>Participant Metrics</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <strong>Total Participants:</strong> {totalParticipants}
              </li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <strong>Average per Session:</strong> {averageParticipants}
              </li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <strong>Currently Online:</strong> {activeSessions.reduce((sum, s) => sum + s.currentParticipants, 0)}
              </li>
              <li style={{ padding: '8px 0' }}>
                <strong>Peak Today:</strong> {Math.max(...activeSessions.map(s => s.peakParticipants), 0)}
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: '#ffc107', marginBottom: '10px' }}>Recording Metrics</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <strong>Available:</strong> {recordingsAvailable}
              </li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <strong>Processing:</strong> {historicalSessions.filter(s => s.recordingStatus === 'processing').length}
              </li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <strong>Recording Rate:</strong> {recordingRate}%
              </li>
              <li style={{ padding: '8px 0' }}>
                <strong>Currently Recording:</strong> {activeSessions.filter(s => s.recordingStatus === 'recording').length}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsTab
