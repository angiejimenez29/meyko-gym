export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0B0914] relative overflow-hidden">
      {/* Soft center glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#D6007A]/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* Contenedor central ajustado al ancho de los inputs en el diseño */}
      <div className="z-10 w-full max-w-[340px] px-2 relative -mt-10">
        {children}
      </div>
    </div>
  )
}
