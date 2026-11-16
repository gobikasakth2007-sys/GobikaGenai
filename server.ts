import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  FACULTY_PROFILES,
  GLOBAL_PARTNERS,
  INITIAL_FORUM_THREADS,
  INITIAL_HOSTEL_BLOCKS,
  INTER_COLLEGE_EVENTS,
  PLACEMENT_YEARS,
  PORTALS,
  PROGRAMS,
} from './src/data/collegeData.ts';
import type {
  AdmissionApplication,
  EventRegistration,
  ForumThread,
  HostelBlock,
  HostelRequest,
  PlacementHelpRequest,
} from './src/types/portal.ts';

interface StoreState {
  admissions: AdmissionApplication[];
  forums: ForumThread[];
  hostels: HostelBlock[];
  hostelRequests: HostelRequest[];
  eventRegistrations: EventRegistration[];
  placementHelpRequests: PlacementHelpRequest[];
  sportsTrials: Array<{
    id: string;
    athleteName: string;
    email: string;
    sport: string;
    highestLevel: string;
    preferredTrialDate: string;
    submittedAt: string;
  }>;
  globalInquiries: Array<{
    id: string;
    name: string;
    email: string;
    department: string;
    targetUniversity: string;
    notes: string;
    submittedAt: string;
  }>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'skasc-store.json');

const SEED_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 'SKASC-2026-4102',
    applicantName: 'Karthikeyan S',
    email: 'karthik.s2026@example.edu',
    phone: '+91 98422 11409',
    programCode: 'BSC-AIML',
    programName: 'B.Sc. Artificial Intelligence & Machine Learning',
    qualifyingScore: '94.5%',
    boardOrUniversity: 'CBSE',
    hostelRequired: true,
    submittedAt: '2026-11-10',
    status: 'Counseling Scheduled',
  },
  {
    id: 'SKASC-2026-4119',
    applicantName: 'Divya Bharathi M',
    email: 'divya.b2026@example.edu',
    phone: '+91 97890 55210',
    programCode: 'BCOM-PA',
    programName: 'B.Com. Professional Accounting',
    qualifyingScore: '96.2%',
    boardOrUniversity: 'Tamil Nadu State Board',
    hostelRequired: false,
    submittedAt: '2026-11-12',
    status: 'Provisional Shortlist',
  },
];

function createInitialStore(): StoreState {
  return {
    admissions: SEED_ADMISSIONS,
    forums: INITIAL_FORUM_THREADS,
    hostels: INITIAL_HOSTEL_BLOCKS,
    hostelRequests: [],
    eventRegistrations: [],
    placementHelpRequests: [],
    sportsTrials: [],
    globalInquiries: [],
  };
}

function loadStore(): StoreState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<StoreState>;
      return {
        admissions: parsed.admissions ?? SEED_ADMISSIONS,
        forums: parsed.forums ?? INITIAL_FORUM_THREADS,
        hostels: parsed.hostels ?? INITIAL_HOSTEL_BLOCKS,
        hostelRequests: parsed.hostelRequests ?? [],
        eventRegistrations: parsed.eventRegistrations ?? [],
        placementHelpRequests: parsed.placementHelpRequests ?? [],
        sportsTrials: parsed.sportsTrials ?? [],
        globalInquiries: parsed.globalInquiries ?? [],
      };
    }
  } catch {
    // Fallback to fresh seed store if disk read fails
  }
  return createInitialStore();
}

function saveStore(state: StoreState): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch {
    // Non-fatal in read-only environments; state remains active in memory
  }
}

let store: StoreState = loadStore();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function deterministicNavigationFallback(message: string) {
  const q = message.toLowerCase();
  if (q.includes('admi') || q.includes('apply') || q.includes('fee') || q.includes('eligib') || q.includes('course') || q.includes('scholar') || q.includes('waiver') || q.includes('bursary')) {
    return {
      reply:
        'You can explore UG, PG, and PhD eligibility, annual tuition schedules, scholarship waivers (up to 100% merit & sports bursaries), and submit an online application in the Admission Portal.',
      navigateToPortal: 'admissions',
      navigateLabel: 'Open Admission & Scholarship Portal',
      suggestedQuestions: [
        'What is the fee for B.Sc. AI & ML?',
        'Show me placement statistics',
        'Check hostel bed availability',
      ],
    };
  }
  if (q.includes('place') || q.includes('ctc') || q.includes('recruit') || q.includes('package') || q.includes('job')) {
    return {
      reply:
        'For 2025–26, SKASC achieved a 96.4% placement rate with 1,942 offers across 218 recruiters including Goldman Sachs (₹18.4 LPA highest CTC), Zoho, Deloitte, Amazon, and TCS.',
      navigateToPortal: 'placements',
      navigateLabel: 'Open Placement Details Portal',
      suggestedQuestions: [
        'Which faculty teach Computer Science?',
        'How do I apply for admissions?',
        'Tell me about global exchange MoUs',
      ],
    };
  }
  if (q.includes('facul') || q.includes('prof') || q.includes('phd') || q.includes('study') || q.includes('research') || q.includes('hod')) {
    return {
      reply:
        'Our Faculty & Study Background Portal lists Professors and Heads of Department along with their PhD universities (IIT Madras, IISc, Anna University, Bharathiar, EFLU), patents, and research grants.',
      navigateToPortal: 'faculty',
      navigateLabel: 'Open Faculty & Study Background',
      suggestedQuestions: [
        'Show research facilities and labs',
        'Open course forums',
        'View institutional achievements',
      ],
    };
  }
  if (q.includes('hostel') || q.includes('enroll') || q.includes('bed') || q.includes('room') || q.includes('student count')) {
    return {
      reply:
        'SKASC currently enrolls 8,420 students (6,240 UG, 1,890 PG, 290 PhD). Live hostel vacancy across Kurinji, Mullai, Marutham, Neithal, and Paalai residences—plus bed reservation—is available in the Enrollment & Hostel Portal.',
      navigateToPortal: 'enrollment-hostel',
      navigateLabel: 'Open Enrollment & Hostel Portal',
      suggestedQuestions: [
        'What campus facilities are available?',
        'How do I apply for admission?',
        'Tell me about Krishnotsav culturals',
      ],
    };
  }
  if (q.includes('inter') || q.includes('hack') || q.includes('symposium') || q.includes('event') || q.includes('competition')) {
    return {
      reply:
        'External college students can apply directly for Krishna Hack 2026, FinConclave, BioQuest, and Natya Sangam in the Inter-College Events Portal and receive an instant Delegate Pass.',
      navigateToPortal: 'inter-college',
      navigateLabel: 'Open Inter-College Event Portal',
      suggestedQuestions: [
        'Show annual culturals & festivals',
        'Explore campus auditorium & blocks',
        'Check global opportunities',
      ],
    };
  }
  if (q.includes('global') || q.includes('abroad') || q.includes('exchange') || q.includes('mou') || q.includes('international')) {
    return {
      reply:
        'SKASC maintains 6 active international partnerships including Technical University of Munich, Universiti Malaya, Curtin University, University of Leeds, NTU Singapore, and University of Waterloo.',
      navigateToPortal: 'global',
      navigateLabel: 'Open Global Opportunities Portal',
      suggestedQuestions: [
        'What are our placement highlights?',
        'How do I apply for admission?',
        'Show achievements from 1997 to 2026',
      ],
    };
  }
  if (q.includes('forum') || q.includes('discuss') || q.includes('thread') || q.includes('doubt')) {
    return {
      reply:
        'Students and faculty collaborate on syllabus queries, GPU lab slots, and exam prep in the Course Forums Portal. You can browse threads by degree or start a new discussion.',
      navigateToPortal: 'forums',
      navigateLabel: 'Open Course Forums',
      suggestedQuestions: [
        'View faculty profiles',
        'Explore library & lab facilities',
        'Check inter-college hackathons',
      ],
    };
  }
  if (q.includes('cultur') || q.includes('fest') || q.includes('club') || q.includes('krishnotsav') || q.includes('pongal')) {
    return {
      reply:
        'Campus life shines through Krishnotsav, Bharatham Heritage Confluence, Samathuva Pongal Vizha, and active student societies for classical dance, music, theatre, and film.',
      navigateToPortal: 'culturals',
      navigateLabel: 'Open Culturals & Festivals Portal',
      suggestedQuestions: [
        'Show campus buildings & auditorium',
        'Apply for inter-college events',
        'View college achievements since 1997',
      ],
    };
  }
  if (q.includes('sport') || q.includes('athlet') || q.includes('kabaddi') || q.includes('cricket') || q.includes('trial') || q.includes('achiev') || q.includes('history') || q.includes('1997') || q.includes('naac') || q.includes('nirf') || q.includes('rank')) {
    return {
      reply:
        'Explore SKASC’s Sports & Achievements Portal featuring our 400m synthetic athletic track, AIU varsity championship laurels, sports quota trial booking, and institutional milestones from 1997 to 2026.',
      navigateToPortal: 'achievements',
      navigateLabel: 'Open Sports & Achievements Portal',
      suggestedQuestions: [
        'Show scholarship opportunities',
        'Check global university MoUs',
        'Explore campus infrastructure',
      ],
    };
  }
  if (q.includes('facilit') || q.includes('lab') || q.includes('bus') || q.includes('transport') || q.includes('solar') || q.includes('library')) {
    return {
      reply:
        'Our Facilities Portal details the 9 AI & Cloud labs, DBT Biosciences suite, 1,12,400-volume Central Library, 48-route transport fleet, 24/7 health wing, and 1.4 MW solar microgrid.',
      navigateToPortal: 'facilities',
      navigateLabel: 'Open Facilities Portal',
      suggestedQuestions: [
        'Tour the College Campus blocks',
        'Check hostel room availability',
        'Open Course Forums',
      ],
    };
  }
  if (q.includes('campus') || q.includes('block') || q.includes('auditorium') || q.includes('map') || q.includes('kuniamuthur')) {
    return {
      reply:
        'Located in Kuniamuthur, Coimbatore, our 42-acre campus includes the Main Heritage Pavilion, Dr. Kalam Central Library, 2,200-seat Convention Auditorium, and Turing & Mendel Research Complex.',
      navigateToPortal: 'campus',
      navigateLabel: 'Open College Campus Portal',
      suggestedQuestions: [
        'Check hostel bed availability',
        'See culturals & clubs',
        'Open Facilities directory',
      ],
    };
  }
  return {
    reply:
      'Welcome to Sri Krishna Arts and Science College (Coimbatore). I can guide you directly to Admissions, Placements, Faculty Study Backgrounds, Campus Blocks, Culturals, Achievements (1997–2026), Course Forums, Facilities, Enrollment & Hostel Availability, Inter-College Events, or Global Opportunities. Where would you like to go?',
    navigateToPortal: null,
    navigateLabel: null,
    suggestedQuestions: [
      'Take me to the Admission Portal',
      'Check hostel bed availability',
      'Show 2026 placement details',
    ],
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, institution: 'SKASC', academicYear: '2026-27' });
  });

  // Admissions API
  app.get('/api/admissions', (req, res) => {
    const query = String(req.query.q ?? '').trim().toLowerCase();
    if (!query) {
      res.json({ applications: store.admissions });
      return;
    }
    const matches = store.admissions.filter(
      (a) =>
        a.id.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.applicantName.toLowerCase().includes(query),
    );
    res.json({ applications: matches });
  });

  app.post('/api/admissions', (req, res) => {
    const {
      applicantName,
      email,
      phone,
      programCode,
      qualifyingScore,
      boardOrUniversity,
      hostelRequired,
      scholarshipTrack,
    } = req.body ?? {};

    if (!applicantName || !email || !phone || !programCode || !qualifyingScore) {
      res.status(400).json({ error: 'Please complete all required admission fields.' });
      return;
    }

    const program = PROGRAMS.find((p) => p.code === programCode);
    if (!program) {
      res.status(400).json({ error: 'Selected program code was not found.' });
      return;
    }

    const randomNum = Math.floor(5000 + Math.random() * 4900);
    const newApp: AdmissionApplication = {
      id: `SKASC-2026-${randomNum}`,
      applicantName: String(applicantName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      programCode: program.code,
      programName: program.name,
      qualifyingScore: String(qualifyingScore).trim(),
      boardOrUniversity: String(boardOrUniversity || 'State / CBSE Board').trim(),
      hostelRequired: Boolean(hostelRequired),
      scholarshipTrack: scholarshipTrack ? String(scholarshipTrack).trim() : undefined,
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'Under Verification',
    };

    store.admissions = [newApp, ...store.admissions];
    saveStore(store);
    res.status(201).json({ application: newApp });
  });

  // Course Forums API
  app.get('/api/forums', (_req, res) => {
    res.json({ threads: store.forums });
  });

  app.post('/api/forums', (req, res) => {
    const { courseCode, title, author, authorRole, content } = req.body ?? {};
    if (!courseCode || !title || !author || !content) {
      res.status(400).json({ error: 'Course, title, author, and message are required.' });
      return;
    }
    const program = PROGRAMS.find((p) => p.code === courseCode);
    const thread: ForumThread = {
      id: `thr-${Date.now()}`,
      courseCode: String(courseCode),
      courseName: program ? program.name : String(courseCode),
      title: String(title).trim(),
      author: String(author).trim(),
      authorRole: String(authorRole || 'Student').trim(),
      content: String(content).trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      replies: [],
    };
    store.forums = [thread, ...store.forums];
    saveStore(store);
    res.status(201).json({ thread });
  });

  app.post('/api/forums/:id/reply', (req, res) => {
    const { id } = req.params;
    const { author, role, content } = req.body ?? {};
    if (!author || !content) {
      res.status(400).json({ error: 'Name and reply text are required.' });
      return;
    }
    const idx = store.forums.findIndex((t) => t.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Forum thread not found.' });
      return;
    }
    const reply = {
      id: `rep-${Date.now()}`,
      author: String(author).trim(),
      role: String(role || 'Student').trim(),
      content: String(content).trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    store.forums[idx] = {
      ...store.forums[idx],
      replies: [...store.forums[idx].replies, reply],
    };
    saveStore(store);
    res.status(201).json({ thread: store.forums[idx] });
  });

  // Hostel Availability & Requests API
  app.get('/api/hostel', (_req, res) => {
    res.json({ hostels: store.hostels, requests: store.hostelRequests });
  });

  app.post('/api/hostel/request', (req, res) => {
    const { studentName, registerOrAppId, email, hostelId, roomType } = req.body ?? {};
    if (!studentName || !registerOrAppId || !email || !hostelId || !roomType) {
      res.status(400).json({ error: 'All hostel reservation fields are required.' });
      return;
    }

    const blockIdx = store.hostels.findIndex((h) => h.id === hostelId);
    if (blockIdx === -1) {
      res.status(404).json({ error: 'Selected hostel residence not found.' });
      return;
    }

    const block = store.hostels[blockIdx];
    const roomIdx = block.roomTypes.findIndex((r) => r.type === roomType);
    if (roomIdx === -1 || block.roomTypes[roomIdx].availableBeds <= 0) {
      res.status(409).json({ error: 'No vacant beds remain in that room category.' });
      return;
    }

    const updatedRoomTypes = block.roomTypes.map((r, i) =>
      i === roomIdx ? { ...r, availableBeds: Math.max(0, r.availableBeds - 1) } : r,
    );
    store.hostels[blockIdx] = {
      ...block,
      occupiedBeds: Math.min(block.totalBeds, block.occupiedBeds + 1),
      roomTypes: updatedRoomTypes,
    };

    const requestRecord: HostelRequest = {
      id: `HST-${Math.floor(10000 + Math.random() * 89999)}`,
      studentName: String(studentName).trim(),
      registerOrAppId: String(registerOrAppId).trim(),
      email: String(email).trim(),
      hostelId: block.id,
      hostelName: block.name,
      roomType: String(roomType),
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'Seat Reserved',
    };

    store.hostelRequests = [requestRecord, ...store.hostelRequests];
    saveStore(store);
    res.status(201).json({ request: requestRecord, hostels: store.hostels });
  });

  // Inter-College Events Registration API
  app.get('/api/events/registrations', (_req, res) => {
    res.json({ registrations: store.eventRegistrations });
  });

  app.post('/api/events/register', (req, res) => {
    const { eventId, participantName, collegeName, email, phone, teamMembers } = req.body ?? {};
    if (!eventId || !participantName || !collegeName || !email || !phone) {
      res.status(400).json({ error: 'Please complete all delegate registration fields.' });
      return;
    }
    const event = INTER_COLLEGE_EVENTS.find((e) => e.id === eventId);
    if (!event) {
      res.status(404).json({ error: 'Event not found.' });
      return;
    }

    const passCode = `PASS-${eventId.replace('evt-', '').toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 8999)}`;
    const registration: EventRegistration = {
      id: `reg-${Date.now()}`,
      passCode,
      eventId: event.id,
      eventTitle: event.title,
      participantName: String(participantName).trim(),
      collegeName: String(collegeName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      teamMembers: String(teamMembers || 'Solo Entry').trim(),
      submittedAt: new Date().toISOString().slice(0, 10),
    };

    store.eventRegistrations = [registration, ...store.eventRegistrations];
    saveStore(store);
    res.status(201).json({ registration });
  });

  // Global Opportunities Inquiry API
  app.post('/api/global/inquire', (req, res) => {
    const { name, email, department, targetUniversity, notes } = req.body ?? {};
    if (!name || !email || !department || !targetUniversity) {
      res.status(400).json({ error: 'Name, email, department, and target university are required.' });
      return;
    }
    const inquiry = {
      id: `GLB-${Math.floor(1000 + Math.random() * 8999)}`,
      name: String(name).trim(),
      email: String(email).trim(),
      department: String(department).trim(),
      targetUniversity: String(targetUniversity).trim(),
      notes: String(notes || '').trim(),
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    store.globalInquiries = [inquiry, ...store.globalInquiries];
    saveStore(store);
    res.status(201).json({ inquiry });
  });

  // Student Placement Assistance API (Official @skasc.ac.in email required)
  const isOfficialCollegeEmail = (email: string): boolean => {
    const normalized = email.trim().toLowerCase();
    return /^[a-z0-9._%+-]+@skasc\.(ac|edu)\.in$/.test(normalized);
  };

  app.get('/api/placements/help', (req, res) => {
    const email = String(req.query.email ?? '').trim().toLowerCase();
    if (!isOfficialCollegeEmail(email)) {
      res.status(403).json({
        error: 'Access restricted to verified SKASC student email IDs (@skasc.ac.in).',
      });
      return;
    }
    const requests = store.placementHelpRequests.filter(
      (r) => r.collegeEmail.toLowerCase() === email,
    );
    res.json({ requests });
  });

  app.post('/api/placements/help', (req, res) => {
    const {
      collegeEmail,
      studentName,
      rollNumber,
      department,
      assistanceType,
      targetCompanyOrRole,
      details,
    } = req.body ?? {};

    const normalizedEmail = String(collegeEmail ?? '').trim().toLowerCase();
    if (!isOfficialCollegeEmail(normalizedEmail)) {
      res.status(403).json({
        error:
          'Only enrolled SKASC students with an official @skasc.ac.in college email ID can submit placement assistance requests.',
      });
      return;
    }

    if (!studentName || !rollNumber || !department || !assistanceType || !details) {
      res.status(400).json({ error: 'Please complete all required placement support fields.' });
      return;
    }

    const helpRequest: PlacementHelpRequest = {
      id: `PLC-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      collegeEmail: normalizedEmail,
      studentName: String(studentName).trim(),
      rollNumber: String(rollNumber).trim().toUpperCase(),
      department: String(department).trim(),
      assistanceType: assistanceType,
      targetCompanyOrRole: String(targetCompanyOrRole || 'General Campus Placement').trim(),
      details: String(details).trim(),
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'Assigned to Placement Mentor',
    };

    store.placementHelpRequests = [helpRequest, ...store.placementHelpRequests];
    saveStore(store);
    res.status(201).json({ request: helpRequest });
  });

  // Sports Quota & Varsity Trial Registration API
  app.post('/api/sports/trial', (req, res) => {
    const { athleteName, email, sport, highestLevel, preferredTrialDate } = req.body ?? {};
    if (!athleteName || !email || !sport || !highestLevel) {
      res.status(400).json({ error: 'Please complete all required athlete trial fields.' });
      return;
    }
    const trial = {
      id: `SPT-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      athleteName: String(athleteName).trim(),
      email: String(email).trim(),
      sport: String(sport).trim(),
      highestLevel: String(highestLevel).trim(),
      preferredTrialDate: String(preferredTrialDate || 'Next Selection Camp').trim(),
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    store.sportsTrials = [trial, ...store.sportsTrials];
    saveStore(store);
    res.status(201).json({ trial });
  });

  // Gemini-Powered SKASC Navigation & Help Chatbot API
  app.post('/api/chat', async (req, res) => {
    const { message, currentPortal, history } = req.body ?? {};
    const userText = String(message ?? '').trim();
    if (!userText) {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json(deterministicNavigationFallback(userText));
      return;
    }

    const portalCatalog = PORTALS.map((p) => `- ${p.id}: ${p.label} — ${p.summary}`).join('\n');
    const programSummary = PROGRAMS.map((p) => `${p.code} (${p.name}, ${p.annualFee}, ${p.eligibility})`).join('; ');
    const facultySummary = FACULTY_PROFILES.map(
      (f) => `${f.name} (${f.designation}, PhD: ${f.phdUniversity}, Research: ${f.researchFocus})`,
    ).join('; ');
    const hostelSummary = store.hostels
      .map((h) => {
        const vacant = h.totalBeds - h.occupiedBeds;
        return `${h.name} (${h.residentGroup}): ${vacant} vacant beds out of ${h.totalBeds}`;
      })
      .join('; ');
    const eventSummary = INTER_COLLEGE_EVENTS.map((e) => `${e.title} on ${e.date} (${e.prizePool})`).join('; ');
    const globalSummary = GLOBAL_PARTNERS.map((g) => `${g.university}, ${g.country} (${g.programs})`).join('; ');
    const latestPlacement = PLACEMENT_YEARS[PLACEMENT_YEARS.length - 1];

    const systemInstruction = `You are the official SKASC Website Guide for Sri Krishna Arts and Science College, Kuniamuthur, Coimbatore (est. 1997, UGC Autonomous, NAAC A+ 3.41 CGPA, affiliated to Bharathiar University).
Your role is to answer visitor, student, parent, and external-delegate questions concisely and help them navigate directly to the right portal on this website.

Current portal the user is viewing: ${currentPortal || 'overview'}

Available Portals (use exact portal IDs in navigateToPortal when relevant):
${portalCatalog}

Verified Institutional Facts:
- Total Enrollment (2026-27): 8,420 students (6,240 UG, 1,890 PG, 290 PhD), 1:18 faculty-student ratio.
- Latest Placements (${latestPlacement.year}): ${latestPlacement.placementRate}% placed, ${latestPlacement.placedCount} offers, ${latestPlacement.recruitersCount} recruiters, Highest CTC ₹${latestPlacement.highestCtcLpa} LPA, Median CTC ₹${latestPlacement.medianCtcLpa} LPA. Top recruiters: Zoho, Goldman Sachs, Deloitte, Amazon, TCS, Infosys, Biocon, Cognizant.
- Programs: ${programSummary}
- Faculty & Study Backgrounds: ${facultySummary}
- Live Hostel Availability: ${hostelSummary}
- Upcoming Inter-College Events: ${eventSummary}
- Global Partners: ${globalSummary}

Guidelines:
- Be concise (2–4 crisp sentences), polite, accurate, and grounded strictly in the facts above.
- Whenever the user asks about a topic covered by a specific portal or asks to go/navigate/open a section, set navigateToPortal to that portal's exact ID and set navigateLabel to a clear action label like "Open Admission Portal". Otherwise set navigateToPortal and navigateLabel to null.
- Always provide 2 or 3 short suggestedQuestions for the user's next click.`;

    const recentHistory = Array.isArray(history)
      ? history
          .slice(-6)
          .map((m: { role?: string; text?: string }) => `${m.role === 'assistant' ? 'Guide' : 'User'}: ${m.text ?? ''}`)
          .join('\n')
      : '';

    const fullPrompt = recentHistory
      ? `Recent conversation:\n${recentHistory}\n\nLatest user message: ${userText}`
      : userText;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: fullPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: 'Concise helpful response to the user grounded in SKASC facts.',
              },
              navigateToPortal: {
                type: Type.STRING,
                nullable: true,
                description:
                  'Exact portal ID to navigate to: overview, admissions, placements, faculty, campus, culturals, achievements, forums, facilities, enrollment-hostel, inter-college, global, or null.',
              },
              navigateLabel: {
                type: Type.STRING,
                nullable: true,
                description: 'Short button label like "Open Placement Portal" when navigateToPortal is set, or null.',
              },
              suggestedQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 3 short follow-up questions the user might ask next.',
              },
            },
            required: ['reply', 'suggestedQuestions'],
          },
        },
      });

      const rawJson = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawJson) as {
        reply?: string;
        navigateToPortal?: string | null;
        navigateLabel?: string | null;
        suggestedQuestions?: string[];
      };

      const validPortalIds = new Set<string>(PORTALS.map((p) => p.id));
      const safePortal =
        parsed.navigateToPortal && validPortalIds.has(parsed.navigateToPortal)
          ? parsed.navigateToPortal
          : null;

      res.json({
        reply: parsed.reply || deterministicNavigationFallback(userText).reply,
        navigateToPortal: safePortal,
        navigateLabel: safePortal ? parsed.navigateLabel || `Open ${PORTALS.find((p) => p.id === safePortal)?.shortLabel} Portal` : null,
        suggestedQuestions:
          Array.isArray(parsed.suggestedQuestions) && parsed.suggestedQuestions.length > 0
            ? parsed.suggestedQuestions.slice(0, 3)
            : ['How do I apply for admission?', 'Check hostel availability', 'Show placement details'],
      });
    } catch (err) {
      console.error('Gemini chat error, using structured guide fallback:', err);
      res.json(deterministicNavigationFallback(userText));
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`SKASC Institutional Platform running on http://0.0.0.0:${port}`);
  });
}

startServer();
