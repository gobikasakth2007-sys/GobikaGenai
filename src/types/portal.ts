export type PortalId =
  | 'overview'
  | 'admissions'
  | 'placements'
  | 'faculty'
  | 'campus'
  | 'culturals'
  | 'achievements'
  | 'forums'
  | 'facilities'
  | 'enrollment-hostel'
  | 'inter-college'
  | 'global';

export interface PortalMeta {
  id: PortalId;
  label: string;
  shortLabel: string;
  sectionGroup: 'academics' | 'campus' | 'opportunities';
  summary: string;
}

export interface ProgramInfo {
  code: string;
  name: string;
  level: 'UG' | 'PG' | 'PhD';
  department: string;
  duration: string;
  annualFee: string;
  intake: number;
  enrolled: number;
  eligibility: string;
}

export interface AdmissionApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  programCode: string;
  programName: string;
  qualifyingScore: string;
  boardOrUniversity: string;
  hostelRequired: boolean;
  scholarshipTrack?: string;
  submittedAt: string;
  status: 'Under Verification' | 'Provisional Shortlist' | 'Counseling Scheduled';
}

export interface ScholarshipOpportunity {
  id: string;
  name: string;
  category: 'Merit' | 'Sports & NCC' | 'Need & First-Gen' | 'Government' | 'Research';
  waiverRange: string;
  eligibility: string;
  benefitDetail: string;
  deadline: string;
}

export interface SportsTeamAchievement {
  id: string;
  sport: string;
  level: string;
  title: string;
  year: string;
  coach: string;
  highlights: string;
}

export interface PlacementYearStat {
  year: string;
  placedCount: number;
  placementRate: number;
  highestCtcLpa: number;
  medianCtcLpa: number;
  recruitersCount: number;
}

export interface RecruiterProfile {
  name: string;
  sector: string;
  hires2026: number;
  packageRange: string;
  roles: string;
  eligibility: string;
}

export interface DepartmentPlacement {
  department: string;
  eligible: number;
  placed: number;
  avgCtcLpa: number;
  topOfferLpa: number;
}

export interface FacultyProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  phdUniversity: string;
  mastersAlmaMater: string;
  bachelorsAlmaMater: string;
  researchFocus: string;
  experienceYears: number;
  publications: number;
  patents: number;
  grantsWon: string;
  email: string;
  officeRoom: string;
}

export interface CampusZone {
  id: string;
  name: string;
  blockCode: string;
  areaSqFt: string;
  capacity: string;
  hours: string;
  description: string;
  highlights: string[];
  imageUrl?: string;
}

export interface CulturalFestival {
  id: string;
  title: string;
  month: string;
  scale: string;
  description: string;
  flagshipEvents: string[];
}

export interface CulturalClub {
  id: string;
  name: string;
  category: string;
  facultyLead: string;
  membersCount: number;
  meetingSchedule: string;
  description: string;
}

export interface AchievementMilestone {
  id: string;
  year: string;
  era: 'Founding (1997–2005)' | 'Autonomy & Growth (2006–2016)' | 'National Eminence (2017–2023)' | 'Present Horizon (2024–2026)';
  category: 'Accreditation' | 'Research' | 'Academics' | 'Sports & Culture';
  title: string;
  detail: string;
  metric?: string;
}

export interface ForumReply {
  id: string;
  author: string;
  role: string;
  content: string;
  createdAt: string;
}

export interface ForumThread {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  author: string;
  authorRole: string;
  content: string;
  createdAt: string;
  replies: ForumReply[];
}

export interface FacilityItem {
  id: string;
  name: string;
  category: 'Research & Labs' | 'Academic & Library' | 'Student Welfare' | 'Sustainable Campus';
  specification: string;
  capacityOrCount: string;
  accessHours: string;
  description: string;
  imageUrl?: string;
}

export interface PlacementHelpRequest {
  id: string;
  collegeEmail: string;
  studentName: string;
  rollNumber: string;
  department: string;
  assistanceType:
    | 'Resume & Portfolio Review'
    | 'Mock Technical Interview'
    | 'Aptitude & Coding Mentorship'
    | 'Recruiter Drive Guidance';
  targetCompanyOrRole: string;
  details: string;
  submittedAt: string;
  status: 'Assigned to Placement Mentor' | 'Session Scheduled';
}

export interface HostelBlock {
  id: string;
  name: string;
  residentGroup: "Men's Residence" | "Women's Residence" | 'PG & International';
  warden: string;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  roomTypes: {
    type: string;
    annualFee: string;
    availableBeds: number;
  }[];
  amenities: string[];
}

export interface HostelRequest {
  id: string;
  studentName: string;
  registerOrAppId: string;
  email: string;
  hostelId: string;
  hostelName: string;
  roomType: string;
  submittedAt: string;
  status: 'Allocation Queued' | 'Seat Reserved';
}

export interface InterCollegeEvent {
  id: string;
  title: string;
  hostDepartment: string;
  date: string;
  venue: string;
  mode: 'Team' | 'Solo' | 'Team / Solo';
  maxTeamSize: number;
  prizePool: string;
  registrationFee: string;
  description: string;
  seatsRemaining: number;
}

export interface EventRegistration {
  id: string;
  passCode: string;
  eventId: string;
  eventTitle: string;
  participantName: string;
  collegeName: string;
  email: string;
  phone: string;
  teamMembers: string;
  submittedAt: string;
}

export interface GlobalPartner {
  id: string;
  university: string;
  country: string;
  mouYear: string;
  programs: string;
  seatsPerYear: number;
  scholarshipAvailable: string;
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  navigateToPortal?: PortalId | null;
  navigateLabel?: string | null;
  suggestedQuestions?: string[];
}
