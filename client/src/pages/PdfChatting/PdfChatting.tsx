import React, { FormEvent, useState } from "react";
import {
  Settings,
  Share,
  CornerDownLeft,
  Paperclip,
  Mic,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "react-toastify";
import { toastOptions } from "@/config/toast";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "@/types/auth";
import { AxiosError } from "axios";
import HashLoader from "react-spinners/HashLoader";
import BeatLoader from "react-spinners/BeatLoader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { askQuestions, uploadPdf } from "@/api/pdfChatApi";

const PdfChatting: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState("");
  const [messages, setMessages] = useState("");
  const [responses, setresponses] = useState<string[]>([]);
  const [isUploaded, setIsuploaded] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPdfFile(file);
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreviewUrl(fileURL);
    } else {
      setPreviewUrl("");
    }
  };

  const uploadMutation = useMutation({
    mutationFn: uploadPdf,
    onSuccess: () => {
      setIsuploaded(true);
      toast.success("Pdf Uploaded Successfully!", toastOptions);
    },
    onError: (error: AxiosError) => {
      const errResponse = error.response?.data as ErrorResponse;
      console.log(errResponse);
      toast.error("Error uploading the pdf!", toastOptions);
    },
  });

  const handleSubmit = async () => {
    if (!pdfFile) {
      toast.error("Please select the pdf", toastOptions);
      return;
    }
    const formData = new FormData();
    formData.append("files", pdfFile);
    uploadMutation.mutate(formData);
  };

  const questionMutation = useMutation({
    mutationFn: askQuestions,
    onSuccess: (response) => {
      setresponses((prev) => [...prev, response.data.reply]);
    },
    onError: (error: AxiosError) => {
      const errResponse = error.response?.data as ErrorResponse;
      console.log(errResponse);
      toast.error("Error while generating the response from AI", toastOptions);
    },
  });

  const handleMessages = async (e: FormEvent) => {
    e.preventDefault();
    setMessages("");
    setresponses([...responses, messages]);
    questionMutation.mutate(messages);
  };

  return (
    <>
      {uploadMutation.isPending ? (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center ">
          <HashLoader color="#36d7b7" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Uploading Pdf...
          </p>
        </div>
      ) : (
        ""
      )}
      <div className="grid h-screen w-full ">
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
            <h1 className="text-xl font-semibold">Chat With Your PDF</h1>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Settings className="size-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[80vh]">
                <DrawerHeader>
                  <DrawerTitle>Choose PDF to chat with</DrawerTitle>
                </DrawerHeader>
                <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                  <fieldset className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">
                      Upload PDF
                    </legend>
                    <div className="grid gap-3">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="pdffile">Pdf file</Label>
                        <Input
                          id="pdffile"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </fieldset>
                  <fieldset className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">
                      Preview
                    </legend>
                    <div className="p-4">
                      {previewUrl ? (
                        <embed src={previewUrl} className="h-[30vh]" />
                      ) : (
                        <p>No PDF selected</p>
                      )}
                    </div>
                  </fieldset>
                  <div className="grid gap-3">
                    <Button onClick={handleSubmit} variant="outline">
                      SUBMIT
                    </Button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto gap-1.5 text-sm"
            >
              <Share className="size-3.5" />
              Share
            </Button>
          </header>
          <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              className="relative hidden flex-col items-start gap-8 md:flex"
              x-chunk="dashboard-03-chunk-0"
            >
              <div className="grid w-full items-start gap-6">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Upload PDF
                  </legend>
                  <div className="grid gap-3">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="pdffile">Pdf file</Label>
                      <Input
                        id="pdffile"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </fieldset>
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Preview
                  </legend>
                  <div className="p-4">
                    {previewUrl ? (
                      <embed src={previewUrl} className="h-[42vh] w-[25vw]" />
                    ) : (
                      <p>No PDF selected</p>
                    )}
                  </div>
                </fieldset>
                <div className="grid gap-3">
                  {isUploaded ? (
                    <Button
                      className="bg-emerald-200 text-black"
                      variant="outline"
                      disabled
                    >
                      Pdf Processed Successfully
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} variant="outline">
                      SUBMIT
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
              <Badge variant="outline" className="absolute right-3 top-3">
                Output
              </Badge>
              <ScrollArea className="h-[65vh] rounded-md border p-4">
                <div className="flex flex-col gap-3">
                  {responses.map((message) => (
                    <Alert>
                      <Terminal className="h-4 w-4" />
                      <AlertTitle>Chat:</AlertTitle>
                      <AlertDescription>
                        <ReactMarkdown>{message}</ReactMarkdown>
                      </AlertDescription>
                    </Alert>
                  ))}
                  {questionMutation.isPending ? (
                    <div className="flex flex-col items-center justify-center">
                      <BeatLoader color="#36d7b7" size={10} />
                      <span className="animate-pulse text-sm">Thinking</span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </ScrollArea>
              <div className="flex-1" />
              <form
                className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
                x-chunk="dashboard-03-chunk-1"
              >
                <Label htmlFor="message" className="sr-only">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={messages}
                  onChange={(e) => setMessages(e.target.value)}
                  placeholder="Type your message here..."
                  className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center p-3 pt-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Paperclip className="size-4" />
                          <span className="sr-only">Attach file</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Attach File</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Mic className="size-4" />
                          <span className="sr-only">Use Microphone</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Use Microphone</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    onClick={handleMessages}
                    size="sm"
                    className="ml-auto gap-1.5"
                  >
                    Send Message
                    <CornerDownLeft className="size-3.5" />
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default PdfChatting;
