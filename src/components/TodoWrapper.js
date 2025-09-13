// components/TodoWrapper.js
import React, { useState, useEffect } from 'react'
import { TodoForm } from './TodoForm'
import { Todo } from './Todo'
import { EditTodoForm } from './EditTodoForm'
import todoApiService from '../services/todoAPI'

export const TodoWrapper = () => {
    const [todos, setTodos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // 组件挂载时加载所有待办事项
    useEffect(() => {
        loadTodos()
    }, [])

    const loadTodos = async () => {
        try {
            setLoading(true)
            setError(null)
            const todosData = await todoApiService.getTodos()
            // 添加前端需要的 isEditing 状态
            const todosWithEditState = todosData.map(todo => ({
                ...todo,
                isEditing: false
            }))
            setTodos(todosWithEditState)
        } catch (error) {
            setError('加载待办事项失败: ' + error.message)
            console.error('Error loading todos:', error)
        } finally {
            setLoading(false)
        }
    }

    const addTodo = async (task) => {
        if (!task.trim()) {
            setError('任务内容不能为空')
            return
        }

        try {
            setError(null)
            const newTodo = await todoApiService.createTodo(task)
            setTodos(prev => [...prev, { ...newTodo, isEditing: false }])
        } catch (error) {
            setError('添加待办事项失败: ' + error.message)
            console.error('Error adding todo:', error)
        }
    }

    const toggleComplete = async (id) => {
        try {
            setError(null)
            const updatedTodo = await todoApiService.toggleTodo(id)
            setTodos(prev => prev.map(todo => 
                todo.id === id ? { ...updatedTodo, isEditing: todo.isEditing } : todo
            ))
        } catch (error) {
            setError('更新待办事项失败: ' + error.message)
            console.error('Error toggling todo:', error)
        }
    }

    const deleteTodo = async (id) => {
        if (!window.confirm('确定要删除这个待办事项吗？')) {
            return
        }

        try {
            setError(null)
            await todoApiService.deleteTodo(id)
            setTodos(prev => prev.filter(todo => todo.id !== id))
        } catch (error) {
            setError('删除待办事项失败: ' + error.message)
            console.error('Error deleting todo:', error)
        }
    }

    const editTodo = (id) => {
        setTodos(prev => prev.map(todo => 
            todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
        ))
    }

    const editTask = async (newTask, id) => {
        if (!newTask.trim()) {
            setError('任务内容不能为空')
            return
        }

        try {
            setError(null)
            const updatedTodo = await todoApiService.updateTodo(id, { task: newTask })
            setTodos(prev => prev.map(todo => 
                todo.id === id ? { ...updatedTodo, isEditing: false } : todo
            ))
        } catch (error) {
            setError('更新待办事项失败: ' + error.message)
            console.error('Error updating todo:', error)
        }
    }

    if (loading) {
        return (
            <div className='TodoWrapper'>
                <h1>Get things Done!</h1>
                <p style={{color: 'white', textAlign: 'center'}}>加载中...</p>
            </div>
        )
    }

    return (
        <div className='TodoWrapper'>
            <h1>Get things Done!</h1>
            
            {error && (
                <div style={{
                    color: '#ff6b6b',
                    background: 'rgba(255, 107, 107, 0.1)',
                    padding: '10px',
                    borderRadius: '5px',
                    margin: '10px 0',
                    textAlign: 'center'
                }}>
                    {error}
                    <button 
                        onClick={() => setError(null)}
                        style={{
                            marginLeft: '10px',
                            background: 'transparent',
                            border: '1px solid #ff6b6b',
                            color: '#ff6b6b',
                            padding: '2px 8px',
                            borderRadius: '3px',
                            cursor: 'pointer'
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            <TodoForm addTodo={addTodo} />
            
            {todos.length === 0 && !loading ? (
                <p style={{color: 'white', textAlign: 'center', marginTop: '20px'}}>
                    Everything works out in my favor
                </p>
            ) : (
                todos.map((todo) => (
                    todo.isEditing ? (
                        <EditTodoForm 
                            key={todo.id}
                            editTodo={editTask} 
                            task={todo}
                        />
                    ) : (
                        <Todo 
                            key={todo.id}
                            task={todo}
                            toggleComplete={toggleComplete}
                            deleteTodo={deleteTodo}
                            editTodo={editTodo}
                        />
                    )
                ))
            )}
        </div>
    )
}