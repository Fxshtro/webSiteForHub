// Типы для работы с лабораториями и участниками
// Готово для интеграции с базой данных

export interface Participant {
  id: string;
  name: string;
  role: 'student' | 'leader' | 'mentor' | 'admin';
  roleLabel: string; // Локализованное название роли
  avatar?: string;
  email?: string;
  specialization?: string;
  laboratoryId: string;
  joinedAt: Date | string;
  status?: 'active' | 'inactive';
}

export interface Laboratory {
  id: string;
  name: string;
  description?: string;
  participants: Participant[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Функция для получения участников лаборатории (будет заменена на API запрос)
export async function fetchLaboratoryParticipants(
  laboratoryId: string
): Promise<Participant[]> {
  // TODO: Заменить на реальный API запрос
  // Пример: const response = await fetch(`/api/laboratories/${laboratoryId}/participants`);
  // return response.json();
  
  return [];
}

// Функция для получения всех лабораторий (будет заменена на API запрос)
export async function fetchLaboratories(): Promise<Laboratory[]> {
  // TODO: Заменить на реальный API запрос
  // Пример: const response = await fetch('/api/laboratories');
  // return response.json();
  
  return [];
}

// Маппинг ролей для отображения
export const roleLabels: Record<Participant['role'], string> = {
  student: 'Студент',
  leader: 'Руководитель',
  mentor: 'Ментор',
  admin: 'Администратор',
};












