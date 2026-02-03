'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="landing-container">
            <nav style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>HUMA AI</div>
                <div style={{ color: 'var(--accent-muted)' }}>Automatización para Clínicas Estéticas</div>
            </nav>

            <section style={{ maxWidth: '800px', margin: '8rem auto', textAlign: 'center', padding: '0 2rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                    Descubre el potencial de facturación oculto en tu clínica.
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--accent-muted)', marginBottom: '3rem' }}>
                    Un diagnóstico de 3 minutos para identificar fugas en tu captación, agenda y retención de pacientes.
                </p>

                <Link href="/diagnostico" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                    Empezar Diagnóstico Gratuito <ArrowRight size={20} />
                </Link>
            </section>

            <section style={{ maxWidth: '1000px', margin: '0 auto 8rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', padding: '0 2rem' }}>
                {[
                    { title: "Captación", desc: "Optimiza la entrada de leads y la velocidad de respuesta." },
                    { title: "Agenda", desc: "Reduce el No-Show y elimina la gestión manual de citas." },
                    { title: "Retención", desc: "Aumenta el LTV con seguimientos y reactivación automática." }
                ].map((item, i) => (
                    <div key={i} className="premium-card" style={{ padding: '1.5rem' }}>
                        <CheckCircle2 style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
                        <p style={{ color: 'var(--accent-muted)', fontSize: '0.95rem' }}>{item.desc}</p>
                    </div>
                ))}
            </section>

            <style jsx>{`
        .landing-container {
          min-height: 100vh;
          background: radial-gradient(circle at top center, #1a1a1a 0%, #0a0a0a 100%);
        }
      `}</style>
        </div>
    )
}
