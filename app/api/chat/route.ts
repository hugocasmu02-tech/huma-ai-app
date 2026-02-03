import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { calendarTools, faqData } from '@/lib/chatbot-data';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: google('gemini-1.5-pro-latest'),
        messages,
        system: `Eres un asistente virtual de una clínica estética llamada "Huma Aesthetic" que se comunica con los clientes.
Tu función es gestionar toda la conversación con el cliente de forma natural, clara y humana, muy profesional.

Eres responsable de:
1. Saludar al cliente de forma cercana.
2. Entender la intención del cliente.
3. Proporcionar información utilizando la herramienta "getInformation" (FAQs).
4. Gestionar citas utilizando las herramientas de calendario.
5. Responder directamente al cliente.

NUNCA debes decir que has hecho algo si no has utilizado realmente la herramienta correspondiente.

**Herramientas disponibles**

- **getInformation**: Usa esta herramienta para responder preguntas sobre tratamientos, precios, horarios, políticas, ubicación, etc.
- **getEvents**: Usar para comprobar disponibilidad en una fecha/hora concreta.
- **createEvent**: Usar para crear una cita en el calendario.
- **deleteEvent**: Usar para cancelar una cita.

**Flujo de trabajo**

**Detección de intención**

**A) Información (FAQs)**
- Si el cliente pregunta sobre tratamientos, precios, horarios, servicios, ubicación o cuestiones generales:
  → Usa **getInformation** para responder de forma natural.

**B) Gestión de citas**
- Si el cliente quiere reservar, modificar, cancelar o consultar una cita:
  1. Comprueba la disponibilidad usando **getEvents**. Importante: Verifica disponibilidad ANTES de confirmar nada.
  2. Si hay disponibilidad, crea la cita con **createEvent**.
  3. Si el cliente quiere cancelar, usa **deleteEvent**.
  
- Confirma siempre claramente la fecha, la hora y el servicio con el cliente.

**Reglas de comunicación**
- Habla de forma natural, cercana y profesional.
- Mantén los mensajes cortos y claros.
- No uses lenguaje técnico.
- No menciones herramientas ni procesos internos ("voy a consultar mi base de datos..."). Simplemente hazlo.
- Fecha y hora actuales: ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}.
    `,
        tools: {
            getInformation: tool({
                description: 'Get information about treatments, prices, location, and policies from the FAQ.',
                parameters: z.object({
                    question: z.string().describe('The user\'s question or topic to search for.'),
                }),
                execute: async ({ question }: { question: string }) => {
                    // In a real RAG system, we would vector search here.
                    // For this demo, we return the full context so the LLM can extract the answer.
                    return faqData;
                },
            } as any),
            getEvents: tool({
                description: 'Get calendar events for a specific date range to check availability.',
                parameters: z.object({
                    start: z.string().describe('Start date/time in ISO format or YYYY-MM-DD.'),
                    end: z.string().describe('End date/time in ISO format or YYYY-MM-DD.'),
                }),
                execute: async ({ start, end }: { start: string; end: string }) => {
                    return await calendarTools.getEvents(start, end);
                },
            } as any),
            createEvent: tool({
                description: 'Book a new appointment in the calendar.',
                parameters: z.object({
                    summary: z.string().describe('Title of the appointment (e.g. "Cita Botox - María").'),
                    start: z.string().describe('Start date/time in ISO format.'),
                    end: z.string().describe('End date/time in ISO format.'),
                }),
                execute: async ({ summary, start, end }: { summary: string; start: string; end: string }) => {
                    return await calendarTools.createEvent(summary, start, end);
                },
            } as any),
            deleteEvent: tool({
                description: 'Cancel an existing appointment by ID.',
                parameters: z.object({
                    eventId: z.string().describe('The ID of the event to delete.'),
                }),
                execute: async ({ eventId }: { eventId: string }) => {
                    return await calendarTools.deleteEvent(eventId);
                },
            } as any),
        },
    });

    return (result as any).toDataStreamResponse();
}
