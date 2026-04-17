import { useState, useRef, useCallback } from 'react'

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 16,
    marginBottom: 20,
  },
  row: { display: 'flex', gap: 8 },
  textInput: {
    flex: 1,
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 14px',
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color .15s',
    fontFamily: 'inherit',
  },
  addBtn: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background .15s',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  },
  meta: { display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' },
  select: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '6px 10px',
    color: 'var(--text)',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  dateInput: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '6px 10px',
    color: 'var(--text)',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}

export default function TodoInput({ onAdd }) {
  const [text, setText]         = useState('')
  const [priority, setPriority] = useState('medium')
  const [due, setDue]           = useState('')
  const [btnHover, setBtnHover] = useState(false)
  const [inputFocus, setInputFocus] = useState(false)
  const inputRef = useRef(null)

  const handleAdd = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd({ text: trimmed, priority, due })
    setText('')
    setDue('')
    setPriority('medium')
    inputRef.current?.focus()
  }, [text, priority, due, onAdd])

  const handleKeyDown = useCallback(e => {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') { setText(''); inputRef.current?.blur() }
  }, [handleAdd])

  return (
    <div style={styles.card}>
      <div style={styles.row}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          placeholder="할 일을 입력하세요... (Enter로 추가, Esc로 취소)"
          style={{
            ...styles.textInput,
            borderColor: inputFocus ? 'var(--accent)' : 'var(--border)',
          }}
        />
        <button
          onClick={handleAdd}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            ...styles.addBtn,
            background: btnHover ? 'var(--accent-hover)' : 'var(--accent)',
          }}
        >
          추가
        </button>
      </div>
      <div style={styles.meta}>
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          style={styles.select}
        >
          <option value="medium">보통 우선순위</option>
          <option value="high">높은 우선순위</option>
          <option value="low">낮은 우선순위</option>
        </select>
        <input
          type="date"
          value={due}
          onChange={e => setDue(e.target.value)}
          style={styles.dateInput}
        />
      </div>
    </div>
  )
}
