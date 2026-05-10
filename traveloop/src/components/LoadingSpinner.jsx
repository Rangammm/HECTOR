import { Loader2 } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-10 min-h-[200px]">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
      <p className="text-sm font-medium text-slate-500">Querying Database...</p>
    </div>
  )
}
