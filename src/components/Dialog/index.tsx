import { PropsWithChildren, useCallback } from 'react'

export function Dialog({
  id,
  children,
  className = 'max-w-3xl',
  onOpen,
}: PropsWithChildren<{ id: string; className?: string; onOpen?: () => void }>) {
  const handleToggle = useCallback(
    (e: React.ToggleEvent<HTMLDialogElement>) => {
      if (e.newState === 'open') {
        onOpen?.()
      }
    },
    [onOpen]
  )

  return (
    <dialog id={id} className="modal" onToggle={handleToggle}>
      <div className={`modal-box w-full ${className}`}>
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>{children}</div>
      </div>
    </dialog>
  )
}

export function openDialog(id: string) {
  return (document.getElementById(id) as HTMLDialogElement)?.showModal()
}

export function closeDialog(id: string) {
  return (document.getElementById(id) as HTMLDialogElement)?.close()
}
