import * as XLSX from "xlsx";
import type { AssignedSeat, UploadedData, Conflict } from "@/types/exam";
import {
  getRoomSchedule,
  getStudentSchedule,
  getInstructorSchedule,
} from "./scheduler";

export function exportToExcel(
  assignedSeats: AssignedSeat[],
  data: UploadedData,
  conflicts: Conflict[]
) {
  const workbook = XLSX.utils.book_new();

  // Complete Schedule Sheet
  const completeScheduleData = assignedSeats.map((seat) => ({
    "Student ID": seat.student_id,
    Course: seat.course_name || seat.course_id,
    Instructor: seat.instructor_name || seat.instructor_id,
    Classroom: seat.classroom_info || seat.classroom_id,
    "Seat Number": seat.seat_number,
    Timeslot: seat.timeslot_info || seat.timeslot_id,
  }));

  const completeSheet = XLSX.utils.json_to_sheet(completeScheduleData);
  XLSX.utils.book_append_sheet(workbook, completeSheet, "Complete Schedule");

  // Room-wise Schedules
  data.classrooms.forEach((classroom) => {
    const roomSchedule = getRoomSchedule(classroom.classroom_id, assignedSeats);
    if (roomSchedule.length > 0) {
      const roomData = roomSchedule.map((seat) => ({
        "Seat Number": seat.seat_number,
        "Student ID": seat.student_id,
        Course: seat.course_name || seat.course_id,
        Instructor: seat.instructor_name || seat.instructor_id,
        Timeslot: seat.timeslot_info || seat.timeslot_id,
      }));

      const roomSheet = XLSX.utils.json_to_sheet(roomData);
      const sheetName = `Room ${classroom.room_number}`.substring(0, 31);
      XLSX.utils.book_append_sheet(workbook, roomSheet, sheetName);
    }
  });

  // Conflicts Sheet
  if (conflicts.length > 0) {
    const conflictData = conflicts.map((conflict) => ({
      Type: conflict.type,
      ID: conflict.id,
      "Timeslot ID": conflict.timeslot_id,
      Details: conflict.details,
      "Number of Conflicts": conflict.entries.length,
    }));

    const conflictSheet = XLSX.utils.json_to_sheet(conflictData);
    XLSX.utils.book_append_sheet(workbook, conflictSheet, "Conflicts");
  }

  // Summary Sheet
  const summaryData = [
    { Metric: "Total Students", Value: new Set(assignedSeats.map(s => s.student_id)).size },
    { Metric: "Total Courses", Value: data.courses.length },
    { Metric: "Total Classrooms", Value: data.classrooms.length },
    { Metric: "Total Instructors", Value: data.instructors.length },
    { Metric: "Total Timeslots", Value: data.timeslots.length },
    { Metric: "Total Conflicts", Value: conflicts.length },
    { Metric: "Student Conflicts", Value: conflicts.filter(c => c.type === "student").length },
    { Metric: "Instructor Conflicts", Value: conflicts.filter(c => c.type === "instructor").length },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  XLSX.writeFile(workbook, "exam_schedules.xlsx");
}

export function exportStudentScheduleExcel(
  studentId: string,
  assignedSeats: AssignedSeat[]
) {
  const studentSchedule = getStudentSchedule(studentId, assignedSeats);

  const scheduleData = studentSchedule.map((seat) => ({
    Course: seat.course_name || seat.course_id,
    Instructor: seat.instructor_name || seat.instructor_id,
    Classroom: seat.classroom_info || seat.classroom_id,
    "Seat Number": seat.seat_number,
    Timeslot: seat.timeslot_info || seat.timeslot_id,
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(scheduleData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "My Schedule");

  XLSX.writeFile(workbook, `student_${studentId}_schedule.xlsx`);
}

export function exportInstructorScheduleExcel(
  instructorId: string,
  assignedSeats: AssignedSeat[],
  data: UploadedData
) {
  const instructorSchedule = getInstructorSchedule(instructorId, assignedSeats);

  const scheduleData = instructorSchedule.map((seat) => ({
    Course: seat.course_name || seat.course_id,
    Classroom: seat.classroom_info || seat.classroom_id,
    Timeslot: seat.timeslot_info || seat.timeslot_id,
    "Student ID": seat.student_id,
    "Seat Number": seat.seat_number,
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(scheduleData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "My Classes");

  XLSX.writeFile(workbook, `instructor_${instructorId}_schedule.xlsx`);
}
