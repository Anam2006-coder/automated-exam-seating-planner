import { useState } from "react";
import { Calendar, BookOpen, Settings } from "lucide-react";
import { CSVUploader } from "@/components/CSVUploader";
import { ConflictsList } from "@/components/ConflictsList";
import { ExportControls } from "@/components/ExportControls";
import { SchedulePreview } from "@/components/SchedulePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { assignSeats } from "@/utils/scheduler";
import type { UploadedData, AssignedSeat, Conflict } from "@/types/exam";

const Index = () => {
  const { toast } = useToast();
  const [data, setData] = useState<UploadedData>({
    courses: [],
    classrooms: [],
    instructors: [],
    timeslots: [],
    schedule: [],
  });
  const [assignedSeats, setAssignedSeats] = useState<AssignedSeat[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const allDataUploaded =
    data.courses.length > 0 &&
    data.classrooms.length > 0 &&
    data.instructors.length > 0 &&
    data.timeslots.length > 0 &&
    data.schedule.length > 0;

  const handleGenerateSchedule = () => {
    if (!allDataUploaded) {
      toast({
        title: "Missing data",
        description: "Please upload all CSV files before generating schedule",
        variant: "destructive",
      });
      return;
    }

    const result = assignSeats(data);
    setAssignedSeats(result.assignedSeats);
    setConflicts(result.conflicts);
    setIsGenerated(true);

    toast({
      title: "Schedule generated",
      description: `Successfully assigned ${result.assignedSeats.length} seats. ${result.conflicts.length > 0 ? `Found ${result.conflicts.length} conflicts.` : "No conflicts detected!"}`,
      variant: result.conflicts.length > 0 ? "destructive" : "default",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Exam Scheduling & Seating Planner</h1>
              <p className="text-sm text-muted-foreground">
                Automated exam scheduler with conflict detection
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Step 1: Upload CSV Files</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CSVUploader
              title="Courses"
              description="Upload course information"
              expectedColumns={["course_id", "course_name", "department"]}
              onUpload={(courses) => setData({ ...data, courses })}
              uploaded={data.courses.length > 0}
            />
            <CSVUploader
              title="Classrooms"
              description="Upload classroom details (30 seats each)"
              expectedColumns={["classroom_id", "building_name", "room_number", "capacity"]}
              onUpload={(classrooms) =>
                setData({
                  ...data,
                  classrooms: classrooms.map((c) => ({
                    ...c,
                    capacity: 30,
                  })),
                })
              }
              uploaded={data.classrooms.length > 0}
            />
            <CSVUploader
              title="Instructors"
              description="Upload instructor information"
              expectedColumns={["instructor_id", "first_name", "last_name", "department"]}
              onUpload={(instructors) => setData({ ...data, instructors })}
              uploaded={data.instructors.length > 0}
            />
            <CSVUploader
              title="Timeslots"
              description="Upload exam timeslots"
              expectedColumns={["timeslot_id", "day", "start_time", "end_time"]}
              onUpload={(timeslots) => setData({ ...data, timeslots })}
              uploaded={data.timeslots.length > 0}
            />
            <CSVUploader
              title="Schedule"
              description="Upload student exam assignments"
              expectedColumns={[
                "student_id",
                "course_id",
                "instructor_id",
                "classroom_id",
                "timeslot_id",
              ]}
              onUpload={(schedule) => setData({ ...data, schedule })}
              uploaded={data.schedule.length > 0}
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Step 2: Generate Schedule</h2>
            </div>
            <Button
              size="lg"
              onClick={handleGenerateSchedule}
              disabled={!allDataUploaded}
            >
              Generate Exam Schedule
            </Button>
          </div>
          {isGenerated && <ConflictsList conflicts={conflicts} />}
        </section>

        {isGenerated && assignedSeats.length > 0 && (
          <>
            <section>
              <SchedulePreview assignedSeats={assignedSeats} data={data} />
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Step 3: Export Schedules</h2>
              </div>
              <ExportControls
                assignedSeats={assignedSeats}
                data={data}
                conflicts={conflicts}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
