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
            <button onClick={() => borrarAll()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <g id="Trash">
                  <path
                    d="M38 43v2a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2v-2z"
                    style={{ fill: "#7c7d7d" }}
                  />
                  <path
                    d="M38 43v2H14a2 2 0 0 1-2-2z"
                    style={{ fill: "#919191" }}
                  />
                  <path
                    d="M42 11v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1h34a1 1 0 0 1 1 1z"
                    style={{ fill: "#7c7d7d" }}
                  />
                  <path
                    d="M42 11v1H10a2 2 0 0 1-2-2h33a1 1 0 0 1 1 1z"
                    style={{ fill: "#919191" }}
                  />
                  <path
                    d="M40 14c-2.1 30.51-1.8 26.16-2 29H10L8 14z"
                    style={{ fill: "#7c7d7d" }}
                  />
                  <path
                    d="m40 14-1.86 27H15.59a4 4 0 0 1-4-3.73L10 14z"
                    style={{ fill: "#919191" }}
                  />
                  <path
                    d="M31.94 10H9a4.94 4.94 0 0 1 1-3c1-1 0-2 2-3a3.14 3.14 0 0 1 2.15 0 2 2 0 0 0 2.37-1.2A2.32 2.32 0 0 1 19 1c6 0 2.91 4.51 7 5a9.05 9.05 0 0 1 4 1 3.42 3.42 0 0 1 1.94 3z"
                    style={{ fill: "#dad7e5" }}
                  />
                  <path
                    d="M31.23 8H12c1-1 0-2 2-3a3.14 3.14 0 0 1 2.15 0 2 2 0 0 0 2.37-1.2A2.32 2.32 0 0 1 21 2a7.59 7.59 0 0 1 1.53.13c1.2 1.31.7 3.54 3.47 3.87 1.69 0 4.28.71 5.23 2z"
                    style={{ fill: "#edebf2" }}
                  />
                  <path
                    d="M38.94 10h-7A3.42 3.42 0 0 0 30 7a9.05 9.05 0 0 0-4-1c-2.07-.25-2.3-1.53-2.8-2.73A5.94 5.94 0 0 1 28 1a3.66 3.66 0 0 1 3.35 2.13 2 2 0 0 0 2.29.87 3.29 3.29 0 0 1 2.3 0c2 1 1 2 2 3a4.94 4.94 0 0 1 1 3z"
                    style={{ fill: "#dad7e5" }}
                  />
                  <path
                    d="M38.56 8h-5C31.74 3.75 26 4.25 25.64 3.82A5.65 5.65 0 0 1 30 2a3.12 3.12 0 0 1 .54 0 5.71 5.71 0 0 1 .81 1.09 2 2 0 0 0 2.29.91 3.29 3.29 0 0 1 2.3 0c2 1 1 2 2 3a2.8 2.8 0 0 1 .62 1z"
                    style={{ fill: "#edebf2" }}
                  />
                  <path
                    d="M23 38V20a1 1 0 0 1 2 0v18a1 1 0 0 1-2 0zM30 37.94l1-18a1 1 0 0 1 2 .12l-1 18a1 1 0 0 1-2-.12zM16 38.06l-1-18a1 1 0 0 1 2-.12l1 18a1 1 0 0 1-2 .12z"
                    style={{ fill: "#747575" }}
                  />
                </g>
              </svg>
            </button>

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
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      overflowWrap: "anywhere",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggle(index)}
                    />
                    <p
                      className={item.completed ? "done" : ""}
                      style={{
                        padding:"0 1rem 0 0"
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                  <div className="container-date">
                    <p className="date">{item.date}</p>

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
