
export interface DashboardWidget {
  id: string;
  type: 'summary' | 'chart' | 'tasks' | 'calendar' | 'contacts' | 'activity';
  title: string;
  position: number;
  size: 'small' | 'medium' | 'large';
}

export interface DashboardPreference {
  userId: string;
  widgets: DashboardWidget[];
  refreshInterval: number; // in minutes
  lastRefreshed: Date;
}

export interface ActivityItem {
  id: string;
  type: 'task' | 'contact' | 'deal' | 'email' | 'event';
  title: string;
  description: string;
  timestamp: Date;
  linkedId?: string;
  linkedType?: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface TaskSummary {
  totalTasks: number;
  completedTasks: number;
  upcomingTasks: number;
  overdueTasks: number;
  completionRate: number; // percentage
}

export interface EventSummary {
  today: number;
  tomorrow: number;
  thisWeek: number;
  upcoming: number;
}

export interface ContactSummary {
  totalContacts: number;
  newContacts: number;
  activeContacts: number;
  inactiveContacts: number;
}

export interface DealSummary {
  totalValue: number;
  averageValue: number;
  totalDeals: number;
  wonDeals: number;
  lostDeals: number;
  winRate: number; // percentage
}
