import { useState, useEffect } from 'react'
import { getErrorLog, clearErrorLog } from '../utils/errorLog'

export default function ErrorLogPage() {
  const [logs, setLogs] = useState(getErrorLog())

  useEffect(() => {
    const refresh = () => setLogs(getErrorLog())
    window.addEventListener('ayurnexa:error-log', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('ayurnexa:error-log', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Error log</h1>
          <p className="mt-1 text-sm text-muted-foreground">Recorded API and network errors.</p>
        </div>
        <button
          onClick={clearErrorLog}
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          Clear
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          No errors recorded.
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{new Date(entry.time).toLocaleString()}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 font-semibold">{entry.method}</span>
                {entry.status ? (
                  <span className="rounded-full bg-destructive-50 px-2 py-0.5 font-semibold text-destructive">
                    {entry.status}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 break-all text-sm font-medium text-foreground">{entry.url}</p>
              <p className="mt-1 text-sm text-muted-foreground">{entry.message}</p>
              {entry.data ? (
                <pre className="mt-2 max-h-40 overflow-auto rounded-xl bg-muted p-3 text-xs text-foreground">
                  {typeof entry.data === 'string' ? entry.data : JSON.stringify(entry.data, null, 2)}
                </pre>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
