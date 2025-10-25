import { FileDown, FileSpreadsheet, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { exportToExcel, exportStudentScheduleExcel, exportInstructorScheduleExcel } from "@/utils/exportExcel";
import { exportAllSchedulesPDF, exportStudentSchedulePDF, exportInstructorSchedulePDF, exportRoomSchedulePDF } from "@/utils/exportPDF";
import type { AssignedSeat, UploadedData, Conflict } from "@/types/exam";

interface ExportControlsProps {
  assignedSeats: AssignedSeat[];
  data: UploadedData;
  conflicts: Conflict[];
}

export function ExportControls({ assignedSeats, data, conflicts }: ExportControlsProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");

  const uniqueStudents = Array.from(new Set(assignedSeats.map((s) => s.student_id)));
  const uniqueInstructors = Array.from(new Set(assignedSeats.map((s) => s.instructor_id)));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Excel Export</CardTitle>
          </div>
          <CardDescription>Download schedules in Excel format</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full"
            onClick={() => exportToExcel(assignedSeats, data, conflicts)}
          >
            <Download className="mr-2 h-4 w-4" />
            Complete Schedule (All Rooms)
          </Button>

          <div className="space-y-2">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent>
                {uniqueStudents.map((id) => (
                  <SelectItem key={id} value={id}>
                    {id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="secondary"
              className="w-full"
              disabled={!selectedStudent}
              onClick={() =>
                selectedStudent &&
                exportStudentScheduleExcel(selectedStudent, assignedSeats)
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Student Schedule
            </Button>
          </div>

          <div className="space-y-2">
            <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
              <SelectTrigger>
                <SelectValue placeholder="Select Instructor" />
              </SelectTrigger>
              <SelectContent>
                {uniqueInstructors.map((id) => (
                  <SelectItem key={id} value={id}>
                    {data.instructors.find((i) => i.instructor_id === id)
                      ? `${data.instructors.find((i) => i.instructor_id === id)?.first_name} ${data.instructors.find((i) => i.instructor_id === id)?.last_name}`
                      : id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="secondary"
              className="w-full"
              disabled={!selectedInstructor}
              onClick={() =>
                selectedInstructor &&
                exportInstructorScheduleExcel(selectedInstructor, assignedSeats, data)
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Instructor Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">PDF Export</CardTitle>
          </div>
          <CardDescription>Download printable PDF schedules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => exportAllSchedulesPDF(assignedSeats, data)}
          >
            <Download className="mr-2 h-4 w-4" />
            Complete Schedule
          </Button>

          <div className="space-y-2">
            <Select value={selectedClassroom} onValueChange={setSelectedClassroom}>
              <SelectTrigger>
                <SelectValue placeholder="Select Classroom" />
              </SelectTrigger>
              <SelectContent>
                {data.classrooms.map((classroom) => (
                  <SelectItem key={classroom.classroom_id} value={classroom.classroom_id}>
                    {classroom.building_name} - Room {classroom.room_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="secondary"
              className="w-full"
              disabled={!selectedClassroom}
              onClick={() =>
                selectedClassroom &&
                exportRoomSchedulePDF(selectedClassroom, assignedSeats, data)
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Room Schedule
            </Button>
          </div>

          <div className="space-y-2">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent>
                {uniqueStudents.map((id) => (
                  <SelectItem key={id} value={id}>
                    {id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="secondary"
              className="w-full"
              disabled={!selectedStudent}
              onClick={() =>
                selectedStudent &&
                exportStudentSchedulePDF(selectedStudent, assignedSeats)
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Student Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
