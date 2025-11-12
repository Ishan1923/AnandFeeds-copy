import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from './ui/use-toast';

export function JobApplicationModal({ isOpen, onClose, jobTitle, jobId, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentLocation: '',
    resume: null,
    degree: '',
    profileLinks: '',
    workExperience: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('files.resume', formData.resume);
    
    // Append other form data fields
    formDataToSend.append('data', JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.currentLocation,
      degree: formData.degree,
      links: formData.profileLinks,
      experience_months: formData.workExperience,
      job: jobId,
    }));
  
    try {
      const response = await fetch('https://anandfeeds.abhinandan.me/api/job-applications', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (response.ok) {
        toast({
          variant: "constructive",
          title: "Application submitted successfully",
          description: "We will get back to you in a few days.",
        });
      } else {
        toast({
          variant: "constructive",
          title: "Failed to submit application",
          description: response.statusText,
        });
        console.error("Failed to submit application:", response.statusText);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  
    onClose();
  };
  

  return (
    <Dialog className='w-full' open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" className="col-span-3" onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" name="email" type="email" className="col-span-3" onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input id="phone" name="phone" type="tel" className="col-span-3" onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentLocation" className="text-right">Current Location</Label>
              <Input id="currentLocation" name="currentLocation" className="col-span-3" onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resume" className="text-right">Resume</Label>
              <Input id="resume" name="resume" type="file" className="col-span-3" onChange={handleFileChange} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="degree" className="text-right">Degree</Label>
              <Input id="degree" name="degree" className="col-span-3" onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profileLinks" className="text-right">Profile Links</Label>
              <Textarea id="profileLinks" name="profileLinks" className="col-span-3" onChange={handleChange} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workExperience" className="text-right">Work Experience (months)</Label>
              <Input id="workExperience" name="workExperience" type="number" className="col-span-3" onChange={handleChange} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit Application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}