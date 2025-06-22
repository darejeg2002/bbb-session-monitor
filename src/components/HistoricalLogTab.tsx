import React, { useState } from 'react'
import { Clock, Users, Video, Download, ExternalLink, Calendar } from 'lucide-react'
import { SessionData, ExportFilter } from '../types'
import { format, subDays } from 'date-fns'

interface HistoricalLogTabProps {
  sessions: SessionData[]
}

const HistoricalLogTab: React.FC<HistoricalLogTabProps> = ({ sessions }) => {
  const [filters, setFilters] = useState<ExportFilter>({
    dateFrom: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    dateTo: format(new Date(), 'yyyy-MM-dd'),
    course: '',
    lecturer: '',
    status: '',
    recordingStatus: ''
  })

  const [sortBy, setSortBy] = useState<'startTime' | 'duration' | 'participants'>('startTime')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime)
    const fromDate = new Date(filters.dateFrom)
    const toDate = new Date(filters.dateTo)
    
    return (
      sessionDate >= fromDate &&
      sessionDate <= toDate &&
      (filters.course === '' || session.courseName.toLowerCase().includes(filters.course.toLowerCase())) &&
      (filters.lecturer === '' || session.lecturerName.toLowerCase().includes(filters.lecturer.toLowerCase())) &&
      (filters.status === '' || session.status === filters.status) &&
      (filters.recordingStatus === '' || session.recordingStatus === filters.recordingStatus)
    )
  })

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortBy) {
      case 'startTime':
        aValue = new Date(a.startTime)
        bValue = new Date(b.startTime)
        break
      case 'duration':
        aValue = a.duration || 0
        bValue = b.duration || 0
        break
      case 'participants':
        aValue = a.peakParticipants
        bValue = b.peakParticipants
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

  const handleExport = (format: 'csv' | 'xlsx') => {
    const data = sortedSessions.map(session => ({
      'Course Name': session.courseName,
      'Session Name': session.sessionName,
      'Lecturer': session.lecturerName,
      'Start Time': session.startTime,
      'End Time': session.endTime || 'N/A',
      'Duration (minutes)': session.duration || 'N/A',
      'Peak Participants': session.peakParticipants,
      'Status': session.status,
      'Recording Status': session.recordingStatus,
      'Recording URL': session.recordingUrl || 'N/A'
    }))

    // Simulate export
    const dataStr = format === 'csv' 
      ? convertToCSV(data)
      : JSON.stringify(data, null, 2)
    
    const blob = new Blob([dataStr], { type: format === 'csv' ? 'text/csv' : 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bbb-sessions-${format === 'csv' ? 'export.csv' : 'export.json'}`
    link.click()
    URL.revokeObjectURL(url)
  }

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n')
    
    return csvContent
  }

  const getRecordingStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="status-badge status-active">Available</span>
      case 'processing':
        return <span className="status-badge" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>Processing</span>
      case 'none':
        return <span className="status-badge" style={{ backgroundColor: '#6c757d', color: 'white' }}>None</span>
      default:
        return <span className="status-badge" style={{ backgroundColor: '#6c757d', color: 'white' }}>Unknown</span>
    }
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            Historical Sessions ({filteredSessions.length})
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-success"
              onClick={() => handleExport('csv')}
            >
              <Download size={16} />
              Export CSV
            </button>
            <button 
              className="btn btn-success"
              onClick={() => handleExport('xlsx')}
            >
              <Download size={16} />
              Export XLSX
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <label>From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </div>
          <div className="filter-group">
            <label>To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </div>
          <div className="filter-group">
            <label>Course</label>
            <input
              type="text"
              placeholder="Filter by course..."
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value })}
            />
          </div>
          <div className="filter-group">
            <label>Lecturer</label>
            <input
              type="text"
              placeholder="Filter by lecturer..."
              value={filters.lecturer}
              onChange={(e) => setFilters({ ...filters, lecturer: e.target.value })}
            />
          </div>
          <div className="filter-group">
            <label>Recording Status</label>
            <select
              value={filters.recordingStatus}
              onChange={(e) => setFilters({ ...filters, recordingStatus: e.target.value })}
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="processing">Processing</option>
              <option value="none">None</option>
            </select>
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
              <option value="duration-desc">Duration (Longest)</option>
              <option value="duration-asc">Duration (Shortest)</option>
              <option value="participants-desc">Participants (Most)</option>
              <option value="participants-asc">Participants (Least)</option>
            </select>
          </div>
        </div>

        {/* Sessions Table */}
        {sortedSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3>No Sessions Found</h3>
            <p>No sessions match your current filter criteria.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Session Name</th>
                <th>Lecturer</th>
                <th>Start Time</th>
                <th>Duration</th>
                <th>Peak Participants</th>
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
                    <div style={{ fontSize: '14px' }}>
                      <div>{format(new Date(session.startTime), 'MMM dd, yyyy')}</div>
                      <div style={{ color: '#6c757d', fontSize: '12px' }}>
                        {format(new Date(session.startTime), 'HH:mm')}
                        {session.endTime && ` - ${format(new Date(session.endTime), 'HH:mm')}`}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {session.duration ? `${session.duration}m` : 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} />
                      {session.peakParticipants}
                    </div>
                  </td>
                  <td>
                    {getRecordingStatusBadge(session.recordingStatus)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {session.recordingUrl && (
                        <a 
                          href={session.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                        >
                          <Video size={12} />
                          View
                        </a>
                      )}
                      <button 
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                        onClick={() => {
                          alert(`Session Details:\n\nCourse: ${session.courseName}\nSession: ${session.sessionName}\nLecturer: ${session.lecturerName}\nDuration: ${session.duration || 'N/A'} minutes\nPeak Participants: ${session.peakParticipants}`)
                        }}
                      >
                        <ExternalLink size={12} />
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

export default HistoricalLogTab
