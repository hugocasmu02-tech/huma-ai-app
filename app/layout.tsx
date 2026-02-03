import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Huma AI | Diagnóstico de Automatización',
  description: 'Optimiza la captación, agenda y retención de tu clínica estética.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
