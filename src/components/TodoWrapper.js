import React, { useState } from 'react'
import { TodoForm } from './TodoForm'
import { v4 as uuidv4 } from 'uuid'; //version4
import { Todo } from './Todo';
uuidv4();


export const TodoWrapper = () => {
    //hook 自动生成setTodos函数用于更新状态
    const [todos, setTodos] = useState([])

    const addTodo = todo => {
        setTodos([
            // spread operator
            ...todos, 
            {
                id: uuidv4(), 
                task: todo, 
                completed: false, 
                isEditing: false}
        ])
        console.log(todos)
    }

    // complete function to change the appearance
    const toggleComplete = id => {
      setTodos(todos.map(todo => todo.id === id ? {
        ...todo, completed: !todo.completed} : todo
      ))
    }

    // delete function to filter all the ids not meet the criteria
    const deleteTodo = id => {
      setTodos(todos.filter(todo => todo.id !== id))
    }
    //23'28s

  return (
    <div className='TodoWrapper'>
      <h1> Get things Done!</h1>
        <TodoForm addTodo={addTodo} />
        {todos.map((todo) => (
          <Todo task={todo} key={todo.id} 
          toggleComplete={toggleComplete}
          deleteTodo = {deleteTodo}/>
        ))}
        
    </div>
  )
}
