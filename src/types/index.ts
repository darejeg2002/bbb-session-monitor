export interface SessionData {
  id: string
  courseName: string
  sessionName: string
  lecturerName: string
  startTime: string
  endTime?: string
  duration?: number // in minutes
  currentParticipants: number
  peakParticipants: number
  status: 'active' | 'ended'
  recordingStatus: 'none' | 'recording' | 'processing' | 'available'
  recordingUrl?: string
  joinUrl?: string
  participants: Participant[]
}

export interface Participant {
  id: string
  name: string
  role: 'student' | 'teacher' | 'admin'
  joinTime: string
  leaveTime?: string
  duration?: number
}

export interface PluginConfig {
  dataRetentionDays: number
  pollingEnabled: boolean
  pollingInterval: number
  webhookUrl: string
  webhookSecret: string
  allowedIPs: string[]
  emailAlerts: boolean
  alertThreshold: number
}

export interface WebhookEvent {
  id: string
  timestamp: string
  event: string
  meetingId: string
  data: any
  processed: boolean
}

export interface ExportFilter {
  dateFrom: string
  dateTo: string
  course?: string
  lecturer?: string
  status?: string
  recordingStatus?: string
}
