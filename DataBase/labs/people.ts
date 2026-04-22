export interface LabPerson {
  id: string;
  name: string;
  role: string;
  about: string;
  isFavorite?: boolean;
}

export const labPeopleBySlug: Record<string, LabPerson[]> = {
  "legal-tech": [
    {
      id: "lt-1",
      name: "Анна Соколова",
      role: "Куратор Legal Tech",
      about: "Контрактная аналитика и legal design.",
      isFavorite: true,
    },
    {
      id: "lt-2",
      name: "Илья Морозов",
      role: "Проектный юрист",
      about: "Подготовка и проверка договорных шаблонов.",
    },
    {
      id: "lt-3",
      name: "Виктория Зорина",
      role: "Research Lead",
      about: "Мониторинг судебной практики и правовых рисков.",
    },
    {
      id: "lt-4",
      name: "Руслан Громов",
      role: "Backend Developer",
      about: "API юридического чат-бота и движок валидации.",
    },
    {
      id: "lt-5",
      name: "Мария Давыдова",
      role: "UX/UI Designer",
      about: "Интерфейсы юридической клиники и кабинета клиента.",
    },
    {
      id: "lt-6",
      name: "Егор Шестаков",
      role: "Product Analyst",
      about: "Метрики использования и гипотезы улучшений.",
    },
  ],
  "it-lab": [
    {
      id: "it-1",
      name: "Кирилл Тарасов",
      role: "Технический лидер",
      about: "Архитектура веб-платформ и код-стандарты.",
      isFavorite: true,
    },
    {
      id: "it-2",
      name: "Светлана Никифорова",
      role: "Frontend Developer",
      about: "Next.js, App Router, производительность UI.",
    },
    {
      id: "it-3",
      name: "Никита Фадеев",
      role: "Backend Developer",
      about: "Сервисные интеграции и API-шлюз.",
    },
    {
      id: "it-4",
      name: "Алексей Марченко",
      role: "DevOps Engineer",
      about: "CI/CD, мониторинг и надёжность релизов.",
    },
    {
      id: "it-5",
      name: "Юлия Кравцова",
      role: "QA Engineer",
      about: "Автотесты и регрессионные прогоны.",
    },
    {
      id: "it-6",
      name: "Олег Фомин",
      role: "Product Manager",
      about: "Roadmap, приоритизация, коммуникация с командами.",
    },
    {
      id: "it-7",
      name: "Дарья Власова",
      role: "UI Designer",
      about: "Дизайн-система и визуальная консистентность.",
    },
    {
      id: "it-8",
      name: "Павел Руденко",
      role: "Data Analyst",
      about: "Событийная аналитика и отчётность по воронкам.",
    },
    {
      id: "it-9",
      name: "Марина Корнеева",
      role: "Frontend Developer",
      about: "Компоненты интерфейсов и адаптивная верстка.",
    },
    {
      id: "it-10",
      name: "Георгий Виноградов",
      role: "Backend Developer",
      about: "Сервис авторизации и интеграции с внешними API.",
    },
    {
      id: "it-11",
      name: "Ирина Лапшина",
      role: "QA Engineer",
      about: "Тест-кейсы, чек-листы и контроль регрессии.",
    },
    {
      id: "it-12",
      name: "Тимур Жданов",
      role: "DevOps Engineer",
      about: "Контейнеризация и автоматизация деплоя.",
    },
    {
      id: "it-13",
      name: "Валерия Носова",
      role: "UI Designer",
      about: "Прототипы, визуальные паттерны и дизайн-система.",
    },
    {
      id: "it-14",
      name: "Пётр Чистов",
      role: "Product Analyst",
      about: "Бэклог, аналитика поведения и приоритизация задач.",
    },
    {
      id: "it-15",
      name: "Константин Ершов",
      role: "Fullstack Developer",
      about: "Фичи личного кабинета и модуль уведомлений.",
    },
    {
      id: "it-16",
      name: "Ольга Широкова",
      role: "Data Engineer",
      about: "Пайплайны данных и витрины метрик.",
    },
    {
      id: "it-17",
      name: "Назар Мельников",
      role: "Security Engineer",
      about: "Аудит прав доступа и безопасность API.",
    },
    {
      id: "it-18",
      name: "Софья Зайцева",
      role: "UX Researcher",
      about: "Пользовательские интервью и usability-тесты.",
    },
    {
      id: "it-19",
      name: "Роман Кудряшов",
      role: "Backend Developer",
      about: "Микросервисы отчётности и журналирование событий.",
    },
    {
      id: "it-20",
      name: "Алина Самойлова",
      role: "Frontend Developer",
      about: "Формы, фильтры и клиентская оптимизация.",
    },
    {
      id: "it-21",
      name: "Михаил Бондарь",
      role: "QA Automation",
      about: "Автоматизированные сценарии и smoke-прогоны.",
    },
    {
      id: "it-22",
      name: "Елена Устинова",
      role: "Scrum Master",
      about: "Процессы спринтов и синхронизация команд.",
    },
    {
      id: "it-23",
      name: "Денис Орлов",
      role: "Systems Analyst",
      about: "Требования, схемы интеграции и документация.",
    },
    {
      id: "it-24",
      name: "Артемий Силантьев",
      role: "Mobile Developer",
      about: "Мобильные сценарии и offline-first модули.",
    },
    {
      id: "it-25",
      name: "Виктория Николаева",
      role: "Product Manager",
      about: "Коммуникация со стейкхолдерами и roadmap.",
    },
  ],
  "inno-travel": [
    {
      id: "tr-1",
      name: "Алина Левина",
      role: "Руководитель направления",
      about: "Цифровые маршруты и туристические сервисы.",
      isFavorite: true,
    },
    {
      id: "tr-2",
      name: "Максим Орехов",
      role: "Travel Product Manager",
      about: "Сценарии поездок и развитие продукта.",
    },
    {
      id: "tr-3",
      name: "Ирина Бурцева",
      role: "Контент-редактор",
      about: "Карточки локаций, гиды и событийные описания.",
    },
    {
      id: "tr-4",
      name: "Арсений Климов",
      role: "Mobile Developer",
      about: "AR-навигация и офлайн-доступ к маршрутам.",
    },
    {
      id: "tr-5",
      name: "Наталья Миронова",
      role: "Партнёрский менеджер",
      about: "Интеграция с музеями, отелями и площадками.",
    },
    {
      id: "tr-6",
      name: "Глеб Пономарёв",
      role: "UX Researcher",
      about: "Полевые тесты маршрутов и исследования поведения.",
    },
  ],
  "finprocess-tech": [
    {
      id: "fp-1",
      name: "Владимир Егоров",
      role: "Куратор Finprocess",
      about: "Финансовая аналитика цифровых проектов.",
      isFavorite: true,
    },
    {
      id: "fp-2",
      name: "Оксана Филимонова",
      role: "Financial Analyst",
      about: "План-факт анализ и модель cashflow.",
    },
    {
      id: "fp-3",
      name: "Роман Голубев",
      role: "BI Engineer",
      about: "Дашборды KPI и автоматизация отчётности.",
    },
    {
      id: "fp-4",
      name: "Полина Мельник",
      role: "Risk Analyst",
      about: "Скоринг расходов и оценка финансовых рисков.",
    },
    {
      id: "fp-5",
      name: "Артём Ланцов",
      role: "Data Engineer",
      about: "Сверка транзакций и качество данных.",
    },
  ],
  "psy-tech": [
    {
      id: "ps-1",
      name: "Екатерина Логинова",
      role: "Куратор Psy Tech",
      about: "Цифровые протоколы психологической поддержки.",
      isFavorite: true,
    },
    {
      id: "ps-2",
      name: "Дмитрий Белоусов",
      role: "Psychology Researcher",
      about: "Опросные методики и психометрические шкалы.",
    },
    {
      id: "ps-3",
      name: "Лидия Серова",
      role: "UX Researcher",
      about: "Юзабилити сервисов самопомощи и онбординга.",
    },
    {
      id: "ps-4",
      name: "Владислав Пак",
      role: "Frontend Developer",
      about: "Интерфейсы дневника состояния и практик.",
    },
    {
      id: "ps-5",
      name: "Яна Рябова",
      role: "Методист",
      about: "Сценарии микро-практик и контент модулей.",
    },
    {
      id: "ps-6",
      name: "Сергей Демидов",
      role: "Data Analyst",
      about: "Агрегированные метрики благополучия по группам.",
    },
  ],
};

export function getLabPeopleBySlug(slug: string): LabPerson[] {
  return labPeopleBySlug[slug] ?? [];
}
