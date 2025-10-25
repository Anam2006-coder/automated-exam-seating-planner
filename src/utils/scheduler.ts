import type {
  ScheduleEntry,
  AssignedSeat,
  Conflict,
  UploadedData,
  Classroom,
  Course,
  Instructor,
  Timeslot,
} from "@/types/exam";

const SEATS_PER_CLASSROOM = 30;

export function assignSeats(data: UploadedData): {
  assignedSeats: AssignedSeat[];
  conflicts: Conflict[];
} {
  const { schedule, classrooms, courses, instructors, timeslots } = data;

  // Group students by classroom and timeslot
  const classroomTimeslotGroups = new Map<string, ScheduleEntry[]>();

  schedule.forEach((entry) => {
    const key = `${entry.classroom_id}_${entry.timeslot_id}`;
    if (!classroomTimeslotGroups.has(key)) {
      classroomTimeslotGroups.set(key, []);
    }
    classroomTimeslotGroups.get(key)!.push(entry);
  });

  // Assign seat numbers
  const assignedSeats: AssignedSeat[] = [];
  let seatAssignmentWarnings: string[] = [];

  classroomTimeslotGroups.forEach((entries, key) => {
    const [classroom_id] = key.split("_");
    const classroom = classrooms.find((c) => c.classroom_id === classroom_id);
    const capacity = classroom?.capacity || SEATS_PER_CLASSROOM;

    if (entries.length > capacity) {
      seatAssignmentWarnings.push(
        `Classroom ${classroom_id} exceeded capacity: ${entries.length} students assigned, but only ${capacity} seats available`
      );
    }

    entries.forEach((entry, index) => {
      const seatNumber = (index % SEATS_PER_CLASSROOM) + 1;
      const course = courses.find((c) => c.course_id === entry.course_id);
      const instructor = instructors.find(
        (i) => i.instructor_id === entry.instructor_id
      );
      const timeslot = timeslots.find(
        (t) => t.timeslot_id === entry.timeslot_id
      );

      assignedSeats.push({
        ...entry,
        seat_number: seatNumber,
        course_name: course?.course_name,
        instructor_name: instructor
          ? `${instructor.first_name} ${instructor.last_name}`
          : undefined,
        classroom_info: classroom
          ? `${classroom.building_name} - Room ${classroom.room_number}`
          : undefined,
        timeslot_info: timeslot
          ? `${timeslot.day} ${timeslot.start_time}-${timeslot.end_time}`
          : undefined,
      });
    });
  });

  // Detect conflicts
  const conflicts = detectConflicts(schedule, timeslots);

  return { assignedSeats, conflicts };
}

export function detectConflicts(
  schedule: ScheduleEntry[],
  timeslots: Timeslot[]
): Conflict[] {
  const conflicts: Conflict[] = [];

  // Check for student conflicts (same student, overlapping timeslots)
  const studentSchedules = new Map<string, ScheduleEntry[]>();
  schedule.forEach((entry) => {
    if (!studentSchedules.has(entry.student_id)) {
      studentSchedules.set(entry.student_id, []);
    }
    studentSchedules.get(entry.student_id)!.push(entry);
  });

  studentSchedules.forEach((entries, student_id) => {
    const timeslotMap = new Map<string, ScheduleEntry[]>();
    entries.forEach((entry) => {
      if (!timeslotMap.has(entry.timeslot_id)) {
        timeslotMap.set(entry.timeslot_id, []);
      }
      timeslotMap.get(entry.timeslot_id)!.push(entry);
    });

    timeslotMap.forEach((conflictingEntries, timeslot_id) => {
      if (conflictingEntries.length > 1) {
        const timeslot = timeslots.find((t) => t.timeslot_id === timeslot_id);
        conflicts.push({
          type: "student",
          id: student_id,
          timeslot_id,
          entries: conflictingEntries,
          details: `Student ${student_id} has ${conflictingEntries.length} exams scheduled at the same time${timeslot ? ` (${timeslot.day} ${timeslot.start_time}-${timeslot.end_time})` : ""}`,
        });
      }
    });
  });

  // Check for instructor conflicts (same instructor, overlapping timeslots)
  const instructorSchedules = new Map<string, ScheduleEntry[]>();
  schedule.forEach((entry) => {
    if (!instructorSchedules.has(entry.instructor_id)) {
      instructorSchedules.set(entry.instructor_id, []);
    }
    instructorSchedules.get(entry.instructor_id)!.push(entry);
  });

  instructorSchedules.forEach((entries, instructor_id) => {
    const timeslotMap = new Map<string, ScheduleEntry[]>();
    entries.forEach((entry) => {
      if (!timeslotMap.has(entry.timeslot_id)) {
        timeslotMap.set(entry.timeslot_id, []);
      }
      timeslotMap.get(entry.timeslot_id)!.push(entry);
    });

    timeslotMap.forEach((conflictingEntries, timeslot_id) => {
      if (conflictingEntries.length > 1) {
        const timeslot = timeslots.find((t) => t.timeslot_id === timeslot_id);
        conflicts.push({
          type: "instructor",
          id: instructor_id,
          timeslot_id,
          entries: conflictingEntries,
          details: `Instructor ${instructor_id} is assigned to ${conflictingEntries.length} classes at the same time${timeslot ? ` (${timeslot.day} ${timeslot.start_time}-${timeslot.end_time})` : ""}`,
        });
      }
    });
  });

  return conflicts;
}

export function getStudentSchedule(
  studentId: string,
  assignedSeats: AssignedSeat[]
): AssignedSeat[] {
  return assignedSeats.filter((seat) => seat.student_id === studentId);
}

export function getInstructorSchedule(
  instructorId: string,
  assignedSeats: AssignedSeat[]
): AssignedSeat[] {
  return assignedSeats.filter((seat) => seat.instructor_id === instructorId);
}

export function getRoomSchedule(
  classroomId: string,
  assignedSeats: AssignedSeat[]
): AssignedSeat[] {
  return assignedSeats
    .filter((seat) => seat.classroom_id === classroomId)
    .sort((a, b) => a.seat_number - b.seat_number);
}
