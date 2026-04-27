"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Building2, CheckCircle, Download, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function UploadCard({ title, description }: { title: string; description: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === "text/csv") {
        setSelectedFile(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please select a .csv file.",
        });
        setSelectedFile(null);
        event.target.value = "";
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setIsUploading(true);
      setTimeout(() => {
        toast({
          title: <div className="flex items-center gap-2"><CheckCircle className="text-green-500" /> Success</div>,
          description: `"${selectedFile.name}" uploaded successfully.`,
        });
        setIsUploading(false);
        setSelectedFile(null);
        const fileInput = document.getElementById(`file-upload-${title}`) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }, 1500);
    }
  };

  const handleDownloadTemplate = () => {
    const headers =
      title === "Universities"
        ? [
            "University Name",
            "Unique Code",
            "Image URL",
            "Location (City, Country)",
            "Full Address",
            "Established Year",
            "Type",
            "Partner University (Yes/No)",
            "Description",
            "Long Description",
            "Official Website",
            "Email",
            "Contact Number",
            "Application Fee Waived (Yes/No)",
            "US News & World Report",
            "QS Ranking",
            "THE (Times Higher Education)",
            "ARWU (Shanghai Ranking)",
            "Our Ranking",
            "Fields of Study (comma-separated)",
            "Program Offerings (IDs) (comma-separated IDs)",
            "Tuition Fees Min",
            "Tuition Fees Max",
            "Tuition Fees Currency",
            "Tuition Fees Notes",
            "Admission Requirements (use \"\" for multiline)",
            "Campus Life (use \"\" for multiline)",
          ]
        : [
            "Unique ID",
            "Course Name",
            "Course Code",
            "University Code",
            "University Name",
            "Department/School",
            "Discipline/Major",
            "Specialization",
            "Course Level",
            "Overview/Description",
            "Summary",
            "Prerequisites (comma-separated)",
            "Learning Outcomes (comma-separated)",
            "Teaching Methodology",
            "Assessment Methods (comma-separated)",
            "Credits",
            "Duration (Months)",
            "Language of Instruction",
            "Syllabus URL",
            "Keywords (comma-separated)",
            "Professor Name",
            "Professor Email",
            "Office Location",
            "Open for Intake (Year/Semester)",
            "Admission Open Years",
            "Attendance Type",
            "1st Year Tuition Fee",
            "Total Tuition Fee",
            "Tuition Fee Currency",
            "Application Fee Amount",
            "Application Fee Currency",
            "Application Fee Waived (Yes/No)",
            "Required Application Materials",
            "12th Grade Requirement",
            "Undergraduate Degree Requirement",
            "Minimum IELTS Score",
            "Minimum TOEFL Score",
            "Minimum PTE Score",
            "Minimum Duolingo Score",
            "Minimum Cambridge English Score",
            "Other English Tests Accepted",
            "GRE Required (Yes/No)",
            "GRE Score",
            "GMAT Required (Yes/No)",
            "GMAT Score",
            "SAT Required (Yes/No)",
            "SAT Score",
            "ACT Required (Yes/No)",
            "ACT Score",
            "Waiver Options",
            "Partner Course (Yes/No)",
            "FT Ranking 2024",
            "Acceptance Rate",
            "Domestic Application Deadline",
            "International Application Deadline",
            "Course URL",
          ];

    const csvHeader = headers
      .map((header) => `"${header.replace(/"/g, '""')}"`)
      .join(",");
    const blob = new Blob([csvHeader], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", title === "Universities" ? "university_template.csv" : "course_template.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              {title === "Universities" ? <Building2 className="text-accent" /> : <FileText className="text-accent" />}
              {title} Data
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Template
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          id={`file-upload-${title}`}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isUploading}
          className="file:text-primary file:font-semibold"
        />
        {selectedFile && <p className="text-sm text-muted-foreground">Selected file: {selectedFile.name}</p>}
        <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full">
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Upload CSV
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isLoading, logout, admin } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      router.push("/admin/login");
    }
    return null;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-headline text-4xl font-bold mb-2 text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {admin?.email}</p>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UploadCard
          title="Universities"
          description="Upload a CSV file with university information."
        />
        <UploadCard
          title="Courses"
          description="Upload a CSV file with course information."
        />
      </div>
    </div>
  );
}
