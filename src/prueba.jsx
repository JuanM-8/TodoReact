import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const listRef = useRef(null);

  const addTask = () => {
    const newTask = { id: Date.now(), text: `Tarea ${tasks.length + 1}` };
    setTasks([...tasks, newTask]);
  };

  useEffect(() => {
    if (tasks.length > 0) {
      const lastItem = listRef.current.lastElementChild;
      gsap.fromTo(
        lastItem,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [tasks]);

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">To-Do List</h2>
      <button
        onClick={addTask}
        className="px-4 py-2 mb-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Agregar tarea
      </button>
      <ul ref={listRef} className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-2 bg-gray-100 rounded shadow-sm">
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
