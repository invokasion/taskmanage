'use client'
import { TaskType } from "@/@type/task.type"
import { useEffect, useState } from "react"
import { Icon } from "@iconify/react";

export default function Calender() {
    const [task , setTask] = useState<TaskType[]>([])
    const [originTask , setTaskOrigin] = useState<TaskType[]>([])
    const [statusFilter , setStatusFilter] = useState<'completed' | 'pending' | 'in-progress' | 'all'>('all')


    const [openForm , setOpenForm] = useState<boolean>(false)

    const [form , setForm] = useState<TaskType>({
        title: '',
        description: '',
        date: '',
        status: statusFilter ===  'all' ? 'pending' : statusFilter,
        priority: 'low',
    })

    useEffect(()=> {
        refetchTask()
    }, [])

    const refetchTask = () => {
        setTimeout(()=> {
            const _task = localStorage.getItem('task')
            const parsedTask = _task ? JSON.parse(_task) : [];
            setTask(parsedTask);
            setTaskOrigin(parsedTask);
        }, 100)
    }

    const changeStatus = (status: 'completed' | 'pending' | 'in-progress' | 'all') => {
        setStatusFilter(status)
        if(status === 'completed') {
            const _fetchTaskCompleted = originTask.filter(item => item.status === 'completed')
            setTask(_fetchTaskCompleted)
        } else if(status === 'pending') {
            const _fetchTaskPending = originTask.filter(item => item.status === 'pending')
            setTask(_fetchTaskPending)
        } else if(status === 'in-progress') {
            const _fetchTaskOnProgress = originTask.filter(item => item.status === 'in-progress')
            setTask(_fetchTaskOnProgress)
        } else {
            setTask(originTask)
        }
    }

    const status = {
        'pending': 'text-yellow-500',
        'in-progress': 'text-blue-500',
        'completed': 'text-green-500'
    }

    const priority = {
        'low': 'text-blue-500',
        'medium': 'text-yellow-500',
        'high': 'text-red-500'
    }

    const handleOpenDetail = (task : TaskType) => {
        setOpenForm(true)
        setForm(task)
    }

    const handleAddTask = () => {
        if (form.title && form.description && form.date) {
            const newTask = { ...form, id: crypto.randomUUID() };
            setTaskOrigin([...originTask, newTask]);
            localStorage.setItem('task', JSON.stringify([...originTask, newTask]));
            refetchTask()
            changeStatus(statusFilter)
            resetForm();
            setOpenForm(false);
        }
    };

    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            date: '',
            status: statusFilter ===  'all' ? 'pending' : statusFilter,
            priority: 'low',
        });
    }

    const handleUpdateTask = () => {
        const updatedTasks = originTask.map(t => t.id === form.id ? form : t);
        setTaskOrigin(updatedTasks);
        localStorage.setItem('task', JSON.stringify(updatedTasks));
        refetchTask()
        changeStatus(statusFilter)
        setOpenForm(false);
    };

    const handleDeleteTask = (id: string) => {
        if (!originTask) return;
    
        const newTasks = originTask.filter(task => task.id !== id);
        setTaskOrigin(newTasks);
    
        localStorage.setItem('task', JSON.stringify(newTasks));
    
        refetchTask();
        changeStatus(statusFilter);
    };

    return (
        <div className="p-5 h-full w-full">
            <div className="flex w-full h-full">
                <div className="w-full h-full">
                    <div className="flex justify-between h-[60px]">
                        <div className="flex gap-5  py-2">
                            <div className={`cursor-pointer ${statusFilter === 'all' ? 'text-slate-800' : ''}`} onClick={() => changeStatus('all')}>All</div>
                            <div className={`cursor-pointer ${statusFilter === 'pending' ? 'text-slate-800' : ''}`} onClick={() => changeStatus('pending')}>Pending</div>
                            <div className={`cursor-pointer ${statusFilter === 'in-progress' ? 'text-slate-800' : ''}`} onClick={() => changeStatus('in-progress')}>In Progress</div>
                            <div className={`cursor-pointer ${statusFilter === 'completed' ? 'text-slate-800' : ''}`} onClick={() => changeStatus('completed')}>Completed</div>
                        </div>
                        {
                            ((!openForm) || (openForm && form.id)) &&
                            <div>
                                <button className={`bg-slate-100 text-slate-800 px-3 py-2 rounded-lg ${openForm ? 'mr-5' : ''}`} onClick={()=> {setOpenForm(true); resetForm()}}>Add Task</button>
                            </div>
                        }
                    </div>
                    {/* task list */}
                    <div className="flex flex-wrap gap-5 h-[calc(100%-60px)] overflow-x-auto w-full">
                        {task.map((item, index) => (
                            <div 
                                onClick={() => handleOpenDetail(item)}
                                key={index} 
                                className={'w-[200px] cursor-pointer h-[200px] flex justify-between flex-col text-black p-4 rounded-lg text-[14px]' + (item.status == "completed" ? ' bg-green-100 hover:bg-green-200' : ' bg-slate-100 hover:bg-slate-200')}>
                                <div className="flex flex-col">
                                    <div className="text-[16px] font-bold line-clamp-1">{item.title}</div>
                                    <div className="line-clamp-4 text-gray-400">{item.description}</div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex gap-2">
                                        <div className={item.status === 'completed' ? 'text-green-500' : new Date(item.date) < new Date() ? 'text-red-500' : new Date(item.date).toDateString() === new Date().toDateString() ? 'text-yellow-500' : 'text-green-500'}>
                                            Deadline: {item.date}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className={priority[item.priority]}>{item.priority}</div>
                                        <div className={status[item.status]}>{item.status}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* form */}
                { openForm &&
                    <div className={`h-full border-l min-w-[400px] transition-all duration-300 ${openForm ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex justify-end gap-2">
                            {
                                form.id &&
                                <div className="cursor-pointer hover:bg-slate-950 p-2 rounded-full" onClick={() => { setOpenForm(false); resetForm(); if (form.id)handleDeleteTask(form.id)}}>
                                    <Icon icon="majesticons:delete-bin-line" width="24" height="24" className="text-white"/>
                                </div>
                            }
                            <div className="cursor-pointer hover:bg-slate-950 p-2 rounded-full" onClick={() => { setOpenForm(false); resetForm()}}>
                                <Icon icon="majesticons:close" width="24" height="24" className="text-white"/>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="text-[24px] font-bold">{form.id ? 'Edit Task' : 'Add Task'}</div>
                            <div className="mt-5">
                                <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Title" className="w-full bg-slate-100 text-black p-3 rounded-lg"/>
                            </div>
                            <div className="mt-5">
                                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Description" className="w-full bg-slate-100 text-black p-3 rounded-lg"/>
                            </div>
                            <div className="mt-5">
                                <label className="mb-5">Deadline</label>
                                <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} placeholder="Date" className="w-full bg-slate-100 text-black p-3 rounded-lg"/>
                            </div>
                            <div className="mt-5">
                                <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value as 'low' | 'medium' | 'high'})} className="w-full bg-slate-100 text-black p-3 rounded-lg">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="mt-5">
                                <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value as 'pending' | 'in-progress' | 'completed'})} className="w-full bg-slate-100 text-black p-3 rounded-lg">
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="mt-5">
                                <button onClick={form.id ? handleUpdateTask : handleAddTask} className="w-full bg-slate-900 text-white p-3 rounded-lg">
                                    {form.id ? 'Update Task' : 'Add Task'}
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}