"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const ApplyPage = () => {
  const [formData, setFormData] = useState({
    project: "",
    cgpa: "",
    skills: "",
    otherInfo: "",
  });

  const applyMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // TODO: make request to backend
      console.log(data);
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit application");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append("project", formData.project);
    submissionData.append("cgpa", formData.cgpa);
    submissionData.append("skills", formData.skills);
    submissionData.append("otherInfo", formData.otherInfo);

    applyMutation.mutate(submissionData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <Card className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold text-gray-900 dark:text-white">
            Apply for a Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="project" className="text-lg font-medium">
                Project Name
              </Label>
              <Input
                id="project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            {/* CGPA */}
            <div className="space-y-2">
              <Label htmlFor="cgpa" className="text-lg font-medium">
                CGPA
              </Label>
              <Input
                id="cgpa"
                name="cgpa"
                type="number"
                value={formData.cgpa}
                onChange={handleChange}
                required
                className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-lg font-medium">
                Skills (comma separated)
              </Label>
              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            {/* Other Info */}
            <div className="space-y-2">
              <Label htmlFor="otherInfo" className="text-lg font-medium">
                Other Info
              </Label>
              <Textarea
                id="otherInfo"
                name="otherInfo"
                value={formData.otherInfo}
                onChange={handleChange}
                className="h-28 w-full resize-none rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="Mention any additional information..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full rounded-lg bg-red-600 px-4 py-2 text-lg font-semibold text-white transition-all hover:bg-red-700"
            >
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplyPage;
