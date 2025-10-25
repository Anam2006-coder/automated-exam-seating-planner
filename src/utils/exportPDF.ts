import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AssignedSeat, UploadedData } from "@/types/exam";
import {
  getRoomSchedule,
  getStudentSchedule,
  getInstructorSchedule,
} from "./scheduler";

export function exportRoomSchedulePDF(
  classroomId: string,
  assignedSeats: AssignedSeat[],
  data: UploadedData
) {
  const doc = new jsPDF();
  const roomSchedule = getRoomSchedule(classroomId, assignedSeats);
  const classroom = data.classrooms.find((c) => c.classroom_id === classroomId);

  doc.setFontSize(18);
  doc.text("Room Schedule", 14, 20);

  if (classroom) {
    doc.setFontSize(12);
    doc.text(
      `Classroom: ${classroom.building_name} - Room ${classroom.room_number}`,
      14,
      30
    );
    doc.text(`Capacity: ${classroom.capacity} seats`, 14, 37);
  }

  const tableData = roomSchedule.map((seat) => [
    seat.seat_number,
    seat.student_id,
    seat.course_name || seat.course_id,
    seat.instructor_name || seat.instructor_id,
    seat.timeslot_info || seat.timeslot_id,
  ]);

  autoTable(doc, {
    startY: 45,
    head: [["Seat", "Student ID", "Course", "Instructor", "Timeslot"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [28, 100, 140] },
  });

  doc.save(`room_schedule_${classroomId}.pdf`);
}

export function exportStudentSchedulePDF(
  studentId: string,
  assignedSeats: AssignedSeat[]
) {
  const doc = new jsPDF();
  const studentSchedule = getStudentSchedule(studentId, assignedSeats);

  doc.setFontSize(18);
  doc.text("Student Exam Schedule", 14, 20);
  doc.setFontSize(12);
  doc.text(`Student ID: ${studentId}`, 14, 30);

  const tableData = studentSchedule.map((seat) => [
    seat.course_name || seat.course_id,
    seat.instructor_name || seat.instructor_id,
    seat.classroom_info || seat.classroom_id,
    seat.seat_number,
    seat.timeslot_info || seat.timeslot_id,
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["Course", "Instructor", "Classroom", "Seat", "Timeslot"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [28, 100, 140] },
  });

  doc.save(`student_schedule_${studentId}.pdf`);
}

export function exportInstructorSchedulePDF(
  instructorId: string,
  assignedSeats: AssignedSeat[],
  data: UploadedData
) {
  const doc = new jsPDF();
  const instructorSchedule = getInstructorSchedule(instructorId, assignedSeats);
  const instructor = data.instructors.find(
    (i) => i.instructor_id === instructorId
  );

  doc.setFontSize(18);
  doc.text("Instructor Exam Schedule", 14, 20);

  if (instructor) {
    doc.setFontSize(12);
    doc.text(
      `Instructor: ${instructor.first_name} ${instructor.last_name}`,
      14,
      30
    );
    doc.text(`Department: ${instructor.department}`, 14, 37);
  }

  const tableData = instructorSchedule.map((seat) => [
    seat.course_name || seat.course_id,
    seat.classroom_info || seat.classroom_id,
    seat.timeslot_info || seat.timeslot_id,
    seat.student_id,
    seat.seat_number,
  ]);

  autoTable(doc, {
    startY: 45,
    head: [["Course", "Classroom", "Timeslot", "Student ID", "Seat"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [28, 100, 140] },
  });

  doc.save(`instructor_schedule_${instructorId}.pdf`);
}

export function exportAllSchedulesPDF(
  assignedSeats: AssignedSeat[],
  data: UploadedData
) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Complete Exam Schedule", 14, 20);

  const tableData = assignedSeats.map((seat) => [
    seat.student_id,
    seat.course_name || seat.course_id,
    seat.instructor_name || seat.instructor_id,
    seat.classroom_info || seat.classroom_id,
    seat.seat_number,
    seat.timeslot_info || seat.timeslot_id,
  ]);

  autoTable(doc, {
    startY: 30,
    head: [
      [
        "Student ID",
        "Course",
        "Instructor",
        "Classroom",
        "Seat",
        "Timeslot",
      ],
    ],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [28, 100, 140] },
    styles: { fontSize: 8 },
  });

  doc.save("complete_exam_schedule.pdf");
}
