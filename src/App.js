import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  // Load from API (fake for now, we will connect real API later)
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), text, done: false }]);
    setText("");
  };

  const toggle = (id) => {
    setTodos(todos.map(t => t.id === id? {...t, done:!t.done } : t));
  };

  const remove = (id) => {
    setTodos(todos.filter(t => t.id!== id));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>53 - React Todo API</h2>
        <div style={{display:'flex', gap:'10px'}}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter todo"
            style={{padding:'10px', borderRadius:'5px', border:'none', width:'250px'}}
          />
          <button onClick={addTodo} style={{padding:'10px 20px', borderRadius:'5px', cursor:'pointer'}}>Add</button>
        </div>

        <ul style={{listStyle:'none', padding:0, marginTop:'20px', width:'350px'}}>
          {todos.map(todo => (
            <li key={todo.id} style={{background:'#282c34', margin:'10px 0', padding:'10px', borderRadius:'5px', display:'flex', justifyContent:'space-between', border:'1px solid #61dafb'}}>
              <span onClick={() => toggle(todo.id)} style={{textDecoration: todo.done? 'line-through' : 'none', cursor:'pointer'}}>
                {todo.text}
              </span>
              <button onClick={() => remove(todo.id)} style={{background:'red', border:'none', color:'white', borderRadius:'3px', cursor:'pointer'}}>X</button>
            </li>
          ))}
        </ul>
        <p style={{fontSize:'14px', marginTop:'20px'}}>Total: {todos.length} | Done: {todos.filter(t=>t.done).length}</p>
      </header>
    </div>
  );
}

export default App;