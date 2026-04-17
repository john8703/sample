import TodoItem from './TodoItem.jsx'
import { isOverdue } from '../App.jsx'

function EmptyState({ filter, search }) {
  const icon    = filter === 'done' ? '✅' : '📋'
  const message = search
    ? '검색 결과가 없습니다.'
    : filter === 'done'
      ? '완료된 항목이 없습니다.'
      : '할 일을 추가해 보세요!'

  return (
    <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <p style={{ fontSize: 15 }}>{message}</p>
    </div>
  )
}

export default function TodoList({ todos, filter, search, onToggle, onDelete, onEdit }) {
  if (todos.length === 0) {
    return <EmptyState filter={filter} search={search} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isOverdue={isOverdue}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
