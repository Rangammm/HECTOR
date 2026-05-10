import { useContext } from 'react'
import { ToastContext } from '../context/toastContextValue'

export function useToast() {
  return useContext(ToastContext)
}
