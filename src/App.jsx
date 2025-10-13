import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [error, setError] = useState(null);
  const [list, setList] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(list));
  }, [list]);

  function add() {
    if (task.trim() === "") {
      setError("Campo vacio 😅");
      setTimeout(() => setError(null), 3000);
      return;
    }
    console.log(task);
    setTask("");
    setList([
      ...list,
      { text: task, completed: false, date: new Date().toLocaleDateString() },
    ]);
    setError(null);
  }

  function remove(index) {
    setList(list.filter((_, i) => i !== index));
  }

  const toggle = (index) => {
    setList(
      list.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const borrarAll = () => {
    setList([]);
  };

  return (
    <>
      <div className={`error ${error ? "" : "hidden"}`}>
        <span>{error}</span>
      </div>
      <div className="container">
        <span className="clip-top"></span>

        <div className="sheet">
          <span className="clip-pin"></span>
          <span className="clip-pin"></span>
          <span className="clip-pin"></span>
          <span className="clip-pin"></span>

          <div className="cont-form">
            <button onClick={() => borrarAll()}>🗑️</button>

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
                  <div>
                    <span className="date">{item.date}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(index);
                      }}
                    >
                      x
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
