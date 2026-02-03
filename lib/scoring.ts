export type QuestionnaireData = {
    // Captación
    canalEntrada: string;
    tiempoRespuesta: string;
    convActual: number;
    cualificacionPrevia: boolean;
    // Agenda
    recordatorios: boolean;
    noshowRate: number;
    listaEspera: boolean;
    tiempoConfirmacion: string;
    // Retención
    seguimientoPost: boolean;
    porcentajeRecurrencia: number;
    reactivacionInactivos: boolean;
    canalComunicacion: string;
};

export const calculateScores = (data: QuestionnaireData) => {
    // Pesos para generar scores de 0 a 100 (100 = optimizado)

    // Captación
    let captScore = 0;
    if (data.tiempoRespuesta === '<5 min') captScore += 40;
    else if (data.tiempoRespuesta === '<1h') captScore += 20;
    captScore += (data.convActual > 30 ? 30 : data.convActual); // Max 30% from current conv
    if (data.cualificacionPrevia) captScore += 30;

    // Agenda
    let agendaScore = 0;
    if (data.recordatorios) agendaScore += 30;
    agendaScore += Math.max(0, 40 - data.noshowRate); // Inv scale 
    if (data.listaEspera) agendaScore += 15;
    if (data.tiempoConfirmacion === '<1h') agendaScore += 15;

    // Retención
    let retencionScore = 0;
    if (data.seguimientoPost) retencionScore += 30;
    retencionScore += (data.porcentajeRecurrencia > 50 ? 40 : data.porcentajeRecurrencia * 0.8);
    if (data.reactivacionInactivos) retencionScore += 30;

    return {
        captacion: Math.min(100, captScore),
        agenda: Math.min(100, agendaScore),
        retencion: Math.min(100, retencionScore)
    };
};

export const getRecomendations = (scores: { captacion: number, agenda: number, retencion: number }) => {
    const categories = [
        { id: 'captacion', name: 'Captación y Conversión en Agenda', score: scores.captacion },
        { id: 'agenda', name: 'Optimización Económica de la Agenda', score: scores.agenda },
        { id: 'retencion', name: 'Retención y Recurrencia', score: scores.retencion },
    ];

    // Ordenar de menor a mayor score (mayor necesidad de mejora primero)
    const sorted = [...categories].sort((a, b) => a.score - b.score);

    return {
        principal: sorted[0],
        secundario: sorted[1].score < 70 ? sorted[1] : null
    };
};
