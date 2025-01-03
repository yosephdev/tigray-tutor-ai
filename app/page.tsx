'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Twitter, Mail, Mic } from "lucide-react";

interface TigrayTutorInput {
  lessonUpload?: File;
  userMessage: string;
  voiceInput: string;
  actionType: 'translate' | 'tutor';
}

interface TigrayTutorOutput {
  response: string;
  translation: string;
  exercises: string[];
  progress: { subject: string; completed: number; total: number; };
  message?: string;
}

const TigrayTutor: React.FC = () => {
  const [input, setInput] = useState<TigrayTutorInput>({
    lessonUpload: undefined,
    userMessage: '',
    voiceInput: '',
    actionType: 'tutor',
  });
  const [output, setOutput] = useState<TigrayTutorOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setInput((prev) => ({ ...prev, lessonUpload: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const data: TigrayTutorOutput = await response.json();
      if (!response.ok) {
        throw new Error('Error fetching data');
      }

      setOutput(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Tigray Tutor</CardTitle>
            <CardDescription>An AI-powered educational tutor application.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="userMessage">Your Message</Label>
                <Textarea name="userMessage" value={input.userMessage} onChange={handleInputChange} />
              </div>
              <div className="mb-4 relative">
                <Label htmlFor="voiceInput">Voice Input</Label>
                <div className="flex items-center">
                  <Input 
                    type="text" 
                    name="voiceInput" 
                    value={input.voiceInput} 
                    onChange={handleInputChange}
                    placeholder="Click microphone to start speaking..."
                    className="pr-10"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="absolute right-2 hover:bg-gray-100 rounded-full p-2"
                    onClick={() => alert('Voice input feature coming soon!')}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor="lessonUpload">Lesson Upload</Label>
                <Input type="file" name="lessonUpload" onChange={handleFileChange} />
              </div>
              <div className="mb-4">
                <Label htmlFor="actionType">Action Type</Label>
                <select 
                  id="actionType"
                  name="actionType" 
                  value={input.actionType} 
                  onChange={handleInputChange}
                  aria-label="Select action type"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                >
                  <option value="tutor">Tutor</option>
                  <option value="translate">Translate</option>
                </select>
              </div>
              <Button type="submit" disabled={loading}>Submit</Button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {output && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Response:</h3>
                <p>{output.response}</p>
                <h3 className="text-lg font-semibold">Translation:</h3>
                <p>{output.translation}</p>
                <h3 className="text-lg font-semibold">Exercises:</h3>
                <ul>
                  {output.exercises.map((exercise, index) => (
                    <li key={index}>{exercise}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <footer className="mt-auto bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Yoseph Berhane</h3>
              <p className="text-gray-300">Building tools for a better tomorrow</p>
            </div>
            
            <div className="flex space-x-6">
              <a 
                href="https://github.com/yosephdev" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit Yoseph's GitHub profile"
                title="GitHub"
                className="transform hover:scale-110 transition-transform duration-200"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="https://linkedin.com/in/yoseph-berhane" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit Yoseph's LinkedIn profile"
                title="LinkedIn"
                className="transform hover:scale-110 transition-transform duration-200"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a 
                href="https://twitter.com/yosephbet" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit Yoseph's Twitter profile"
                title="Twitter"
                className="transform hover:scale-110 transition-transform duration-200"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href="mailto:contact@yoseph.dev"
                aria-label="Send email to Yoseph"
                title="Email"
                className="transform hover:scale-110 transition-transform duration-200"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Yoseph Berhane. All rights reserved.</p>
            <p className="mt-2">
              <a 
                href="https://yoseph.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                Visit yoseph.dev
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TigrayTutor;