import { Volunteer, ChurchEvent, Assignment, Ministry, getMinistryRequirement } from '../types';

export function autoSchedule(
  volunteers: Volunteer[],
  events: ChurchEvent[],
  existingAssignments: Assignment[]
): Assignment[] {
  // Start with a copy of existing assignments (to preserve manual edits)
  let assignments: Assignment[] = [...existingAssignments];

  // Track how many times each volunteer has served to balance participation
  const getParticipationCount = (volunteerId: string) => 
    assignments.filter(a => a.volunteerId === volunteerId).length;

  events.forEach(event => {
    event.teamsNeeded.forEach(ministry => {
      const requiredCount = getMinistryRequirement(ministry, event.date);
      
      // Filter existing assignments for this event and ministry
      const currentAssignedIds = assignments
        .filter(a => a.eventId === event.id && a.ministry === ministry)
        .map(a => a.volunteerId);

      let needed = requiredCount - currentAssignedIds.length;

      if (needed > 0) {
        // Find candidates who:
        // 1. Are available on this date
        // 2. Are part of this ministry
        // 3. Are NOT already assigned to this specific event (no conflicts)
        const candidates = volunteers.filter(v => 
          v.availableDates.includes(event.date) &&
          v.ministries.includes(ministry) &&
          !assignments.some(a => a.eventId === event.id && a.volunteerId === v.id)
        );

        // Sort candidates by:
        // - Participation frequency (fewer scales first to balance)
        // - Random factor (to avoid picking the same alphabetical order)
        candidates.sort((a, b) => {
          const countA = getParticipationCount(a.id);
          const countB = getParticipationCount(b.id);
          if (countA !== countB) return countA - countB;
          return Math.random() - 0.5;
        });

        // Fill the slots
        candidates.slice(0, needed).forEach(v => {
          assignments.push({
            id: `auto-${event.id}-${v.id}-${ministry}`,
            eventId: event.id,
            volunteerId: v.id,
            ministry: ministry,
            role: v.primaryRole,
            status: 'assigned'
          });
        });
      }
    });
  });

  return assignments;
}
