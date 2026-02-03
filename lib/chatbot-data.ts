export interface CalendarEvent {
    id: string;
    summary: string;
    start: string; // ISO string
    end: string;   // ISO string
}

// Mock Calendar Database
let events: CalendarEvent[] = [
    {
        id: '1',
        summary: 'Consultación Dra. García',
        start: new Date(new Date().setHours(10, 0, 0, 0) + 86400000).toISOString(), // Tomorrow 10am
        end: new Date(new Date().setHours(11, 0, 0, 0) + 86400000).toISOString(), // Tomorrow 11am
    },
    {
        id: '2',
        summary: 'Revisión Botox',
        start: new Date(new Date().setHours(16, 0, 0, 0) + 172800000).toISOString(), // Day after tomorrow 4pm
        end: new Date(new Date().setHours(16, 30, 0, 0) + 172800000).toISOString(),   // Day after tomorrow 4:30pm
    }
];

export const calendarTools = {
    getEvents: async (startStr: string, endStr: string) => {
        // In a real app, this would query Google Calendar API
        const start = new Date(startStr);
        const end = new Date(endStr);

        return events.filter(e => {
            const eStart = new Date(e.start);
            return eStart >= start && eStart <= end;
        });
    },

    createEvent: async (summary: string, startStr: string, endStr: string) => {
        const newEvent: CalendarEvent = {
            id: Math.random().toString(36).substring(7),
            summary,
            start: startStr,
            end: endStr
        };
        events.push(newEvent);
        return newEvent;
    },

    deleteEvent: async (eventId: string) => {
        const initialLength = events.length;
        events = events.filter(e => e.id !== eventId);
        return events.length < initialLength ? { success: true } : { success: false, error: 'Event not found' };
    }
};

export const faqData = `
**TREATMENTS & PRICES**
- **Botox (Toxina Botulínica)**:
  - 1 Zone: €150
  - 2 Zones: €250
  - 3 Zones (Full Face): €350
  - *Description*: Reduces wrinkles and expression lines. Effect lasts 4-6 months.

- **Hyaluronic Acid Fillers**:
  - Lips: €280
  - Cheekbones: €350
  - Nasolabial Folds: €300
  - *Description*: Restores volume and hydration. Immediate results.

- **Mesotherapy**:
  - Vitamins (NCTF 135HA): €120/session
  - *Description*: Deep hydration and skin revitalization. Recommended pack of 3 sessions (€300).

**CLINIC INFORMATION**
- **Location**: Calle Velázquez 45, 1º Derecha, 28001 Madrid.
- **Hours**:
  - Monday to Friday: 10:00 - 20:00
  - Saturday: 10:00 - 14:00
  - Sunday: Closed
- **Contact**:
  - Phone: +34 91 123 45 67
  - Email: info@humaai-clinic.com

**POLICIES**
- **Cancellation**: Please notify at least 24 hours in advance to cancel or reschedule.
- **Consultation Fee**: The first consultation is FREE if a treatment is booked. Otherwise, it is €50 (deductible from future treatments).
- **Payment Methods**: Cash, Card (Visa/Mastercard), Bizum.
`;
