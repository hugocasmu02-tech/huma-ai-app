'use client'

import { useEffect, useState } from 'react'
import { getRecomendations } from '@/lib/scoring'
import { CheckCircle2, Calendar, LayoutDashboard, Database, TrendingUp } from 'lucide-react'

export default function ResultsPage() {
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        const saved = localStorage.getItem('huma_results')
        if (saved) setData(JSON.parse(saved))
    }, [])

    if (!data) return null

    const { scores } = data
    const recs = getRecomendations(scores)

    return (
        <div style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem 8rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Tu Plan de Automatización Huma AI</h1>
                <p style={{ color: 'var(--accent-muted)', fontSize: '1.2rem' }}>Diagnóstico estratégico basado en tus procesos actuales.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {[
                    { label: 'Eficiencia Captación', score: scores.captacion, icon: Database },
                    { label: 'Eficiencia Agenda', score: scores.agenda, icon: LayoutDashboard },
                    { label: 'Eficiencia Retención', score: scores.retencion, icon: TrendingUp },
                ].map((item, i) => (
                    <div key={i} className="premium-card" style={{ textAlign: 'center' }}>
                        <item.icon style={{ margin: '0 auto 1rem', color: 'var(--accent-muted)' }} />
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.score}%</div>
                        <div style={{ color: 'var(--accent-muted)', fontSize: '0.9rem' }}>{item.label}</div>
                        <div className="progress-bar" style={{ marginTop: '1.5rem', height: '6px' }}>
                            <div className="progress-fill" style={{ width: `${item.score}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="premium-card" style={{ background: 'linear-gradient(135deg, #181818 0%, #121212 100%)', border: '1px solid var(--accent)' }}>
                <div style={{ display: 'inline-block', backgroundColor: 'var(--accent)', color: 'black', padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    PAQUETE PRIORITARIO
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{recs.principal.name}</h2>

                <div style={{ display: 'grid', gap: '1rem', marginBottom: '2.5rem' }}>
                    {[
                        "Reducción inmediata de tareas manuales repetitivas.",
                        "Optimización del ROI en captación de pacientes.",
                        "Implementación de flujos de trabajo inteligentes 24/7."
                    ].map((text, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle2 size={18} style={{ color: 'var(--accent)' }} />
                            <span>{text}</span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}><a
  href="https://calendly.com/humaaisolutions/30min"
  target="_blank"
  rel="noopener noreferrer"
  className="btn-primary"
  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
>
  <Calendar size={20} />
  <span>Agendar Sesión de Estrategia</span>
</a>

                    <p style={{ color: 'var(--accent-muted)', maxWidth: '300px', fontSize: '0.9rem' }}>
                        En esta llamada activaremos tu plan y configuraremos el sistema para tu clínica.
                    </p>
                </div>
            </div>

            {recs.secundario && (
                <div style={{ marginTop: '3rem', opacity: 0.8 }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Mejora secundaria recomendada:</h3>
                    <div className="premium-card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ fontSize: '1.1rem' }}>{recs.secundario.name}</h4>
                    </div>
                </div>
            )}
        </div>
    )
}
