"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import './index.css';
import JobCard from '../../components/JobCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { toast } from "@/components/ui/use-toast"; // Assuming you have a toast component for notifications

const Page = ({ searchParams }) => {
    const [jobs, setJobs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for sending resume
    const [resumeFile, setResumeFile] = useState(null); // Resume file state

    const getJobs = async () => {
        const response = await fetch('https://anandfeeds.abhinandan.me/api/jobs');
        const json = await response.json();
        setJobs(json.data);
    };

    useEffect(() => {
        getJobs();
    }, []);

    // Handle resume file change
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    // Handle resume submission
    const handleSubmitResume = async () => {
        if (!resumeFile) {
            toast({
                variant: "destructive",
                title: "No file selected",
                description: "Please select a resume file before submitting.",
            });
            return;
        }

        const formData = new FormData();
        formData.append('files.resume', resumeFile); // Attach resume
        formData.append('data', JSON.stringify({}));

        try {
            const response = await fetch('https://anandfeeds.abhinandan.me/api/job-applications', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                toast({
                    variant: "constructive",
                    title: "Resume sent successfully",
                    description: "We will keep you in mind for future opportunities.",
                });
                setIsModalOpen(false); // Close modal after submission
            } else {
                toast({
                    variant: "destructive",
                    title: "Submission failed",
                    description: "There was an issue sending your resume. Please try again.",
                });
            }
        } catch (error) {
            console.error("Error submitting resume:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred while submitting your resume.",
            });
        }
    };

    return (
        <div>
            <Navbar searchParams={searchParams} />
            <div className="mx-auto max-w-7xl px-4 py-16">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">Career Opportunities</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Join our team and be part of revolutionizing the animal feed industry
                    </p>
                </div>

                {/* Current Openings */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold mb-8">Current Openings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job, index) => (
                            <JobCard key={index} job={job.attributes} jobId={job.id} />
                        ))}
                    </div>
                </section>

                {/* Why Join Us Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-8">Why Join Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto rounded-full bg-blue-50 p-3 w-12 h-12 flex items-center justify-center mb-2">
                                    <Briefcase className="h-6 w-6 text-blue-700" />
                                </div>
                                <h3 className="text-xl font-semibold">Growth Opportunities</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Continuous learning and career advancement opportunities with dedicated mentorship programs.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto rounded-full bg-green-50 p-3 w-12 h-12 flex items-center justify-center mb-2">
                                    <div className="h-6 w-6 text-green-700">🎯</div>
                                </div>
                                <h3 className="text-xl font-semibold">Innovation Focus</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Be part of a team that&apos;s pushing the boundaries in sustainable feed production.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto rounded-full bg-purple-50 p-3 w-12 h-12 flex items-center justify-center mb-2">
                                    <div className="h-6 w-6 text-purple-700">💪</div>
                                </div>
                                <h3 className="text-xl font-semibold">Work-Life Balance</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Flexible working hours and comprehensive benefits package for your wellbeing.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Join Our Team CTA with Resume Modal */}
                <section className="mt-16 text-center">
                    <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                        <CardContent className="py-12">
                            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Team?</h2>
                            <p className="mb-6 max-w-2xl mx-auto">
                                Don&apos;t see a position that matches your skills? Send us your resume and we&apos;ll keep you in mind for future opportunities.
                            </p>
                            <Button variant="secondary" size="lg" onClick={() => setIsModalOpen(true)}>
                                Send Your Resume
                            </Button>
                        </CardContent>
                    </Card>
                </section>

                {/* Resume Upload Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Send Your Resume</DialogTitle>
                        </DialogHeader>
                        <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                        <DialogFooter>
                            <Button onClick={handleSubmitResume}>
                                Submit Resume
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Page;
