import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [list, setList] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(list));
  }, [list]);

  function add() {
    if (task.trim() === "") {
      alert("Está vacío 😅");
      return;
    }
    console.log(task);
    setTask("");
    setList([...list, { text: task, completed: false }]);
  }

  function remove(index) {
    setList(list.filter((_, i) => i !== index));
  }

  const toggle = (index) => {
    console.log("Sas");
    setList(
      list.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const borrarAll = ()=>{
    setList([])
  }

  return (
    <div className="container">
      <span className="clip-top"></span>

      <div className="sheet">
        <span className="clip-pin"></span>
        <span className="clip-pin"></span>
        <span className="clip-pin"></span>
        <span className="clip-pin"></span>

        <div className="cont-form">
          <button onClick={()=>borrarAll()}>🗑️</button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              add();
            }}
          >
            <input
              type="text"
              placeholder="Escribe tu tarea aquí"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <button>✔️</button>
          </form>
        </div>

        <div className="cont-tasks">
          <ul>
            {list.map((item, index) => (
              <li key={index} onClick={() => toggle(index)}>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggle(index)}
                  />
                  <span className={item.completed ? "done" : ""}>
                    {item.text}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(index);
                  }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
