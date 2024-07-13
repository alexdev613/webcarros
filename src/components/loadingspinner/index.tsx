export function LoadingSpinner() {
  return (
    <div className="h-full w-full flex justify-center items-center bg-gray-200">
      <div className="h-14 w-14 border-4 border-gray-400 border-t-red-500 rounded-full animate-loading"></div>
    </div>
  )
}