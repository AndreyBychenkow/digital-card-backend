import type { LinkKind, SkillCategory } from '../../generated/prisma/enums.js';
import { OWNER_PROFILE_SLUG } from '../../profile/profile.constants.js';

/**
 * Content of the digital card.
 *
 * This file is the single source of truth: on every start the seed makes the
 * database match it, so edit the data here and restart the app.
 * Sources: the portfolio site (decebell032rus.pythonanywhere.com) and GitHub.
 */
export interface ProfileSeedData {
  slug: string;
  name: string;
  title: string;
  description: string;
  location: string | null;
  availability: string | null;
  links: Array<{ kind: LinkKind; label: string; url: string }>;
  skills: Array<{ name: string; category: SkillCategory }>;
  experiences: Array<{
    company: string;
    position: string;
    description: string | null;
    /** First day of the start month, `YYYY-MM-DD`. */
    startDate: string;
    /** First day of the last month of work, `YYYY-MM-DD`. `null` if the job is ongoing. */
    endDate: string | null;
    achievements: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    url: string | null;
    technologies: string[];
  }>;
  educations: Array<{
    institution: string;
    degree: string;
    specialty: string | null;
    graduationYear: number;
  }>;
}

export const profileData: ProfileSeedData = {
  slug: OWNER_PROFILE_SLUG,
  name: 'Андрей Быченков',
  title: 'Python Backend-разработчик',
  description:
    'Backend-разработчик на Python. Довожу продукты от идеи до продакшена: от D4NMS в реестре ' +
    'российского ПО до desktop-автоматизации и AI-ботов. Мне интересны высоконагруженные API, ' +
    'асинхронность и всё, что связано с производительностью: профилирование, оптимизация ' +
    'запросов, кэширование. Люблю понятный код с тестами и документацией. В свободное время ' +
    'делаю pet-проекты, чтобы разбираться в новых инструментах на практике.',
  location: 'Россия',
  availability:
    'Ищу позицию Python Backend Developer (Middle), полная занятость, удалённо или офис. ' +
    'Рассматриваю релокацию и командировки.',

  links: [
    { kind: 'GITHUB', label: 'GitHub', url: 'https://github.com/AndreyBychenkow' },
    { kind: 'TELEGRAM', label: 'Telegram', url: 'https://t.me/decebell032' },
    { kind: 'EMAIL', label: 'Email', url: 'mailto:decebell032@yandex.ru' },
    { kind: 'WEBSITE', label: 'Сайт-визитка', url: 'https://decebell032rus.pythonanywhere.com' },
  ],

  skills: [
    { name: 'Python', category: 'LANGUAGES_AND_FRAMEWORKS' },
    { name: 'asyncio', category: 'LANGUAGES_AND_FRAMEWORKS' },
    { name: 'Django', category: 'LANGUAGES_AND_FRAMEWORKS' },
    { name: 'Django REST Framework', category: 'LANGUAGES_AND_FRAMEWORKS' },
    { name: 'FastAPI', category: 'LANGUAGES_AND_FRAMEWORKS' },
    { name: 'Flask', category: 'LANGUAGES_AND_FRAMEWORKS' },
    { name: 'aiohttp', category: 'LANGUAGES_AND_FRAMEWORKS' },

    { name: 'REST API', category: 'API_AND_ARCHITECTURE' },
    { name: 'OpenAPI / Swagger', category: 'API_AND_ARCHITECTURE' },
    { name: 'Microservices', category: 'API_AND_ARCHITECTURE' },

    { name: 'PostgreSQL', category: 'DATABASES_AND_QUEUES' },
    { name: 'Redis', category: 'DATABASES_AND_QUEUES' },
    { name: 'Celery', category: 'DATABASES_AND_QUEUES' },
    { name: 'MongoDB', category: 'DATABASES_AND_QUEUES' },
    { name: 'MySQL', category: 'DATABASES_AND_QUEUES' },
    { name: 'SQLite', category: 'DATABASES_AND_QUEUES' },
    { name: 'SQLAlchemy', category: 'DATABASES_AND_QUEUES' },
    { name: 'Elasticsearch', category: 'DATABASES_AND_QUEUES' },

    { name: 'Docker', category: 'DEVOPS_AND_INFRASTRUCTURE' },
    { name: 'Docker Compose', category: 'DEVOPS_AND_INFRASTRUCTURE' },
    { name: 'Kubernetes', category: 'DEVOPS_AND_INFRASTRUCTURE' },
    { name: 'GitLab CI', category: 'DEVOPS_AND_INFRASTRUCTURE' },
    { name: 'GitHub Actions', category: 'DEVOPS_AND_INFRASTRUCTURE' },
    { name: 'Nginx', category: 'DEVOPS_AND_INFRASTRUCTURE' },
    { name: 'Gunicorn', category: 'DEVOPS_AND_INFRASTRUCTURE' },
    { name: 'Linux', category: 'DEVOPS_AND_INFRASTRUCTURE' },
    { name: 'Bash', category: 'DEVOPS_AND_INFRASTRUCTURE' },
    { name: 'Git', category: 'DEVOPS_AND_INFRASTRUCTURE' },

    { name: 'Pytest', category: 'TESTING' },
    { name: 'unittest', category: 'TESTING' },
    { name: 'Mocking', category: 'TESTING' },
    { name: 'TDD', category: 'TESTING' },
  ],

  experiences: [
    {
      company: 'D4Технологии',
      position: 'Python Software Engineer',
      description: null,
      startDate: '2026-02-01',
      endDate: '2026-08-01',
      achievements: [
        'Самостоятельно разработал продукт компании — систему мониторинга сети D4NMS (подробнее в разделе «Проекты»).',
        'Разработка REST API и микросервисов на Django и FastAPI.',
        'Оптимизация SQL-запросов в PostgreSQL: анализ планов через EXPLAIN ANALYZE, индексы, устранение N+1 запросов.',
        'Рефакторинг legacy-кода с покрытием тестами (pytest).',
        'Настройка CI/CD (GitLab CI, GitHub Actions), контейнеризация (Docker, Kubernetes).',
        'Code review, работа по Scrum.',
      ],
    },
    {
      company: 'CRYPTOUCH.IO',
      position: 'Python Backend Developer',
      description: 'Коммерческий проект, социальная сеть.',
      startDate: '2025-05-01',
      endDate: '2025-10-01',
      achievements: [
        'Проектирование и реализация REST API с документацией в Swagger/OpenAPI.',
        'Участие в проектировании микросервисной архитектуры.',
        'Фоновые задачи и очереди на Celery + Redis (уведомления, лента и т. п.).',
        'Безопасность API (аутентификация, rate limiting), оптимизация производительности.',
        'Деплой через Docker и CI/CD, тесты на Pytest, code review.',
      ],
    },
  ],

  projects: [
    {
      name: 'D4NMS: система мониторинга сети',
      description:
        'Коммерческая система мониторинга сетевых устройств. Разработана полностью самостоятельно: ' +
        'бэкенд, фронтенд, тесты, дизайн, продуктовый сайт, лендинг и деплой. Мониторинг до 1000 ' +
        'устройств по Ping, SSH и SNMP в реальном времени, статусы и алерты обновляются через ' +
        'WebSocket. CLI-команды по SSH выполняются прямо из браузера, есть шаблоны для Cisco, Eltex, ' +
        'Huawei, MikroTik и Juniper. Пятиуровневая ролевая модель доступа. Программа зарегистрирована ' +
        'в Роспатенте и включена в Единый реестр российского ПО (запись №33911).',
      url: 'https://d4nms.ru/',
      technologies: ['Python', 'WebSocket', 'SSH', 'SNMP', 'RBAC', 'Pytest'],
    },
    {
      name: 'TalonBot: автозапись к врачу',
      description:
        'Desktop-приложение для Windows. Следит за порталом napriem.info (Брянск и область) и ' +
        'автоматически берёт талон, как только появляется свободное окно. Коммерческий pet-project.',
      url: 'https://github.com/AndreyBychenkow/TalonBot',
      technologies: ['Python', 'CustomTkinter'],
    },
    {
      name: 'Telegram AI-секретарь',
      description:
        'Telegram-бот на n8n Cloud. Принимает текстовые и голосовые сообщения, распознаёт речь, ' +
        'обрабатывает запрос AI-агентом, ведёт задачи в Google Sheets и создаёт встречи в Google Calendar.',
      url: 'https://github.com/AndreyBychenkow/Telegram_AI_Secretary-N8N',
      technologies: ['n8n', 'AI-агент', 'Groq LLM', 'Whisper', 'Google API', 'Telegram Bot'],
    },
    {
      name: 'Сайт-портфолио на Flask',
      description: 'Сайт-портфолио с шаблонами Jinja2, задеплоен на PythonAnywhere.',
      url: 'https://decebell032rus.pythonanywhere.com',
      technologies: ['Flask', 'Jinja2', 'HTML/CSS'],
    },
  ],

  educations: [
    {
      institution: 'Российский университет кооперации',
      degree: 'Бакалавр',
      specialty: 'Программное обеспечение вычислительной техники и автоматизированных систем',
      graduationYear: 2011,
    },
  ],
};
