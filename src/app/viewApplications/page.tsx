"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useQuery } from "@tanstack/react-query";

type Application = {
  id: string;
  project: string;
  cgpa: string;
  skills: string;
  otherInfo: string;
  pdfUrl?: string;
};

// TODO: fetch from backend
const fetchApplications = async () => {
  const applications: Application[] = [
    {
      id: "1",
      project: "Project 1",
      cgpa: "9.5",
      skills: "React, TypeScript, Node.js",
      otherInfo: "I have experience with React and TypeScript.",
    },
  ];
  return applications;
};

const ViewApplications = () => {
  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ["project_applications"],
    queryFn: fetchApplications,
    staleTime: Infinity,
    retry: 1,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12 dark:bg-gray-900">
      <div className="w-full max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900 dark:text-white">
          Submitted Applications
        </h1>

        {isLoading ? (
          <p className="text-center text-lg text-gray-700 dark:text-gray-300">
            Loading applications...
          </p>
        ) : !applications?.length ? (
          <p className="text-center text-lg text-gray-500 dark:text-gray-400">
            No applications found.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <Card
                key={app.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    {app.project}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-md text-gray-700 dark:text-gray-300">
                    <strong>CGPA:</strong> {app.cgpa}
                  </p>
                  <p className="text-md text-gray-700 dark:text-gray-300">
                    <strong>Skills:</strong> {app.skills}
                  </p>
                  {app.otherInfo && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <strong>Other Info:</strong> {app.otherInfo}
                    </p>
                  )}
                  {app.pdfUrl && (
                    <Button
                      asChild
                      className="text-md mt-4 w-full rounded-lg bg-red-600 px-5 py-2 text-center font-semibold text-white transition-all hover:bg-red-700"
                    >
                      <a
                        href={app.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📄 View PDF
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplications;
