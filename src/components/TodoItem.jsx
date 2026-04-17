import { useState, useRef, useEffect, useCallback } from 'react'

const PRIORITY_LABEL = { high: '높음', medium: '보통', low: '낮음' }

const priorityBadgeStyle = {
  high:   { background: 'rgba(245,110,110,.15)', color: 'var(--danger)' },
  medium: { background: 'rgba(245,166,35,.15)',  color: 'var(--warn)' },
  low:    { background: 'rgba(92,186,133,.15)',  color: 'var(--success)' },
}

// SVG icons
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
)

function IconButton({ onClick, title, danger, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--surface2)' : 'none',
        border: 'none', borderRadius: 6,
        width: 30, height: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: hovered
          ? (danger ? 'var(--danger)' : 'var(--text)')
          : 'var(--text-muted)',
        transition: 'all .15s',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}

export default function TodoItem({ todo, isOverdue, onToggle, onDelete, onEdit }) {
  const [editing, setEditing]       = useState(false)
  const [editText, setEditText]     = useState(todo.text)
  const [itemHovered, setItemHover] = useState(false)
  const editRef = useRef(null)

  // Focus edit input when entering edit mode
  useEffect(() => {
    if (editing) editRef.current?.focus()
  }, [editing])

  const startEdit = useCallback(() => {
    setEditText(todo.text)
    setEditing(true)
  }, [todo.text])

  const commitEdit = useCallback(() => {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== todo.text) onEdit(todo.id, trimmed)
    setEditing(false)
  }, [editText, todo.id, todo.text, onEdit])

  const cancelEdit = useCallback(() => {
    setEditText(todo.text)
    setEditing(false)
  }, [todo.text])

  const handleEditKeyDown = useCallback(e => {
    if (e.key === 'Enter')  commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }, [commitEdit, cancelEdit])

  const overdue = !todo.done && isOverdue(todo.due)

  return (
    <div
      onMouseEnter={() => setItemHover(true)}
      onMouseLeave={() => setItemHover(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${itemHovered ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        transition: 'border-color .15s, opacity .15s',
        opacity: todo.done ? 0.55 : 1,
        animation: 'slideIn .15s ease',
      }}
    >
      {/* Check circle */}
      <div
        onClick={() => onToggle(todo.id)}
        style={{
          width: 20, height: 20,
          borderRadius: '50%',
          border: `2px solid ${todo.done ? 'var(--success)' : 'var(--border)'}`,
          background: todo.done ? 'var(--success)' : 'transparent',
          cursor: 'pointer',
          flexShrink: 0,
          marginTop: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .15s',
        }}
      >
        {todo.done && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2,6 5,9 10,3"/>
          </svg>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <input
            ref={editRef}
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleEditKeyDown}
            style={{
              width: '100%',
              background: 'var(--surface2)',
              border: '1px solid var(--accent)',
              borderRadius: 6,
              padding: '6px 10px',
              color: 'var(--text)',
              fontSize: 15,
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        ) : (
          <div
            style={{
              fontSize: 15, lineHeight: 1.4, wordBreak: 'break-word',
              textDecoration: todo.done ? 'line-through' : 'none',
              color: todo.done ? 'var(--text-muted)' : 'var(--text)',
            }}
          >
            {todo.text}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px',
              borderRadius: 20, letterSpacing: '.4px',
              ...priorityBadgeStyle[todo.priority],
            }}
          >
            {PRIORITY_LABEL[todo.priority]}
          </span>

          {todo.due && (
            <span style={{ fontSize: 12, color: overdue ? 'var(--danger)' : 'var(--text-muted)' }}>
              {overdue ? '⚠ ' : ''}{todo.due}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <IconButton onClick={startEdit} title="수정">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(todo.id)} title="삭제" danger>
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  )
}
