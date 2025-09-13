from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime
# 用于接入前端CORS中间件
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Todo API", description="一个简单的 Todo API", version="1.0.0")

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 前端地址
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有 HTTP 方法
    allow_headers=["*"],  # 允许所有 HTTP 头
)

# 定义 Todo 数据结构
class TodoCreate(BaseModel):
    task: str
    completed: bool = False

class Todo(BaseModel):
    id: str
    task: str
    completed: bool
    created_at: datetime
    
# 在数据模型部分添加
class TodoUpdate(BaseModel):
    task: Optional[str] = None
    completed: Optional[bool] = None

# 用来存储 todo 的列表（暂时用内存，后面可以换成数据库）
todos_db: List[Todo] = []

@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}

@app.get("/todos", response_model=List[Todo])
def get_todos():
    """获取所有 todo"""
    return todos_db

@app.post("/todos", response_model=Todo)
def create_todo(todo: TodoCreate):
    """创建新的 todo"""
    new_todo = Todo(
        id=str(uuid.uuid4()),  # 生成唯一 ID
        task=todo.task,
        completed=todo.completed,
        created_at=datetime.now()
    )
    todos_db.append(new_todo)
    return new_todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: str):
    """删除指定的 todo"""
    global todos_db
    
    # 查找要删除的 todo
    todo_to_delete = None
    for todo in todos_db:
        if todo.id == todo_id:
            todo_to_delete = todo
            break
    
    # 如果没找到，返回 404 错误
    if not todo_to_delete:
        raise HTTPException(status_code=404, detail="Todo 未找到")
    
    # 删除 todo
    todos_db = [todo for todo in todos_db if todo.id != todo_id]
    
    return {"message": "Todo 已删除", "deleted_todo": todo_to_delete}

@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: str, todo_update: TodoUpdate):
    """更新指定的 todo"""
    
    # 查找要更新的 todo
    todo_to_update = None
    for todo in todos_db:
        if todo.id == todo_id:
            todo_to_update = todo
            break
    
    # 如果没找到，返回 404 错误
    if not todo_to_update:
        raise HTTPException(status_code=404, detail="Todo 未找到")
    
    # 更新字段（只更新提供的字段）
    if todo_update.task is not None:
        todo_to_update.task = todo_update.task
    if todo_update.completed is not None:
        todo_to_update.completed = todo_update.completed
    
    return todo_to_update

@app.patch("/todos/{todo_id}/toggle", response_model=Todo)
def toggle_todo_completion(todo_id: str):
    """切换 todo 的完成状态"""
    
    # 查找 todo
    todo_to_toggle = None
    for todo in todos_db:
        if todo.id == todo_id:
            todo_to_toggle = todo
            break
    
    # 如果没找到，返回 404 错误
    if not todo_to_toggle:
        raise HTTPException(status_code=404, detail="Todo 未找到")
    
    # 切换完成状态
    todo_to_toggle.completed = not todo_to_toggle.completed
    
    return todo_to_toggle

