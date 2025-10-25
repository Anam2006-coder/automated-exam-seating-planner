import { useCallback } from "react";
import Papa from "papaparse";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CSVUploaderProps {
  title: string;
  description: string;
  onUpload: (data: any[]) => void;
  uploaded: boolean;
  expectedColumns: string[];
}

export function CSVUploader({
  title,
  description,
  onUpload,
  uploaded,
  expectedColumns,
}: CSVUploaderProps) {
  const { toast } = useToast();

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.name.endsWith(".csv")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            toast({
              title: "Parse error",
              description: "Error parsing CSV file",
              variant: "destructive",
            });
            return;
          }

          // Validate columns
          const fileColumns = Object.keys(results.data[0] || {});
          const missingColumns = expectedColumns.filter(
            (col) => !fileColumns.includes(col)
          );

          if (missingColumns.length > 0) {
            toast({
              title: "Invalid CSV format",
              description: `Missing columns: ${missingColumns.join(", ")}`,
              variant: "destructive",
            });
            return;
          }

          onUpload(results.data);
          toast({
            title: "Success",
            description: `${title} uploaded successfully (${results.data.length} records)`,
          });
        },
        error: (error) => {
          toast({
            title: "Upload failed",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    },
    [title, expectedColumns, onUpload, toast]
  );

  return (
    <Card className={uploaded ? "border-primary bg-primary/5" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {uploaded ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-xs text-muted-foreground">
            Expected columns: {expectedColumns.join(", ")}
          </div>
          <Button
            variant={uploaded ? "secondary" : "default"}
            className="w-full"
            onClick={() => document.getElementById(`file-${title}`)?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploaded ? "Re-upload" : "Upload CSV"}
          </Button>
          <input
            id={`file-${title}`}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
}
