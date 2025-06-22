import React, { useState } from 'react'
import { Users, Clock, Video, ExternalLink, Play } from 'lucide-react'
import { SessionData } from '../types'
import { formatDistanceToNow } from 'date-fns'

interface ActiveSessionsTabProps {
  sessions: SessionData[]
  onRefresh: () => void
}

const ActiveSessionsTab: React.FC<ActiveSessionsTabProps> = ({ sessions, onRefresh }) => {
  const [sortBy, setSortBy] = useState<'course' | 'lecturer' | 'participants' | 'startTime'>('startTime')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterCourse, setFilterCourse] = useState('')

  const filteredSessions = sessions.filter(session => 
    filterCourse === '' || session.courseName.toLowerCase().includes(filterCourse.toLowerCase())
  )

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortBy) {
      case 'course':
        aValue = a.courseName
        bValue = b.courseName
        break
      case 'lecturer':
        aValue = a.lecturerName
        bValue = b.lecturerName
        break
      case 'participants':
        aValue = a.currentParticipants
        bValue = b.currentParticipants
        break
      case 'startTime':
        aValue = new Date(a.startTime)
        bValue = new Date(b.startTime)
        break
      default:
        return 0
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const getRecordingStatusBadge = (status: string) => {
    switch (status) {
      case 'recording':
        return <span className="status-badge" style={{ backgroundColor: '#ff6b6b', color: 'white' }}>● Recording</span>
      case 'none':
        return <span className="status-badge" style={{ backgroundColor: '#6c757d', color: 'white' }}>No Recording</span>
      default:
        return <span className="status-badge" style={{ backgroundColor: '#6c757d', color: 'white' }}>Unknown</span>
    }
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            Active Sessions ({sessions.length})
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6c757d' }}>
              Auto-refresh: 60s
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <label>Filter by Course</label>
            <input
              type="text"
              placeholder="Search courses..."
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Sort by</label>
            <select 
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [column, order] = e.target.value.split('-')
                setSortBy(column as typeof sortBy)
                setSortOrder(order as 'asc' | 'desc')
              }}
            >
              <option value="startTime-desc">Start Time (Newest)</option>
              <option value="startTime-asc">Start Time (Oldest)</option>
              <option value="course-asc">Course (A-Z)</option>
              <option value="course-desc">Course (Z-A)</option>
              <option value="lecturer-asc">Lecturer (A-Z)</option>
              <option value="lecturer-desc">Lecturer (Z-A)</option>
              <option value="participants-desc">Participants (Most)</option>
              <option value="participants-asc">Participants (Least)</option>
            </select>
          </div>
        </div>

        {/* Sessions Table */}
        {sortedSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3>No Active Sessions</h3>
            <p>There are currently no active BigBlueButton sessions.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('course')}
                >
                  Course {sortBy === 'course' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Session Name</th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('lecturer')}
                >
                  Lecturer {sortBy === 'lecturer' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('startTime')}
                >
                  Duration {sortBy === 'startTime' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('participants')}
                >
                  Participants {sortBy === 'participants' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Recording</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSessions.map((session) => (
                <tr key={session.id}>
                  <td>
                    <strong>{session.courseName}</strong>
                  </td>
                  <td>{session.sessionName}</td>
                  <td>{session.lecturerName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {formatDistanceToNow(new Date(session.startTime), { addSuffix: false })}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={14} />
                      <span style={{ fontWeight: 'bold' }}>{session.currentParticipants}</span>
                      <span style={{ color: '#6c757d', fontSize: '12px' }}>
                        (peak: {session.peakParticipants})
                      </span>
                    </div>
                  </td>
                  <td>
                    {getRecordingStatusBadge(session.recordingStatus)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {session.joinUrl && (
                        <a 
                          href={session.joinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                        >
                          <Play size={12} />
                          Join
                        </a>
                      )}
                      <button 
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                        onClick={() => {
                          // Show participant details modal
                          alert(`Participants in ${session.sessionName}:\n${session.participants.map(p => `${p.name} (${p.role})`).join('\n')}`)
                        }}
                      >
                        <Users size={12} />
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ActiveSessionsTab
