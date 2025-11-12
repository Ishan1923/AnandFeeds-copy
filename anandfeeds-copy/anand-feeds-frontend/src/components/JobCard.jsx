import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { MapPin, Briefcase, IndianRupee, GraduationCap } from "lucide-react";
import { JobApplicationModal } from './JobApplicationModal';

export default function JobCard({ job, jobId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyNow = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitApplication = (formData) => {
    // Handle form submission here, e.g., send data to an API
    console.log('Form submitted:', formData);
    // You can add your API call or data processing logic here
  };

  return (
    <div className='w-full'>
      <Card className="hover:shadow-xl transition-shadow shadow-md">
        <CardHeader>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                {job.vacancy}
              </span>
              <Button variant="secondary" size="sm">
                Share
              </Button>
            </div>
            <h3 className="text-xl font-semibold">{job.title}</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">{job.requirements.join(', ')}</p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{job.location}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <IndianRupee className="h-4 w-4 mr-2" />
                <span className="text-sm">{job.salary}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Briefcase className="h-4 w-4 mr-2" />
                <span className="text-sm">{job.experience} experience</span>
              </div>
              <div className="flex items-center text-gray-500">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span className="text-sm">{job.qualification}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleApplyNow}>Apply Now</Button>
        </CardFooter>
      </Card>
      
      <JobApplicationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        jobTitle={job.title}
        onSubmit={handleSubmitApplication}
        jobId={jobId}
      />
    </div>
  );
}