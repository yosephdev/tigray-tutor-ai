'use client';
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TigrayTutorInput {
  lessonUpload: File;
  userMessage: string;
  voiceInput: string;
  actionType: 'translate' | 'tutor';
}

interface TigrayTutorOutput {
  response: string;
  translation: string;
  exercises: Array<string>;
  progress: { subject: string; completed: number; total: number; };
}

const TigrayTutor: React.FC = () => {
  const [input, setInput] = useState<TigrayTutorInput>({
    lessonUpload: null,
    userMessage: '',
    voiceInput: '',
    actionType: 'tutor',
  });
  const [output, setOutput] = useState<TigrayTutorOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setInput((prev) => ({ ...prev, lessonUpload: e.target.files[0] }));
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
        throw new Error(data.message || 'Error fetching data');
      }

      setOutput(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
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
            <div className="mb-4">
              <Label htmlFor="voiceInput">Voice Input</Label>
              <Input type="text" name="voiceInput" value={input.voiceInput} onChange={handleInputChange} />
            </div>
            <div className="mb-4">
              <Label htmlFor="lessonUpload">Lesson Upload</Label>
              <Input type="file" name="lessonUpload" onChange={handleFileChange} />
            </div>
            <div className="mb-4">
              <Label htmlFor="actionType">Action Type</Label>
              <select name="actionType" value={input.actionType} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200">
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
  );
};

export default TigrayTutor;