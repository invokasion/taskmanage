export type TaskType = {
    id?: string,
    title: string,
    description: string,
    date: string,
    status: 'pending' | 'in-progress' | 'completed',
    priority: 'low' | 'medium' | 'high',
}