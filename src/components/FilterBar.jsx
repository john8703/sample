import { useState } from 'react'

const FILTERS = [
  { key: 'all',    label: '전체' },
  { key: 'active', label: '진행중' },
  { key: 'done',   label: '완료' },
]

const styles = {
  toolbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12, flexWrap: 'wrap', gap: 10,
  },
  filters: {
    display: 'flex', gap: 4,
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 8, padding: 4,
  },
  stats: { fontSize: 13, color: 'var(--text-muted)' },
  statsAccent: { color: 'var(--accent)', fontWeight: 600 },
  searchWrap: { marginBottom: 12 },
  searchInput: {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '9px 14px 9px 36px',
    color: 'var(--text)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color .15s',
    fontFamily: 'inherit',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237a7a96' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '12px center',
  },
  sortRow: { display: 'flex', justifyContent: 'flex-end', marginBottom: 10 },
  sortSelect: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 6, padding: '6px 10px',
    color: 'var(--text-muted)', fontSize: 13,
    outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
  },
}

function FilterButton({ label, active, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: active ? 'var(--accent)' : hovered ? 'var(--surface2)' : 'none',
        border: 'none', borderRadius: 6,
        padding: '6px 14px',
        color: active ? '#fff' : hovered ? 'var(--text)' : 'var(--text-muted)',
        fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .15s',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  )
}

export default function FilterBar({
  filter, onFilter,
  search, onSearch,
  sort, onSort,
  doneCount, totalCount,
}) {
  const [searchFocus, setSearchFocus] = useState(false)

  return (
    <>
      <div style={styles.toolbar}>
        <div style={styles.filters}>
          {FILTERS.map(f => (
            <FilterButton
              key={f.key}
              label={f.label}
              active={filter === f.key}
              onClick={() => onFilter(f.key)}
            />
          ))}
        </div>
        <div style={styles.stats}>
          완료 <span style={styles.statsAccent}>{doneCount}</span>
          {' / '}
          <span style={styles.statsAccent}>{totalCount}</span>
        </div>
      </div>

      <div style={styles.searchWrap}>
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          placeholder="검색..."
          style={{
            ...styles.searchInput,
            borderColor: searchFocus ? 'var(--accent)' : 'var(--border)',
          }}
        />
      </div>

      <div style={styles.sortRow}>
        <select value={sort} onChange={e => onSort(e.target.value)} style={styles.sortSelect}>
          <option value="created">최신순</option>
          <option value="priority">우선순위순</option>
          <option value="due">마감일순</option>
          <option value="alpha">이름순</option>
        </select>
      </div>
    </>
  )
}
