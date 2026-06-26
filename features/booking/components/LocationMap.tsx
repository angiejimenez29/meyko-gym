import MapWrapper from '@/components/MapWrapper'

export function LocationMap() {
  return (
    <div className="w-full h-[300px] bg-container rounded-2xl border border-foreground/5 shadow-lg relative overflow-hidden mt-4 z-0">
      <MapWrapper />
    </div>
  )
}
