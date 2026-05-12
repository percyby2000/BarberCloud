export interface Slot {
  time: string;
  available: boolean;
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  durationMin: number,
  existingAppointments: { start: Date; end: Date }[],
  intervalMin: number = 30
): string[] {
  const slots: string[] = [];
  
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  
  let currentMin = startH * 60 + startM;
  const endMinTotal = endH * 60 + endM;
  
  while (currentMin + durationMin <= endMinTotal) {
    const slotStartMin = currentMin;
    const slotEndMin = currentMin + durationMin;
    
    const isOccupied = existingAppointments.some(app => {
      const appStartMin = app.start.getHours() * 60 + app.start.getMinutes();
      const appEndMin = app.end.getHours() * 60 + app.end.getMinutes();
      
      // Conflict if: slotStart < appEnd AND slotEnd > appStart
      return slotStartMin < appEndMin && slotEndMin > appStartMin;
    });
    
    if (!isOccupied) {
      const h = Math.floor(currentMin / 60).toString().padStart(2, '0');
      const m = (currentMin % 60).toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
    }
    
    currentMin += intervalMin;
  }
  
  return slots;
}
