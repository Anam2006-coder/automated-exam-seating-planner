import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AssignedSeat, UploadedData } from "@/types/exam";
import { Calendar, MapPin, Users } from "lucide-react";

interface SchedulePreviewProps {
  assignedSeats: AssignedSeat[];
  data: UploadedData;
}

export function SchedulePreview({ assignedSeats, data }: SchedulePreviewProps) {
  const uniqueClassrooms = Array.from(new Set(assignedSeats.map((s) => s.classroom_id)));
  const uniqueTimeslots = Array.from(new Set(assignedSeats.map((s) => s.timeslot_id)));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Preview</CardTitle>
        <CardDescription>
          View the generated exam schedule organized by classroom and timeslot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="rooms">By Room</TabsTrigger>
            <TabsTrigger value="timeslots">By Timeslot</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(assignedSeats.map((s) => s.student_id)).size}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Classrooms</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{uniqueClassrooms.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Timeslots</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{uniqueTimeslots.length}</div>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Classroom</TableHead>
                    <TableHead>Seat</TableHead>
                    <TableHead>Timeslot</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedSeats.slice(0, 10).map((seat, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{seat.student_id}</TableCell>
                      <TableCell>{seat.course_name || seat.course_id}</TableCell>
                      <TableCell>{seat.classroom_info || seat.classroom_id}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{seat.seat_number}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {seat.timeslot_info || seat.timeslot_id}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {assignedSeats.length > 10 && (
              <p className="text-center text-sm text-muted-foreground">
                Showing 10 of {assignedSeats.length} total assignments. Export for full data.
              </p>
            )}
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4">
            {uniqueClassrooms.map((classroomId) => {
              const roomSeats = assignedSeats.filter(
                (s) => s.classroom_id === classroomId
              );
              const classroom = data.classrooms.find(
                (c) => c.classroom_id === classroomId
              );

              return (
                <Card key={classroomId}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {classroom
                        ? `${classroom.building_name} - Room ${classroom.room_number}`
                        : classroomId}
                    </CardTitle>
                    <CardDescription>
                      {roomSeats.length} students assigned
                      {classroom && ` / ${classroom.capacity} capacity`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Seat</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Timeslot</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {roomSeats.slice(0, 5).map((seat, idx) => (
                            <TableRow key={idx}>
                              <TableCell>
                                <Badge variant="outline">{seat.seat_number}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {seat.student_id}
                              </TableCell>
                              <TableCell>{seat.course_name || seat.course_id}</TableCell>
                              <TableCell className="text-sm">
                                {seat.timeslot_info || seat.timeslot_id}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {roomSeats.length > 5 && (
                      <p className="mt-2 text-center text-xs text-muted-foreground">
                        Showing 5 of {roomSeats.length}. Export for complete room schedule.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="timeslots" className="space-y-4">
            {uniqueTimeslots.map((timeslotId) => {
              const timeslotSeats = assignedSeats.filter(
                (s) => s.timeslot_id === timeslotId
              );
              const timeslot = data.timeslots.find((t) => t.timeslot_id === timeslotId);

              return (
                <Card key={timeslotId}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {timeslot
                        ? `${timeslot.day} ${timeslot.start_time} - ${timeslot.end_time}`
                        : timeslotId}
                    </CardTitle>
                    <CardDescription>
                      {timeslotSeats.length} students scheduled
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Classroom</TableHead>
                            <TableHead>Seat</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {timeslotSeats.slice(0, 5).map((seat, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">
                                {seat.student_id}
                              </TableCell>
                              <TableCell>{seat.course_name || seat.course_id}</TableCell>
                              <TableCell>
                                {seat.classroom_info || seat.classroom_id}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">{seat.seat_number}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {timeslotSeats.length > 5 && (
                      <p className="mt-2 text-center text-xs text-muted-foreground">
                        Showing 5 of {timeslotSeats.length}. Export for complete timeslot data.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
