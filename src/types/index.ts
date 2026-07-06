// ===== Core Types =====

export type Shift = 'Morning' | 'Evening' | 'Night'
export type Location = 'Platform 01' | 'Platform 02' | 'Concourse' | 'Street Level' | 'Track 01' | 'Track 02' | 'Equipment Room' | 'Technical Room'
export type IncidentCategory =
  | 'Passenger Medical' | 'Injury / Fall' | 'Fire Alarm' | 'Smoke'
  | 'Fire Pump' | 'Generator' | 'Chiller' | 'Tunnel Ventilation TVS'
  | 'HVAC' | 'UPS' | 'Escalator' | 'Elevator' | 'Platform Screen Doors PSD'
  | 'Power Outage' | 'Water Leak' | 'Track Access' | 'Switch Point Failure'
  | 'Train Rescue' | 'Train Breakdown' | 'Door Isolation' | 'Parking Brake'
  | 'Air Brake' | 'Train Positioning Loss' | 'Security Incident' | 'Suspicious Object' | 'Other'
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low'
export type IncidentStatus = 'Open' | 'In Progress' | 'Closed'

export interface Incident {
  id: string

  // 1. Basic Information
  station: string
  date: string
  day: string
  shift: Shift
  smName: string
  somName: string

  // 2. Incident Source
  reportedBy: string
  sourceCCTV: boolean
  sourceIntercom: boolean
  sourcePassenger: boolean
  sourceStaff: boolean

  // 3. Operational Timings
  discoveryTime: string
  occNotificationTime: string
  occResponseTime: string
  somArrivalTime: string
  smArrivalTime: string

  // 4. Incident Details
  category: IncidentCategory
  severity: Severity
  description: string
  location: Location
  locationDetail: string
  emergencyCode: string
  permitNumber: string

  // 5. Immediate Action Taken
  actions: ImmediateAction[]
  supportRequested: string
  occInstructions: string
  finalResolution: string

  // 6. Attachments
  cctvReference: string
  intercomLog: string
  images: string[]

  // 7. Signatures
  somSignature: string
  somSignTime: string
  smSignature: string
  smSignTime: string

  // 8. Report Submission
  submitterName: string
  submitterTitle: string
  submitterDept: string
  submitterDate: string
  submitterSignature: string

  // Additional
  timeline: TimelineEntry[]
  status: IncidentStatus
  createdAt: string
  closedAt: string
}

export interface ImmediateAction {
  id: string
  time: string
  action: string
  by: string
  notes: string
}

export interface TimelineEntry {
  id: string
  timestamp: string
  description: string
  createdBy: string
}

// ===== Station =====
export interface Station {
  id: string
  name: string
  line: string
  lineColor: string
}

// ===== App =====
export type Page =
  | 'dashboard' | 'incidents' | 'incident-detail' | 'new-incident'
  | 'reports' | 'staff' | 'stations'

export interface AppUser {
  id: string
  name: string
  role: string
  station: string
}

export type StaffRole = 'Station Manager (SM)' | 'Asst Station Manager (ASM)' | 'Station Ambassador (SA)' | 'Security' | 'Maintenance' | 'Medical' | 'Police' | 'Civil Defense'
