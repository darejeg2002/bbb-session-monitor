import React, { useState, useEffect } from 'react'
import { 
  Monitor, 
  Users, 
  Clock, 
  Video, 
  Download, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Play,
  Calendar,
  BarChart3
} from 'lucide-react'
import ActiveSessionsTab from './components/ActiveSessionsTab'
import HistoricalLogTab from './components/HistoricalLogTab'
import StatisticsTab from './components/StatisticsTab'
import AdminConfigTab from './components/AdminConfigTab'
import { SessionData, PluginConfig } from './types'
import { mockActiveSessions, mockHistoricalSessions, mockConfig } from './data/mockData'

function App() {
  const [activeTab, setActiveTab] = useState('active')
  const [activeSessions, setActiveSessions] = useState<SessionData[]>(mockActiveSessions)
  const [historicalSessions, setHistoricalSessions] = useState<SessionData[]>(mockHistoricalSessions)
  const [config, setConfig] = useState<PluginConfig>(mockConfig)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const refreshData = async () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setLastRefresh(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  const handleManualRefresh = () => {
    refreshData()
  }

  const totalActiveParticipants = activeSessions.reduce((sum, session) => sum + session.currentParticipants, 0)
  const sessionsToday = historicalSessions.filter(session => {
    const today = new Date()
    const sessionDate = new Date(session.startTime)
    return sessionDate.toDateString() === today.toDateString()
  }).length

  const averageDuration = historicalSessions.length > 0 
    ? Math.round(historicalSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / historicalSessions.length)
    : 0

  const recordingsAvailable = historicalSessions.filter(session => session.recordingStatus === 'available').length

  return (
    <div className="container">
      <header style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Monitor size={32} color="#007bff" />
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                BigBlueButton Session Monitor
              </h1>
              <p style={{ color: '#6c757d', fontSize: '16px' }}>
                Real-time monitoring and analytics for BBB sessions
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#6c757d' }}>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <button 
              className="btn btn-secondary" 
              onClick={handleManualRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{activeSessions.length}</div>
            <div className="stat-label">
              <Users size={16} style={{ display: 'inline', marginRight: '4px' }} />
              Active Sessions
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalActiveParticipants}</div>
            <div className="stat-label">
              <Users size={16} style={{ display: 'inline', marginRight: '4px' }} />
              Total Participants
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{sessionsToday}</div>
            <div className="stat-label">
              <Calendar size={16} style={{ display: 'inline', marginRight: '4px' }} />
              Sessions Today
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
            <div className="stat-value">{recordingsAvailable}</div>
            <div className="stat-label">
              <Video size={16} style={{ display: 'inline', marginRight: '4px' }} />
              Recordings Available
            </div>
          </div>
        </div>

        {/* System Status Alert */}
        <div className="alert alert-success">
          <CheckCircle size={16} />
          <span>Webhook system operational - Last event received 2 minutes ago</span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <Monitor size={16} />
          Active Sessions
        </button>
        <button 
          className={`tab ${activeTab === 'historical' ? 'active' : ''}`}
          onClick={() => setActiveTab('historical')}
        >
          <Clock size={16} />
          Historical Log
        </button>
        <button 
          className={`tab ${activeTab === 'statistics' ? 'active' : ''}`}
          onClick={() => setActiveTab('statistics')}
        >
          <BarChart3 size={16} />
          Statistics
        </button>
        <button 
          className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <AlertCircle size={16} />
          Admin Config
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'active' && (
        <ActiveSessionsTab 
          sessions={activeSessions} 
          onRefresh={handleManualRefresh}
        />
      )}
      
      {activeTab === 'historical' && (
        <HistoricalLogTab 
          sessions={historicalSessions}
        />
      )}
      
      {activeTab === 'statistics' && (
        <StatisticsTab 
          activeSessions={activeSessions}
          historicalSessions={historicalSessions}
        />
      )}
      
      {activeTab === 'admin' && (
        <AdminConfigTab 
          config={config}
          onConfigUpdate={setConfig}
        />
      )}
    </div>
  )
}

export default App
