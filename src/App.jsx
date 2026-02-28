import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./App.css";

// ── Llama a Grok ────────────────────────────────────────────────────────────
async function callClaude(prompt) {
  const response = await fetch("/api/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await response.json();
  return data.text ?? "";
}
function App() {
  const [task, setTask] = useState("");
  const [error, setError] = useState(null);
  const [list, setList] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // ── Estado IA ─────────────────────────────────────────────────────────────
  const [selectedTask, setSelectedTask] = useState(null); // { index, text }
  const [formalTitle, setFormalTitle] = useState("");
  const [loadingTitle, setLoadingTitle] = useState(false);
  const [description, setDescription] = useState("");
  const [loadingDesc, setLoadingDesc] = useState(false);
  const [toast, setToast] = useState("");

  const prevLength = useRef(list.length);
  const panelRef = useRef(null);

  // ── Animación nueva tarea ─────────────────────────────────────────────────
  useEffect(() => {
    if (list.length > prevLength.current) {
      const lastTask = document.querySelector(".task-item:last-child");
      if (lastTask) {
        gsap.fromTo(
          lastTask,
          { opacity: 0, scale: 0.8, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 1, ease: "elastic" },
        );
      }
    }
    prevLength.current = list.length;
  }, [list]);

  // ── Animación panel IA ────────────────────────────────────────────────────
  useEffect(() => {
    if (selectedTask && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 16, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.4)" },
      );
    }
  }, [selectedTask]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(list));
  }, [list]);

  // ── Helpers lista ─────────────────────────────────────────────────────────
  function add() {
    if (task.trim() === "") {
      setError("Campo vacio 😅");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setTask("");
    setList([
      ...list,
      { text: task, completed: false, date: new Date().toLocaleDateString() },
    ]);
    setError(null);
  }

  function remove(index) {
    if (selectedTask?.index === index) setSelectedTask(null);
    setList(list.filter((_, i) => i !== index));
  }

  const toggle = (index) => {
    setList(
      list.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const borrarAll = () => {
    setList([]);
    setSelectedTask(null);
  };

  // ── Seleccionar tarea para IA ─────────────────────────────────────────────
  const selectForJira = (index, text) => {
    if (selectedTask?.index === index) {
      setSelectedTask(null);
      return;
    }
    setSelectedTask({ index, text });
    setFormalTitle("");
    setDescription("");
  };

  // ── IA: formalizar título ─────────────────────────────────────────────────
  const handleFormalizeTitle = async () => {
    setLoadingTitle(true);
    setFormalTitle("");
    try {
      const result = await callClaude(
        `Eres un asistente de soporte técnico de TI. Reformatea el siguiente título de tarea para que quede formal y profesional, apto para un ticket de Jira.
Responde SOLO con el título reformateado, sin explicaciones, sin comillas, sin punto al final.
Primera letra mayúscula, resto minúsculas. Máximo 8 palabras.

Título original: "${selectedTask.text}"`,
      );
      setFormalTitle(result);
    } catch {
      setFormalTitle("Error al conectar con la IA.");
    }
    setLoadingTitle(false);
  };

  // ── IA: generar descripción ───────────────────────────────────────────────
  const handleGenerateDesc = async () => {
    const titleToUse = formalTitle || selectedTask.text;
    setLoadingDesc(true);
    setDescription("");
    try {
      const result = await callClaude(
        `Eres un técnico de soporte de TI. Genera una descripción formal y profesional para un ticket de Jira basándote en el siguiente título.
La descripción debe:
- Estar en tercera persona
- Describir brevemente el problema o actividad realizada
- Mencionar el impacto o resolución si aplica
- Tener entre 2 y 4 oraciones
- Ser concisa y profesional

Responde SOLO con la descripción, sin títulos ni encabezados.

Título: "${titleToUse}"`,
      );
      setDescription(result);
    } catch {
      setDescription("Error al conectar con la IA.");
    }
    setLoadingDesc(false);
  };

  // ── Copiar al portapapeles ────────────────────────────────────────────────
  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    setToast(`${label} copiado ✓`);
    setTimeout(() => setToast(""), 2500);
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

          {/* Formulario */}
          <div className="cont-form">
            <button onClick={borrarAll}>
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

          {/* Lista de tareas */}
          <div className="cont-tasks">
            <ul>
              {list.map((item, index) => (
                <li
                  className={`task-item ${selectedTask?.index === index ? "task-selected" : ""}`}
                  key={index}
                  onClick={() => toggle(index)}
                >
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
                      style={{ padding: "0 1rem 0 0" }}
                    >
                      {item.text}
                    </p>
                  </div>
                  <div className="container-date">
                    <p className="date">{item.date}</p>

                    {/* Botón Jira IA */}
                    <button
                      className="btn-jira"
                      title="Generar ticket Jira"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectForJira(index, item.text);
                      }}
                    >
                      J
                    </button>

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

          {/* ── Panel IA ── */}
          {selectedTask && (
            <div className="ai-panel" ref={panelRef}>
              <div className="ai-panel-header">
                <span className="ai-icon">✦</span>
                <span>Generar ticket Jira</span>
                <button
                  className="ai-close"
                  onClick={() => setSelectedTask(null)}
                >
                  ✕
                </button>
              </div>

              <div className="ai-panel-body">
                {/* Tarea original */}
                <div className="ai-field">
                  <label className="ai-label">Tarea original</label>
                  <div className="ai-original">{selectedTask.text}</div>
                </div>

                {/* Título formal */}
                <div className="ai-field">
                  <label className="ai-label">Título formal</label>
                  <button
                    className="ai-btn"
                    onClick={handleFormalizeTitle}
                    disabled={loadingTitle}
                  >
                    {loadingTitle ? (
                      <>
                        <span className="ai-spinner" /> Formalizando...
                      </>
                    ) : (
                      "✦ Formalizar título"
                    )}
                  </button>
                  {formalTitle && (
                    <div className="ai-result">
                      <p>{formalTitle}</p>
                      <div className="ai-result-actions">
                        <button
                          className="ai-mini-btn"
                          onClick={handleFormalizeTitle}
                        >
                          ↺
                        </button>
                        <button
                          className="ai-mini-btn"
                          onClick={() => copy(formalTitle, "Título")}
                        >
                          ⎘ Copiar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <div className="ai-field">
                  <label className="ai-label">
                    Descripción
                    {!formalTitle && (
                      <span className="ai-hint">
                        {" "}
                        (formaliza el título primero para mejor resultado)
                      </span>
                    )}
                  </label>
                  <button
                    className="ai-btn"
                    onClick={handleGenerateDesc}
                    disabled={loadingDesc}
                  >
                    {loadingDesc ? (
                      <>
                        <span className="ai-spinner" /> Generando...
                      </>
                    ) : (
                      "✦ Generar descripción"
                    )}
                  </button>
                  {description && (
                    <div className="ai-result ai-result-desc">
                      <p>{description}</p>
                      <div className="ai-result-actions">
                        <button
                          className="ai-mini-btn"
                          onClick={handleGenerateDesc}
                        >
                          ↺
                        </button>
                        <button
                          className="ai-mini-btn"
                          onClick={() => copy(description, "Descripción")}
                        >
                          ⎘ Copiar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
