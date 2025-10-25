export interface Course {
  course_id: string;
  course_name: string;
  department: string;
}

export interface Classroom {
  classroom_id: string;
  building_name: string;
  room_number: string;
  capacity: number;
}

export interface Instructor {
  instructor_id: string;
  first_name: string;
  last_name: string;
  department: string;
}

export interface Timeslot {
  timeslot_id: string;
  day: string;
  start_time: string;
  end_time: string;
}

export interface ScheduleEntry {
  student_id: string;
  course_id: string;
  instructor_id: string;
  classroom_id: string;
  timeslot_id: string;
}

export interface AssignedSeat extends ScheduleEntry {
  seat_number: number;
  course_name?: string;
  instructor_name?: string;
  classroom_info?: string;
  timeslot_info?: string;
}

export interface Conflict {
  type: 'student' | 'instructor';
  id: string;
  timeslot_id: string;
  entries: ScheduleEntry[];
  details: string;
}

export interface UploadedData {
  courses: Course[];
  classrooms: Classroom[];
  instructors: Instructor[];
  timeslots: Timeslot[];
  schedule: ScheduleEntry[];
}
