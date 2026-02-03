'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { calculateScores } from '@/lib/scoring'

const QUESTIONS = [
    // Bloque: Captación
    {
        id: 'canalEntrada',
        label: '¿Cómo recibes habitualmente las solicitudes de nuevos pacientes?',
        type: 'select',
        options: ['WhatsApp', 'Instagram/RRSS', 'Formulario Web', 'Llamada Telefónica'],
        category: 'Captación'
    },
    {
        id: 'tiempoRespuesta',
        label: '¿Cuánto tiempo tarda vuestro equipo en dar la primera respuesta a un lead?',
        type: 'radio',
        options: ['<5 min', '<1h', '<24h', '>24h'],
        category: 'Captación'
    },
    {
        id: 'convActual',
        label: '¿Qué porcentaje de leads se convierten efectivamente en una cita agendada?',
        type: 'number',
        placeholder: 'Ej: 25',
        suffix: '%',
        category: 'Captación'
    },
    {
        id: 'cualificacionPrevia',
        label: '¿Realizáis alguna cualificación automática antes de pasar el lead a recepción?',
        type: 'boolean',
        category: 'Captación'
    },
    // Bloque: Agenda
    {
        id: 'recordatorios',
        label: '¿Utilizáis recordatorios automatizados por WhatsApp/SMS para las citas?',
        type: 'boolean',
        category: 'Agenda'
    },
    {
        id: 'noshowRate',
        label: '¿Cuál es vuestro porcentaje estimado de No-Show (pacientes que no aparecen)?',
        type: 'number',
        placeholder: 'Ej: 15',
        suffix: '%',
        category: 'Agenda'
    },
    {
        id: 'listaEspera',
        label: '¿Tenéis un sistema activo para cubrir huecos de última hora (lista de espera)?',
        type: 'boolean',
        category: 'Agenda'
    },
    {
        id: 'tiempoConfirmacion',
        label: '¿Cuánto tiempo al día dedica vuestro equipo a confirmar citas manualmente?',
        type: 'radio',
        options: ['<1h', '1-3h', '>3h'],
        category: 'Agenda'
    },
    // Bloque: Retención
    {
        id: 'seguimientoPost',
        label: '¿Tenéis un protocolo automatizado de seguimiento post-tratamiento?',
        type: 'boolean',
        category: 'Retención'
    },
    {
        id: 'porcentajeRecurrencia',
        label: '¿Qué porcentaje de vuestros pacientes repiten un tratamiento?',
        type: 'number',
        placeholder: 'Ej: 40',
        suffix: '%',
        category: 'Retención'
    },
    {
        id: 'reactivacionInactivos',
        label: '¿Impactáis a pacientes inactivos (>6 meses) con campañas de reactivación?',
        type: 'boolean',
        category: 'Retención'
    },
    {
        id: 'canalComunicacion',
        label: '¿En qué canal soléis comunicar vuestras novedades y promociones?',
        type: 'select',
        options: ['WhatsApp', 'Email marketing', 'Redes Sociales', 'Ninguno'],
        category: 'Retención'
    }
]

export default function DiagnosisForm() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<any>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const currentQ = QUESTIONS[step]
    const progress = ((step + 1) / QUESTIONS.length) * 100

    const handleNext = () => {
        if (step < QUESTIONS.length - 1) {
            setStep(step + 1)
        } else {
            submitForm()
        }
    }

    const submitForm = async () => {
        setIsSubmitting(true)
        // Simulating processing for polish
        await new Promise(r => setTimeout(r, 2000))

        // In a real app, save to Supabase here
        const scores = calculateScores(answers)
        localStorage.setItem('huma_results', JSON.stringify({ answers, scores }))

        router.push('/resultados')
    }

    const updateAnswer = (val: any) => {
        setAnswers({ ...answers, [currentQ.id]: val })
    }

    if (isSubmitting) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={48} style={{ marginBottom: '1.5rem', color: 'var(--accent)' }} />
                <h2 style={{ fontSize: '1.5rem' }}>Analizando datos de la clínica...</h2>
                <p style={{ color: 'var(--accent-muted)' }}>Calculando potencial de optimización</p>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--accent-muted)', marginBottom: '0.5rem' }}>
                    <span>{currentQ.category}</span>
                    <span>{step + 1} de {QUESTIONS.length}</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="premium-card">
                <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', lineHeight: '1.3' }}>{currentQ.label}</h2>

                <div className="input-area">
                    {currentQ.type === 'select' && (
                        <select
                            value={answers[currentQ.id] || ''}
                            onChange={(e) => updateAnswer(e.target.value)}
                            className="custom-input"
                        >
                            <option value="" disabled>Selecciona una opción</option>
                            {currentQ.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    )}

                    {currentQ.type === 'radio' && (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {currentQ.options?.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => updateAnswer(opt)}
                                    className={`option-btn ${answers[currentQ.id] === opt ? 'active' : ''}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}

                    {currentQ.type === 'boolean' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button
                                onClick={() => updateAnswer(true)}
                                className={`option-btn ${answers[currentQ.id] === true ? 'active' : ''}`}
                            >
                                Sí
                            </button>
                            <button
                                onClick={() => updateAnswer(false)}
                                className={`option-btn ${answers[currentQ.id] === false ? 'active' : ''}`}
                            >
                                No
                            </button>
                        </div>
                    )}

                    {currentQ.type === 'number' && (
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                value={answers[currentQ.id] || ''}
                                onChange={(e) => updateAnswer(Number(e.target.value))}
                                className="custom-input"
                                placeholder={currentQ.placeholder}
                            />
                            {currentQ.suffix && <span style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-muted)' }}>{currentQ.suffix}</span>}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
                    <button
                        disabled={step === 0}
                        onClick={() => setStep(step - 1)}
                        className="btn-secondary"
                        style={{ opacity: step === 0 ? 0.3 : 1 }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <button
                        disabled={!answers[currentQ.id] && answers[currentQ.id] !== false && answers[currentQ.id] !== 0}
                        onClick={handleNext}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {step === QUESTIONS.length - 1 ? 'Finalizar' : 'Siguiente'} <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <style jsx>{`
        .custom-input {
          width: 100%;
          background: #1a1a1a;
          border: 1px solid var(--border);
          color: white;
          padding: 1.25rem;
          border-radius: 8px;
          font-size: 1.1rem;
          outline: none;
        }
        .option-btn {
          background: #1a1a1a;
          border: 1px solid var(--border);
          color: white;
          padding: 1.25rem;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }
        .option-btn:hover {
          background: #222;
          border-color: #444;
        }
        .option-btn.active {
          background: var(--accent);
          color: black;
          border-color: var(--accent);
        }
      `}</style>
        </div>
    )
}
