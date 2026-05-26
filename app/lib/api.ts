const API_BASE = process.env.API_BASE_URL || "/api";

export interface LabApiResponse {
  id: number;
  title: string;
  slug: string | null;
  link: string | null;
  active: boolean;
  short_description: string | null;
  description: string | null;
  images: string[];
  directions_list: { id: number; title: string; link: string | null }[];
  leaders_list: { id: number; full_name: string; email: string }[];
  students_count: number;
  projects_count: number;
}

export interface ProjectApiResponse {
  id: number;
  title: string;
  description: string | null;
  goal: string | null;
  need_report: boolean;
  laboratories: { id: number; title: string }[];
  roles: { id: number; title: string; slot_id: number; assigned_count: number }[];
  participants: {
    id: number;
    student_id: number;
    student_name: string;
    role: string;
    present: boolean;
  }[];
  active_participants_count: number;
}

export interface StudentLabApiResponse {
  id: number;
  student: number;
  student_name: string | null;
  laboratory: number | null;
  laboratory_title: string | null;
}

export interface StudentApiResponse {
  id: number;
  surname: string;
  name: string;
  patronymic: string | null;
  full_name: string;
  study_group: string;
  phone_number: string;
  email: string;
  university_city: string;
  task_board: string | null;
  telegram_nickname: string | null;
  telegram_id: number | null;
  experience: string | null;
  wishes: string | null;
  metaverse_account_link: string | null;
  laboratories: { id: number; title: string }[];
  directions: { id: number; title: string }[];
  projects: { id: number; title: string; role: string }[];
}

export interface AchievementApiResponse {
  id: number;
  title: string;
  laboratory: number | null;
  laboratory_title: string | null;
  project: number | null;
  project_title: string | null;
  text: string | null;
  text_limited: string | null;
  link: string | null;
  image: string | null;
  image_url: string | null;
}

export async function fetchLabs(): Promise<LabApiResponse[]> {
  const res = await fetch(`${API_BASE}/labs/`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? data;
}

export async function fetchLabBySlug(slug: string): Promise<LabApiResponse | null> {
  const res = await fetch(`${API_BASE}/labs/?slug=${slug}`);
  if (!res.ok) return null;
  const data = await res.json();
  const results = data.results ?? data;
  return results.length > 0 ? results[0] : null;
}

export async function fetchLabProjectsBySlug(slug: string): Promise<ProjectApiResponse[]> {
  const res = await fetch(`${API_BASE}/projects/?lab_slug=${slug}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? data;
}

export async function fetchLabStudentsByLabId(labId: number): Promise<StudentLabApiResponse[]> {
  const res = await fetch(`${API_BASE}/student-labs/?laboratory=${labId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? data;
}

export async function fetchLabMembersByLabId(labId: number): Promise<StudentApiResponse[]> {
  const res = await fetch(`${API_BASE}/labs/${labId}/members/`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? data;
}

export async function fetchLabProjectById(id: number): Promise<ProjectApiResponse | null> {
  const res = await fetch(`${API_BASE}/projects/${id}/`);
  if (!res.ok) return null;
  return res.json();
}

export interface GuideApiResponse {
  id: number;
  surname: string;
  name: string;
  patronymic: string;
  laboratory: number;
  laboratory_title: string;
}

export async function fetchLabGuidesByLabId(labId: number): Promise<GuideApiResponse[]> {
  const res = await fetch(`${API_BASE}/guides/?laboratory=${labId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? data;
}

export async function fetchProjectAchievementsByProjectId(projectId: number): Promise<AchievementApiResponse[]> {
  const res = await fetch(`${API_BASE}/achievements/?project=${projectId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? data;
}

export async function fetchLabAchievementsByLabId(labId: number): Promise<AchievementApiResponse[]> {
  const res = await fetch(`${API_BASE}/achievements/?laboratory=${labId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? data;
}
