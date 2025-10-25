import { AlertTriangle, User, UserCog } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Conflict } from "@/types/exam";

interface ConflictsListProps {
  conflicts: Conflict[];
}

export function ConflictsList({ conflicts }: ConflictsListProps) {
  const studentConflicts = conflicts.filter((c) => c.type === "student");
  const instructorConflicts = conflicts.filter((c) => c.type === "instructor");

  if (conflicts.length === 0) {
    return (
      <Card className="border-primary bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary p-2">
              <AlertTriangle className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">No Conflicts Detected</CardTitle>
              <CardDescription>All schedules are conflict-free</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-destructive">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-lg">Conflicts Detected</CardTitle>
          </div>
          <Badge variant="destructive">{conflicts.length} Total</Badge>
        </div>
        <CardDescription>
          Review and resolve scheduling conflicts before generating final schedules
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {studentConflicts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <User className="h-4 w-4" />
              Student Conflicts ({studentConflicts.length})
            </div>
            <div className="space-y-2">
              {studentConflicts.map((conflict, idx) => (
                <Alert key={idx} variant="destructive">
                  <AlertTitle className="text-sm">
                    Student {conflict.id}
                  </AlertTitle>
                  <AlertDescription className="text-xs">
                    {conflict.details}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {instructorConflicts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <UserCog className="h-4 w-4" />
              Instructor Conflicts ({instructorConflicts.length})
            </div>
            <div className="space-y-2">
              {instructorConflicts.map((conflict, idx) => (
                <Alert key={idx} variant="destructive">
                  <AlertTitle className="text-sm">
                    Instructor {conflict.id}
                  </AlertTitle>
                  <AlertDescription className="text-xs">
                    {conflict.details}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
