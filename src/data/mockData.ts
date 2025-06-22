import { SessionData, PluginConfig } from '../types'

export const mockActiveSessions: SessionData[] = [
  {
    id: 'session-1',
    courseName: 'Advanced Web Development',
    sessionName: 'React Hooks Deep Dive',
    lecturerName: 'Dr. Sarah Johnson',
    startTime: '2024-01-15T14:00:00Z',
    currentParticipants: 24,
    peakParticipants: 28,
    status: 'active',
    recordingStatus: 'recording',
    joinUrl: 'https://bbb.university.edu/join/session-1',
    participants: [
      {
        id: 'p1',
        name: 'Dr. Sarah Johnson',
        role: 'teacher',
        joinTime: '2024-01-15T14:00:00Z'
      },
      {
        id: 'p2',
        name: 'Alice Smith',
        role: 'student',
        joinTime: '2024-01-15T14:02:00Z'
      },
      {
        id: 'p3',
        name: 'Bob Wilson',
        role: 'student',
        joinTime: '2024-01-15T14:03:00Z'
      }
    ]
  },
  {
    id: 'session-2',
    courseName: 'Database Systems',
    sessionName: 'SQL Optimization Techniques',
    lecturerName: 'Prof. Michael Chen',
    startTime: '2024-01-15T15:30:00Z',
    currentParticipants: 18,
    peakParticipants: 22,
    status: 'active',
    recordingStatus: 'recording',
    joinUrl: 'https://bbb.university.edu/join/session-2',
    participants: [
      {
        id: 'p4',
        name: 'Prof. Michael Chen',
        role: 'teacher',
        joinTime: '2024-01-15T15:30:00Z'
      },
      {
        id: 'p5',
        name: 'Carol Davis',
        role: 'student',
        joinTime: '2024-01-15T15:32:00Z'
      }
    ]
  },
  {
    id: 'session-3',
    courseName: 'Machine Learning Fundamentals',
    sessionName: 'Neural Networks Introduction',
    lecturerName: 'Dr. Emily Rodriguez',
    startTime: '2024-01-15T16:00:00Z',
    currentParticipants: 35,
    peakParticipants: 38,
    status: 'active',
    recordingStatus: 'recording',
    joinUrl: 'https://bbb.university.edu/join/session-3',
    participants: [
      {
        id: 'p6',
        name: 'Dr. Emily Rodriguez',
        role: 'teacher',
        joinTime: '2024-01-15T16:00:00Z'
      }
    ]
  }
]

export const mockHistoricalSessions: SessionData[] = [
  {
    id: 'hist-1',
    courseName: 'Web Development Basics',
    sessionName: 'HTML & CSS Fundamentals',
    lecturerName: 'Dr. Sarah Johnson',
    startTime: '2024-01-14T10:00:00Z',
    endTime: '2024-01-14T11:30:00Z',
    duration: 90,
    currentParticipants: 0,
    peakParticipants: 32,
    status: 'ended',
    recordingStatus: 'available',
    recordingUrl: 'https://bbb.university.edu/recording/hist-1',
    participants: []
  },
  {
    id: 'hist-2',
    courseName: 'Database Systems',
    sessionName: 'Introduction to NoSQL',
    lecturerName: 'Prof. Michael Chen',
    startTime: '2024-01-14T14:00:00Z',
    endTime: '2024-01-14T15:45:00Z',
    duration: 105,
    currentParticipants: 0,
    peakParticipants: 28,
    status: 'ended',
    recordingStatus: 'available',
    recordingUrl: 'https://bbb.university.edu/recording/hist-2',
    participants: []
  },
  {
    id: 'hist-3',
    courseName: 'Software Engineering',
    sessionName: 'Agile Methodologies',
    lecturerName: 'Dr. James Wilson',
    startTime: '2024-01-13T09:00:00Z',
    endTime: '2024-01-13T10:30:00Z',
    duration: 90,
    currentParticipants: 0,
    peakParticipants: 25,
    status: 'ended',
    recordingStatus: 'processing',
    participants: []
  },
  {
    id: 'hist-4',
    courseName: 'Machine Learning Fundamentals',
    sessionName: 'Linear Regression',
    lecturerName: 'Dr. Emily Rodriguez',
    startTime: '2024-01-12T11:00:00Z',
    endTime: '2024-01-12T12:30:00Z',
    duration: 90,
    currentParticipants: 0,
    peakParticipants: 42,
    status: 'ended',
    recordingStatus: 'available',
    recordingUrl: 'https://bbb.university.edu/recording/hist-4',
    participants: []
  },
  {
    id: 'hist-5',
    courseName: 'Cybersecurity Basics',
    sessionName: 'Network Security Fundamentals',
    lecturerName: 'Prof. David Kim',
    startTime: '2024-01-11T13:00:00Z',
    endTime: '2024-01-11T14:45:00Z',
    duration: 105,
    currentParticipants: 0,
    peakParticipants: 19,
    status: 'ended',
    recordingStatus: 'none',
    participants: []
  }
]

export const mockConfig: PluginConfig = {
  dataRetentionDays: 150,
  pollingEnabled: true,
  pollingInterval: 60,
  webhookUrl: 'https://moodle.university.edu/blocks/bbb_monitor/webhook.php',
  webhookSecret: 'your-webhook-secret-key',
  allowedIPs: ['192.168.1.100', '10.0.0.50'],
  emailAlerts: true,
  alertThreshold: 50
}
