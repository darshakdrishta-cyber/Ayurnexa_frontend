import { useEffect, useRef, useState } from 'react'
import { getErrorLog, clearErrorLog } from '../../utils/errorLog'
import { X } from 'lucide-react'

export function ErrorLogModal({ open, onClose }) {
  const [logs, setLogs] = useState(getErrorLog())
  const logsRef = useRef(logs)

  useEffect(() => {
    const refresh = () => {
      const next = getErrorLog()
      logsRef.current = next
      setLogs(next)
    }
    window.addEventListener('ayurnexa:error-log', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('ayurnexa:error-log', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  useEffect(() => {
    if (open) {
      const next = getErrorLog()
      logsRef.current = next
      setLogs(next)
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Error log</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { clearErrorLog(); logsRef.current = []; setLogs([]) }}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="max-h-[60vh] overflow-auto p-4">
          {logs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No errors recorded.</p>
          ) : (
            <div className="space-y-3">
              {logs.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-border bg-background p-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{new Date(entry.time).toLocaleString()}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 font-semibold">{entry.method}</span>
                    {entry.status ? (
                      <span className="rounded-full bg-destructive-50 px-2 py-0.5 font-semibold text-destructive">
                        {entry.status}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 break-all text-sm font-medium text-foreground">{entry.url}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{entry.message}</p>
                  {entry.data ? (
                    <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-muted p-2 text-xs text-foreground">
                      {typeof entry.data === 'string' ? entry.data : JSON.stringify(entry.data)}
                    </pre>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
