import type { Station } from '../types'

export const stations: Station[] = [
  // Blue Line - 25 stations
  { id: 'SAB', name: 'SAB', line: 'blue', lineColor: '#3b82f6' },
  { id: 'SLM', name: 'D. Sulaiman Al Habib', line: 'blue', lineColor: '#3b82f6' },
  { id: 'KAFD', name: 'KAFD', line: 'blue', lineColor: '#3b82f6' },
  { id: 'MRJ', name: 'Al Morooj', line: 'blue', lineColor: '#3b82f6' },
  { id: 'KFD', name: 'King Fahd District', line: 'blue', lineColor: '#3b82f6' },
  { id: 'KF2', name: 'King Fahd District 2', line: 'blue', lineColor: '#3b82f6' },
  { id: 'STC', name: 'STC', line: 'blue', lineColor: '#3b82f6' },
  { id: 'WRD', name: 'Al Worood 2', line: 'blue', lineColor: '#3b82f6' },
  { id: 'ORB', name: 'Al Orouba', line: 'blue', lineColor: '#3b82f6' },
  { id: 'ANM', name: 'Alinma Bank', line: 'blue', lineColor: '#3b82f6' },
  { id: 'BLD', name: 'Bank AlBilad', line: 'blue', lineColor: '#3b82f6' },
  { id: 'KFN', name: 'King Fahd National Library', line: 'blue', lineColor: '#3b82f6' },
  { id: 'MOI', name: 'Ministry of Interior', line: 'blue', lineColor: '#3b82f6' },
  { id: 'ALM', name: 'Al Moraba', line: 'blue', lineColor: '#3b82f6' },
  { id: 'PAS', name: 'Passports', line: 'blue', lineColor: '#3b82f6' },
  { id: 'NH', name: 'National Museum', line: 'blue', lineColor: '#3b82f6' },
  { id: 'BTH', name: 'Al Batha', line: 'blue', lineColor: '#3b82f6' },
  { id: 'QH', name: 'Qasr Al Hokm', line: 'blue', lineColor: '#3b82f6' },
  { id: 'OUD', name: 'Al Oud', line: 'blue', lineColor: '#3b82f6' },
  { id: 'SKR', name: 'Sukairina', line: 'blue', lineColor: '#3b82f6' },
  { id: 'MNF', name: 'Manfoha', line: 'blue', lineColor: '#3b82f6' },
  { id: 'EMH', name: 'Eman Hospital', line: 'blue', lineColor: '#3b82f6' },
  { id: 'PTC', name: 'Public Transport Center', line: 'blue', lineColor: '#3b82f6' },
  { id: 'AZZ', name: 'Al Aziziyah', line: 'blue', lineColor: '#3b82f6' },
  { id: 'DBD', name: 'Al Dar Al Baida', line: 'blue', lineColor: '#3b82f6' },
  // Red Line - 15 stations
  { id: 'KSU', name: 'King Saud University', line: 'red', lineColor: '#ef4444' },
  { id: 'KSO', name: 'King Salman Oasis', line: 'red', lineColor: '#ef4444' },
  { id: 'TEC', name: 'Technical City', line: 'red', lineColor: '#ef4444' },
  { id: 'TKH', name: 'Al Takhassusi', line: 'red', lineColor: '#ef4444' },
  { id: 'STC_R', name: 'STC', line: 'red', lineColor: '#ef4444' },
  { id: 'WRD_R', name: 'Al Worood', line: 'red', lineColor: '#ef4444' },
  { id: 'KAR', name: 'King Abdulaziz Road', line: 'red', lineColor: '#ef4444' },
  { id: 'MOE', name: 'Ministry of Education', line: 'red', lineColor: '#ef4444' },
  { id: 'NUZ', name: 'Al Nuzhah', line: 'red', lineColor: '#ef4444' },
  { id: 'REC', name: 'Riyadh Exhibition Center', line: 'red', lineColor: '#ef4444' },
  { id: 'KBW', name: 'Khaled Bin Al Walid Road', line: 'red', lineColor: '#ef4444' },
  { id: 'HMR', name: 'Al Hamra', line: 'red', lineColor: '#ef4444' },
  { id: 'KHJ', name: 'Al Khaleej', line: 'red', lineColor: '#ef4444' },
  { id: 'SEV', name: 'Seville', line: 'red', lineColor: '#ef4444' },
  { id: 'KFS', name: 'King Fahd Sports City', line: 'red', lineColor: '#ef4444' },
]

export const lines = [
  { id: 'blue', name: 'Blue Line', color: '#3b82f6' },
  { id: 'red', name: 'Red Line', color: '#ef4444' },
]

export const shifts = ['Morning', 'Evening', 'Night'] as const
export const locations = ['Platform 01', 'Platform 02', 'Concourse', 'Street Level', 'Track 01', 'Track 02', 'Equipment Room', 'Technical Room'] as const
export const reporterRoles = [
  'OCC', 'Station Manager (SM)', 'Asst Station Manager (ASM)', 'Station Ambassador (SA)',
  'Security', 'Maintenance', 'Cleaner', 'Passenger', 'Police', 'Civil Defense', 'Other',
] as const
export const categories = [
  'Passenger Medical', 'Injury / Fall', 'Fire Alarm', 'Smoke',
  'Fire Pump', 'Generator', 'Chiller', 'Tunnel Ventilation TVS',
  'HVAC', 'UPS', 'Escalator', 'Elevator', 'Platform Screen Doors PSD',
  'Power Outage', 'Water Leak', 'Track Access', 'Switch Point Failure',
  'Train Rescue', 'Train Breakdown', 'Door Isolation', 'Parking Brake',
  'Air Brake', 'Train Positioning Loss', 'Security Incident', 'Suspicious Object', 'Other',
] as const
export const severities = ['Critical', 'High', 'Medium', 'Low'] as const
export const operatingModes = ['UTO', 'ATPM', 'RM', 'DM'] as const
export const staffRoles = [
  'Station Manager (SM)', 'Asst Station Manager (ASM)', 'Station Ambassador (SA)',
  'Security', 'Maintenance', 'Medical', 'Police', 'Civil Defense',
] as const
