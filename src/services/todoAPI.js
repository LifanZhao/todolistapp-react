// src/services/todoApi.js
const API_BASE_URL = 'http://localhost:8000';

class TodoApiService {
    // 获取所有待办事项
    async getTodos() {
        try {
            const response = await fetch(`${API_BASE_URL}/todos`);
            if (!response.ok) {
                throw new Error('获取待办事项失败');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    }

    // 创建新的待办事项
    async createTodo(task) {
        try {
            const response = await fetch(`${API_BASE_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: task,
                    completed: false
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || '创建待办事项失败');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    }

    // 更新待办事项
    async updateTodo(id, updates) {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || '更新待办事项失败');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    }

    // 切换完成状态
    async toggleTodo(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
                method: 'PATCH'
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || '切换状态失败');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error toggling todo:', error);
            throw error;
        }
    }

    // 删除待办事项
    async deleteTodo(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || '删除待办事项失败');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    }
}

// 创建单例实例
const todoApiService = new TodoApiService();
export default todoApiService;