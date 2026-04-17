import { useReducer, useState, useEffect, useCallback, useMemo } from 'react'
import TodoInput from './components/TodoInput.jsx'
import FilterBar from './components/FilterBar.jsx'
import TodoList from './components/TodoList.jsx'

// ─── Constants ────────────────────────────────────────────────────────────────
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }
const STORAGE_KEY = 'todos-react'

// ─── Reducer ──────────────────────────────────────────────────────────────────
function todosReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [
        {
          id: Date.now(),
          text: action.text,
          done: false,
          priority: action.priority,
          due: action.due,
          created: Date.now(),
        },
        ...state,
      ]
    case 'TOGGLE':
      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t)
    case 'DELETE':
      return state.filter(t => t.id !== action.id)
    case 'EDIT':
      return state.map(t => t.id === action.id ? { ...t, text: action.text } : t)
    case 'CLEAR_DONE':
      return state.filter(t => !t.done)
    default:
      return state
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function isOverdue(due) {
  if (!due) return false
  return new Date(due) < new Date(new Date().toDateString())
}

function getDateLabel() {
  return new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })
}

function loadTodos() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [todos, dispatch] = useReducer(todosReducer, undefined, loadTodos)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort]     = useState('created')

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const handleAdd    = useCallback(({ text, priority, due }) => dispatch({ type: 'ADD', text, priority, due }), [])
  const handleToggle = useCallback(id => dispatch({ type: 'TOGGLE', id }), [])
  const handleDelete = useCallback(id => dispatch({ type: 'DELETE', id }), [])
  const handleEdit   = useCallback((id, text) => dispatch({ type: 'EDIT', id, text }), [])
  const handleClear  = useCallback(() => dispatch({ type: 'CLEAR_DONE' }), [])

  // Filtered + sorted list
  const visibleTodos = useMemo(() => {
    const q = search.toLowerCase()
    const filtered = todos.filter(t => {
      if (filter === 'active' && t.done) return false
      if (filter === 'done'   && !t.done) return false
      if (q && !t.text.toLowerCase().includes(q)) return false
      return true
    })
    return [...filtered].sort((a, b) => {
      if (sort === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (sort === 'due') {
        if (!a.due && !b.due) return 0
        if (!a.due) return 1
        if (!b.due) return -1
        return new Date(a.due) - new Date(b.due)
      }
      if (sort === 'alpha') return a.text.localeCompare(b.text, 'ko')
      return b.created - a.created
    })
  }, [todos, filter, search, sort])

  const doneCount  = useMemo(() => todos.filter(t => t.done).length, [todos])

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4 }}>
        Todo
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>
        {getDateLabel()}
      </p>

      <TodoInput onAdd={handleAdd} />

      <FilterBar
        filter={filter}
        onFilter={setFilter}
        search={search}
        onSearch={setSearch}
        sort={sort}
        onSort={setSort}
        doneCount={doneCount}
        totalCount={todos.length}
      />

      <TodoList
        todos={visibleTodos}
        filter={filter}
        search={search}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
        <ClearButton onClick={handleClear} />
      </div>
    </div>
  )
}

function ClearButton({ onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none', border: 'none',
        color: hovered ? 'var(--danger)' : 'var(--text-muted)',
        fontSize: 13, cursor: 'pointer', padding: '6px 0', transition: 'color .15s',
      }}
    >
      완료 항목 삭제
    </button>
  )
}
