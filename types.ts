export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}

export interface SubTask {
  id: string;
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  subTasks: SubTask[];
  createdAt: number;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum ViewState {
  DASHBOARD = 'dashboard',
  PROJECTS = 'projects',
  FOCUS = 'focus',
  BRAIN_DUMP = 'brain_dump',
  CHAT = 'chat'
}

export interface AppState {
  currentView: ViewState;
  tasks: Task[];
  projects: Project[];
  activeTaskId: string | null;
}