import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './WeekGoals.css';
import { apiFetch } from './api.js';

// ============================================================================
// CONSTANTS & ENUMS
// ============================================================================

// Backend DayOfWeek -> frontend id
const DAYS_ENUM = {
  MONDAY: 'mon',
  TUESDAY: 'tue',
  WEDNESDAY: 'wed',
  THURSDAY: 'thu',
  FRIDAY: 'fri',
  SATURDAY: 'sat',
};

const REVERSE_DAYS_ENUM = Object.fromEntries(
  Object.entries(DAYS_ENUM).map(([k, v]) => [v, k])
);

const WEEK_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

const TASK_STATUS = {
  COMPLETED: 'COMPLETED',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING: 'PENDING',
};

// ✅ DB week.start_date của bạn là CHỦ NHẬT (ví dụ 2026-02-01)
// nên Monday phải = start_date + 1, ... Saturday = +6
const DAY_OFFSET = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const isCompleted = (status) => String(status).toUpperCase() === TASK_STATUS.COMPLETED;

const toBackendStatus = (checked, currentStatus) => {
  if (checked) return TASK_STATUS.COMPLETED;
  return currentStatus === TASK_STATUS.IN_PROGRESS ? TASK_STATUS.IN_PROGRESS : TASK_STATUS.PENDING;
};



const calculateWeekStats = (dayTasksForWeek) => {
  const all = Object.values(dayTasksForWeek).flat();
  const total = all.length;
  const completed = all.filter((x) => x.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    completed,
    total,
    inProgress: total - completed,
    percentage,
  };
};

// trả về YYYY-MM-DD (để backend LocalDate parse được)
const parseDateWithOffset = (dateString, dayId) => {
  const offset = DAY_OFFSET[dayId] ?? 0;
  const date = new Date(dateString + 'T00:00:00');
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

// hiển thị dd/MM/yyyy
const formatDMY = (isoDate) => {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T00:00:00');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const buildDaysFromWeekStart = (weekStartISO) => ([
  { id: 'mon', label: 'Monday', emoji: '🥬', date: formatDMY(parseDateWithOffset(weekStartISO, 'mon')) },
  { id: 'tue', label: 'Tuesday', emoji: '🍎', date: formatDMY(parseDateWithOffset(weekStartISO, 'tue')) },
  { id: 'wed', label: 'Wednesday', emoji: '🍋', date: formatDMY(parseDateWithOffset(weekStartISO, 'wed')) },
  { id: 'thu', label: 'Thursday', emoji: '🍊', date: formatDMY(parseDateWithOffset(weekStartISO, 'thu')) },
  { id: 'fri', label: 'Friday', emoji: '⭐', date: formatDMY(parseDateWithOffset(weekStartISO, 'fri')) },
  { id: 'sat', label: 'Saturday', emoji: '🌺', date: formatDMY(parseDateWithOffset(weekStartISO, 'sat')) },
]);

// ============================================================================
// INITIALIZATION FUNCTIONS
// ============================================================================

const initializeDayTasks = () =>
  Object.fromEntries(
    WEEK_LABELS.map((week) => [
      week,
      Object.fromEntries(Object.values(DAYS_ENUM).map((day) => [day, []])),
    ])
  );

const initializeWeekData = () =>
  Object.fromEntries(
    WEEK_LABELS.map((week) => [
      week,
      { completed: 0, inProgress: 0, total: 0, percentage: 0 },
    ])
  );

const initializeNotes = () =>
  Object.fromEntries(
    WEEK_LABELS.map((week) => [
      week,
      Object.fromEntries(Object.values(DAYS_ENUM).map((day) => [day, ''])),
    ])
  );

const initializeReflections = () =>
  Object.fromEntries(
    WEEK_LABELS.map((week) => [
      week,
      { pros: [''], cons: [''] },
    ])
  );

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useTaskManager = (dayTasks, setDayTasks, weekData, setWeekData) => {
  const handleTaskToggle = useCallback((week, dayId, taskId) => {
    setDayTasks((prev) => {
      const updated = {
        ...prev,
        [week]: {
          ...prev[week],
          [dayId]: prev[week][dayId].map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        },
      };

      const stats = calculateWeekStats(updated[week]);
      setWeekData((prevWeek) => ({
        ...prevWeek,
        [week]: stats,
      }));

      return updated;
    });
  }, [setDayTasks, setWeekData]);

  const handleTaskNameChange = useCallback((week, dayId, taskId, newName) => {
    setDayTasks((prev) => ({
      ...prev,
      [week]: {
        ...prev[week],
        [dayId]: prev[week][dayId].map((task) =>
          task.id === taskId ? { ...task, name: newName } : task
        ),
      },
    }));
  }, [setDayTasks]);

  const addTask = useCallback((week, dayId, task) => {
    setDayTasks((prev) => ({
      ...prev,
      [week]: {
        ...prev[week],
        [dayId]: [...(prev[week]?.[dayId] || []), task],
      },
    }));

    setWeekData((prev) => {
      const stats = calculateWeekStats(prev[week]);
      return {
        ...prev,
        [week]: {
          ...stats,
          total: (stats.total || 0) + 1,
          completed: stats.completed + (task.completed ? 1 : 0),
        },
      };
    });
  }, [setDayTasks, setWeekData]);

  return { handleTaskToggle, handleTaskNameChange, addTask };
};

const usePriorityManager = (priorities, setPriorities) => {
  const handleToggle = useCallback((week, priorityId) => {
    setPriorities((prev) => ({
      ...prev,
      [week]: prev[week].map((p) =>
        p.id === priorityId ? { ...p, completed: !p.completed } : p
      ),
    }));
  }, [setPriorities]);

  const handleNameChange = useCallback((week, priorityId, newName) => {
    setPriorities((prev) => ({
      ...prev,
      [week]: prev[week].map((p) =>
        p.id === priorityId ? { ...p, name: newName } : p
      ),
    }));
  }, [setPriorities]);

  return { handleToggle, handleNameChange };
};

const useReflectionManager = (reflections, setReflections) => {
  const handleChange = useCallback((week, type, idx, value) => {
    setReflections((prev) => ({
      ...prev,
      [week]: {
        ...prev[week],
        [type]: (prev[week]?.[type] || []).map((item, i) => (i === idx ? value : item)),
      },
    }));
  }, [setReflections]);

  const addItem = useCallback((week, type) => {
    setReflections((prev) => ({
      ...prev,
      [week]: {
        ...prev[week],
        [type]: [...(prev[week]?.[type] || []), ''],
      },
    }));
  }, [setReflections]);

  const deleteItem = useCallback((week, type, idx) => {
    setReflections((prev) => ({
      ...prev,
      [week]: {
        ...prev[week],
        [type]: (prev[week]?.[type] || []).filter((_, i) => i !== idx),
      },
    }));
  }, [setReflections]);

  return { handleChange, addItem, deleteItem };
};

const useWeekDataLoader = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weekIdByLabel, setWeekIdByLabel] = useState({});
  const [weekStartByLabel, setWeekStartByLabel] = useState({});

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const weeks = await apiFetch(`/api/v1/weeks?month=${month}&year=${year}`);

      const nextDayTasks = initializeDayTasks();
      const nextWeekData = initializeWeekData();
      const nextWeekIdByLabel = {};
      const nextWeekStartByLabel = {};

      for (const w of weeks) {
        const label = `Week ${w.weekNumber}`;
        if (!nextDayTasks[label]) continue;

        nextWeekIdByLabel[label] = w.id;
        nextWeekStartByLabel[label] = w.startDate;

        const tasks = await apiFetch(`/api/v1?weekNumber=${w.weekNumber}`);

        tasks.forEach((t) => {
          const dayId = DAYS_ENUM[String(t.dayOfWeek || '').toUpperCase()];
          if (!dayId) return;

          nextDayTasks[label][dayId].push({
            id: t.id,
            name: t.title,
            completed: isCompleted(t.status),
            backend: t,
          });
        });

        nextWeekData[label] = calculateWeekStats(nextDayTasks[label]);
      }

      setWeekIdByLabel(nextWeekIdByLabel);
      setWeekStartByLabel(nextWeekStartByLabel);

      return { dayTasks: nextDayTasks, weekData: nextWeekData };
    } catch (e) {
      setError(e.message || 'Failed to load data');
      return { dayTasks: initializeDayTasks(), weekData: initializeWeekData() };
    } finally {
      setLoading(false);
    }
  }, []);

  return { load, loading, error, weekIdByLabel, weekStartByLabel };
};

// ============================================================================
// COMPONENTS (yours - giữ nguyên)
// ============================================================================

const TaskItem = ({ week, dayId, task, onToggle, onNameChange, onDetailOpen }) => {
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggle(week, dayId, task.id);
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  const handleNameChange = (e) => {
    handleInputClick(e);
    onNameChange(week, dayId, task.id, e.target.value);
  };

  return (
    <li
      className="wg-task-item"
      onClick={() => onDetailOpen(dayId, task)}
      style={{ cursor: 'pointer' }}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onClick={handleCheckboxClick}
        onChange={handleCheckboxClick}
        className="wg-checkbox"
        id={`task-${week}-${dayId}-${task.id}`}
      />

      <input
        type="text"
        value={task.name}
        onClick={handleInputClick}
        onChange={handleNameChange}
        className="wg-task-input"
        style={{
          textDecoration: task.completed ? 'line-through' : 'none',
          opacity: task.completed ? 0.6 : 1,
        }}
      />
    </li>
  );
};

const DayCard = ({
  week,
  day,
  tasks,
  notes,
  onTaskToggle,
  onTaskNameChange,
  onDetailOpen,
  onAddTask,
  onNoteChange,
}) => {
  return (
    <div className="wg-day-card">
      <header className="wg-day-header">
        <span className="wg-day-emoji">{day.emoji}</span>
        <div className="wg-day-info">
          <h4 className="wg-day-name">{day.label}</h4>
          <p className="wg-day-date">{day.date}</p>
        </div>
      </header>

      <div className="wg-day-tasks">
        <ul className="wg-task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              week={week}
              dayId={day.id}
              task={task}
              onToggle={onTaskToggle}
              onNameChange={onTaskNameChange}
              onDetailOpen={onDetailOpen}
            />
          ))}
        </ul>
        <button
          type="button"
          className="wg-add-task-btn"
          onClick={() => onAddTask(day.id)}
        >
          + Add task
        </button>
      </div>

      <textarea
        className="wg-day-note"
        placeholder="Add a note..."
        value={notes}
        onChange={(e) => onNoteChange(day.id, e.target.value)}
      />
    </div>
  );
};

const Dashboard = ({ weekData }) => {
  const totalCompleted = useMemo(
    () =>
      Object.values(weekData).reduce(
        (sum, w) => sum + (w?.completed ?? 0),
        0
      ),
    [weekData]
  );

  const totalTasks = useMemo(
    () =>
      Object.values(weekData).reduce(
        (sum, w) => sum + (w?.total ?? 0),
        0
      ),
    [weekData]
  );

  const avgPercentage = useMemo(
    () =>
      Math.round(
        Object.values(weekData).reduce(
          (sum, w) => sum + (w?.percentage ?? 0),
          0
        ) / Object.keys(weekData).length
      ),
    [weekData]
  );

  return (
    <main className="wg-main">
      <section className="wg-dashboard">
        <div className="wg-dashboard-stats">
          <div className="wg-dashboard-stat">
            <span className="wg-dashboard-label">Total Completed</span>
            <span className="wg-dashboard-value">{totalCompleted}</span>
            <span className="wg-dashboard-unit">/ {totalTasks}</span>
          </div>

          <div className="wg-dashboard-stat">
            <span className="wg-dashboard-label">Average Progress</span>
            <span className="wg-dashboard-value">{avgPercentage}%</span>
          </div>
        </div>
      </section>
    </main>
  );
};

const WeekSection = ({
  week,
  weekData,
  setWeekData,
  days,
  dayTasks,
  setDayTasks,
  notes,
  setNotes,
  priorities,
  setPriorities,
  reflections,
  setReflections,
  onAddTask,
}) => {
  const navigate = useNavigate();

  const { handleTaskToggle, handleTaskNameChange } = useTaskManager(
    dayTasks,
    setDayTasks,
    weekData,
    setWeekData
  );

  const { handleToggle: handlePriorityToggle, handleNameChange: handlePriorityNameChange } =
    usePriorityManager(priorities, setPriorities);

  const { handleChange: handleReflectionChange, addItem, deleteItem } =
    useReflectionManager(reflections, setReflections);

  const handleNoteChange = useCallback(
    (dayId, value) => {
      setNotes((prev) => ({
        ...prev,
        [week]: {
          ...prev[week],
          [dayId]: value,
        },
      }));
    },
    [week, setNotes]
  );

  const openTaskDetail = useCallback(
    (dayId, task) => {
      navigate('/task/new', {
        state: {
          week,
          dayId,
          task,
          mode: 'VIEW',
        },
      });
    },
    [week, navigate]
  );

  return (
    <main className="wg-main">
      <section className="wg-calendar">
        {days.map((day) => (
          <DayCard
            key={day.id}
            week={week}
            day={day}
            tasks={dayTasks[week]?.[day.id] || []}
            notes={notes[week]?.[day.id] ?? ''}
            onTaskToggle={handleTaskToggle}
            onTaskNameChange={handleTaskNameChange}
            onDetailOpen={openTaskDetail}
            onAddTask={onAddTask}
            onNoteChange={handleNoteChange}
          />
        ))}
      </section>
    </main>
  );
};

// ... PriorityBox, ReflectionColumn, ReflectionSection, Dashboard, WeekSection giữ nguyên như bạn đang có ...
// (mình không paste lại để khỏi quá dài, bạn giữ nguyên phần đó)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WeekGoals() {
  const handledRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [currentWeek, setCurrentWeek] = useState('Week 1');
  const [dayTasks, setDayTasks] = useState(initializeDayTasks());
  const [weekData, setWeekData] = useState(initializeWeekData());
  const [notes, setNotes] = useState(initializeNotes());

  // ✅ days sẽ được build từ weekStart backend
  const [days, setDays] = useState([]);

  const [priorities, setPriorities] = useState(
    Object.fromEntries(
      WEEK_LABELS.map((week) => [
        week,
        [
          { id: 1, name: 'Mục tiêu ưu tiên 1', completed: false },
          { id: 2, name: 'Mục tiêu ưu tiên 2', completed: false },
          { id: 3, name: 'Mục tiêu ưu tiên 3', completed: false },
          { id: 4, name: 'Mục tiêu thường 1', completed: false },
        ],
      ])
    )
  );
  const [reflections, setReflections] = useState(initializeReflections());

  const { load, loading, error, weekIdByLabel, weekStartByLabel } = useWeekDataLoader();

  // ✅ Load data từ backend + set vào state của WeekGoals
  useEffect(() => {
    (async () => {
      const { dayTasks: loadedDayTasks, weekData: loadedWeekData } = await load();
      setDayTasks(loadedDayTasks);
      setWeekData(loadedWeekData);
    })();
  }, [load]);

  // ✅ build days theo currentWeek sau khi weekStartByLabel có data
  useEffect(() => {
    const weekStart = weekStartByLabel[currentWeek];
    if (!weekStart) return;
    setDays(buildDaysFromWeekStart(weekStart));
  }, [currentWeek, weekStartByLabel]);

  // Xử lý task từ location.state (khi tạo task từ form)
  useEffect(() => {
    const st = location.state;
    if (!st || st.action !== 'CREATE_TASK') return;

    if (handledRef.current) return;
    handledRef.current = true;

    const { week, dayId, task } = st.payload;

    setDayTasks((prev) => ({
      ...prev,
      [week]: {
        ...prev[week],
        [dayId]: [...(prev[week]?.[dayId] || []), task],
      },
    }));

    setWeekData((prev) => {
      const old = prev[week];
      const newTotal = (old.total ?? 0) + 1;
      const newCompleted = (old.completed ?? 0) + (task.completed ? 1 : 0);

      return {
        ...prev,
        [week]: {
          ...old,
          total: newTotal,
          completed: newCompleted,
          inProgress: newTotal - newCompleted,
          percentage: newTotal > 0 ? Math.round((newCompleted / newTotal) * 100) : 0,
        },
      };
    });

    navigate(location.pathname, { replace: true, state: null });

    setTimeout(() => {
      handledRef.current = false;
    }, 0);
  }, [location.state, navigate, location.pathname]);

  // ✅ Add Task: navigate sang TaskDetail kèm weekId/weekStart
  const handleAddTask = useCallback(
    (dayId) => {
      const weekId = weekIdByLabel[currentWeek];
      const weekStart = weekStartByLabel[currentWeek];

      if (!weekId || !weekStart) {
        alert('Chưa load được weekId/weekStart từ backend. Đợi load xong hoặc reload trang.');
        return;
      }

      navigate('/task/new', {
        state: {
          week: currentWeek,
          dayId,
          weekId,
          weekStart,
          mode: 'CREATE',
        },
      });
    },
    [currentWeek, navigate, weekIdByLabel, weekStartByLabel]
  );

  return (
    <div className="week-goals-container">
      <header className="wg-header">
        <h1 className="wg-title">Week Goals & Tasks</h1>
      </header>

      {loading && <p style={{ padding: 12 }}>Loading weeks & tasks...</p>}
      {error && <p style={{ padding: 12, color: 'red' }}>{error}</p>}

      <div className="wg-tabs">
        <button
          className={`wg-tab ${currentWeek === 'Dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentWeek('Dashboard')}
        >
          Dashboard
        </button>

        {WEEK_LABELS.map((week) => (
          <button
            key={week}
            className={`wg-tab ${currentWeek === week ? 'active' : ''}`}
            onClick={() => setCurrentWeek(week)}
          >
            {week}
          </button>
        ))}
      </div>

      {currentWeek === 'Dashboard' ? (
        <Dashboard weekData={weekData} />
      ) : (
        <WeekSection
          week={currentWeek}
          weekData={weekData}
          setWeekData={setWeekData}
          days={days}
          dayTasks={dayTasks}
          setDayTasks={setDayTasks}
          notes={notes}
          setNotes={setNotes}
          priorities={priorities}
          setPriorities={setPriorities}
          reflections={reflections}
          setReflections={setReflections}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  );
}
