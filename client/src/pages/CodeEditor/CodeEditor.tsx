"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  ChevronRight,
  Info,
  AlertCircle,
  Settings,
  Minus,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "next-themes";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { set } from "react-hook-form";

// Sample code templates for different languages
const codeTemplates = {
  cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
  // Write your solution here
}

int main() {
  vector<int> nums = {2, 7, 11, 15};
  int target = 9;
  vector<int> result = twoSum(nums, target);
  cout << "[" << result[0] << ", " << result[1] << "]" << endl;
  return 0;
}`,
  python: `def two_sum(nums, target):
    # Write your solution here
    pass

# Test case
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))`,
  java: `import java.util.*;

public class TwoSum {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{0, 0};
    }
    
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println("[" + result[0] + ", " + result[1] + "]");
    }
}`,
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your solution here
};

// Test case
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target));`,
};

const Question = {
  problemDescription: {
    intro:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.",
    assumptions: [
      "You may assume that each input would have exactly one solution.",
      "You may not use the same element twice.",
    ],
    output: "You can return the answer in any order.",
  },
  examples: [
    {
      input: {
        nums: [2, 7, 11, 15],
        target: 9,
      },
      output: [0, 1],
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: {
        nums: [3, 2, 4],
        target: 6,
      },
      output: [1, 2],
    },
    {
      input: {
        nums: [3, 3],
        target: 6,
      },
      output: [0, 1],
    },
  ],
  constraints: {
    numsLength: {
      min: 2,
      max: 10000,
    },
    numsValueRange: {
      min: -1000000000,
      max: 1000000000,
    },
    targetRange: {
      min: -1000000000,
      max: 1000000000,
    },
    onlyOneSolution: true,
  },
  followUp: {
    question:
      "Can you come up with an algorithm that is less than O(n²) time complexity?",
  },
};

// Sample outputs for different languages
const sampleOutputs = {
  cpp: {
    success: "Output:\n[0, 1]\n\nExecution Time: 4ms\nMemory Usage: 8.2MB",
    error:
      "Compilation Error:\nmain.cpp:5:1: error: function 'vector<int> twoSum(std::vector<int>&, int)' should return a value\n\nExecution Time: 0ms\nMemory Usage: 0MB",
    failed:
      "Output:\nIncorrect result\n\nTest Case 1 Failed:\nExpected: [0, 1]\nActual: Different result",
  },
  python: {
    success: "Output:\n[0, 1]\n\nExecution Time: 12ms\nMemory Usage: 14.1MB",
    error:
      'Traceback (most recent call last):\n  File "main.py", line 8, in <module>\n    print(two_sum(nums, target))\n  File "main.py", line 3, in two_sum\n    pass\nTypeError: \'NoneType\' object is not subscriptable\n\nExecution Time: 0ms\nMemory Usage: 0MB',
    failed:
      "Output:\nNone\n\nTest Case 1 Failed:\nExpected: [0, 1]\nActual: None",
  },
  java: {
    success: "Output:\n[0, 1]\n\nExecution Time: 6ms\nMemory Usage: 39.5MB",
    error:
      "Error: Main method not found in class TwoSum, please define the main method as:\n   public static void main(String[] args)\n\nExecution Time: 0ms\nMemory Usage: 0MB",
    failed:
      "Output:\n[0, 0]\n\nTest Case 1 Failed:\nExpected: [0, 1]\nActual: [0, 0]",
  },
  javascript: {
    success: "Output:\n[0, 1]\n\nExecution Time: 52ms\nMemory Usage: 33.9MB",
    error:
      "ReferenceError: solution is not defined\n    at twoSum (main.js:7)\n    at Object.<anonymous> (main.js:12)\n\nExecution Time: 0ms\nMemory Usage: 0MB",
    failed:
      "Output:\nundefined\n\nTest Case 1 Failed:\nExpected: [0, 1]\nActual: undefined",
  },
};

// Available themes
const themes = [
  { name: "Light", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "Monokai", value: "monokai" },
  { name: "Solarized", value: "solarized" },
];

// Available fonts
const fonts = [
  { name: "Consolas", value: "Consolas, monospace" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Fira Code", value: "Fira Code, monospace" },
  { name: "JetBrains Mono", value: "JetBrains Mono, monospace" },
  { name: "Source Code Pro", value: "Source Code Pro, monospace" },
];

export default function CodingPlatform() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(codeTemplates.cpp);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [editorTheme, setEditorTheme] = useState("vs-light");
  const [selectedFont, setSelectedFont] = useState(fonts[0].value);
  const [fontSize, setFontSize] = useState(14);
  const [consoleFontSize, setConsoleFontSize] = useState(14);
  const [consoleHeight, setConsoleHeight] = useState(30);
  const [settingsOpen, setSettingsOpen] = useState(false);
  //   const [output, setOutput] = useState<string | null>(null);
  //   const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<any>(null);

  // Update editor theme when app theme changes
  useEffect(() => {
    switch (theme) {
      case "light":
        setEditorTheme("vs");
        break;
      case "dark":
        setEditorTheme("vs-dark");
        break;
      case "monokai":
        setEditorTheme("monokai");
        break;
      case "solarized":
        setEditorTheme("solarized-dark");
        break;
      default:
        setEditorTheme("vs");
    }
  }, [theme]);

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(codeTemplates[newLanguage]);
    setOutput("");
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("");

    // Simulate code execution with a delay
    setTimeout(() => {
      // Check for specific patterns in the code to determine output
      if (
        code.includes("return") &&
        (code.includes("[0, 1]") ||
          code.includes("result[0]") ||
          code.includes("new int[]{0, 1}"))
      ) {
        setOutput(sampleOutputs[language].success);
      } else if (
        !code.includes("return") ||
        code.includes("// Write your solution here") ||
        code.includes("pass")
      ) {
        setOutput(sampleOutputs[language].error);
      } else {
        setOutput(sampleOutputs[language].failed);
      }
      setIsRunning(false);
    }, 1500);
  };

  // Get console background color based on theme
  const getConsoleBackground = () => {
    switch (theme) {
      case "light":
        return "bg-gray-100 text-gray-900";
      case "dark":
        return "bg-gray-900 text-gray-100";
      case "monokai":
        return "bg-[#272822] text-[#f8f8f2]";
      case "solarized":
        return "bg-[#002b36] text-[#839496]";
      default:
        return "bg-black text-white";
    }
  };

  // Handle font size change
  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
  };

  // Handle console font size change
  const handleConsoleFontSizeChange = (newSize) => {
    setConsoleFontSize(newSize);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    setOutput("");

    const submissionData = {
      question: Question.problemDescription.intro,
      answer: code,
      language: language,
    };

    try {
      console.log("Sending request with data:", submissionData);

      const res = await fetch("http://localhost:8000/api/v1/code/evaluate", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      console.log("Raw response:", res);
      console.log("Response status:", res.status);
      console.log(
        "Response headers:",
        Object.fromEntries(res.headers.entries())
      );

      if (res.ok) {
        const responseData = await res.json();
        console.log("Response data:", responseData);
        setEvaluation(responseData.evaluation);

        if (!responseData.evaluation) {
          console.error("Missing evaluation in response:", responseData);
          setOutput("Invalid response format from server");
          return;
        }

        const evaluation = responseData.evaluation;
        console.log("Evaluation details:", {
          isCorrect: evaluation.is_correct,
          errorType: evaluation.error_type,
          testCases: evaluation.test_cases,
          codeReview: evaluation.code_review,
          suggestions: evaluation.suggestions,
        });

        // Format the output based on evaluation
        let formattedOutput = "";

        // Add test case results
        formattedOutput += "Test Cases:\n";
        evaluation.test_cases.forEach((test: any, index: number) => {
          formattedOutput += `Test ${index + 1}:\n`;
          formattedOutput += `Input: ${test.input}\n`;
          formattedOutput += `Expected: ${test.expected}\n`;
          formattedOutput += `Actual: ${test.actual}\n`;
          formattedOutput += `Status: ${
            test.passed ? "Passed ✓" : "Failed ✗"
          }\n\n`;
        });

        // Add error message if present
        if (evaluation.error_message) {
          formattedOutput += `Error: ${evaluation.error_type}\n`;
          formattedOutput += `${evaluation.error_message}\n\n`;
        }

        // Add code review
        formattedOutput += "Code Review:\n";
        Object.entries(evaluation.code_review).forEach(
          ([category, review]: [string, any]) => {
            formattedOutput += `${
              category.charAt(0).toUpperCase() + category.slice(1)
            }:\n`;
            formattedOutput += `Rating: ${review.rating}\n`;
            review.comments.forEach((comment: string) => {
              formattedOutput += `- ${comment}\n`;
            });
            formattedOutput += "\n";
          }
        );

        // Add suggestions
        formattedOutput += "Suggestions:\n";
        evaluation.suggestions.forEach((suggestion: string) => {
          formattedOutput += `• ${suggestion}\n`;
        });

        setOutput(formattedOutput);
      } else {
        const errorText = await res.text();
        console.error("Response not OK:", {
          status: res.status,
          statusText: res.statusText,
          body: errorText,
        });
        setOutput("Failed to submit code. Please try again.");
      }
    } catch (err) {
      console.error("Error details:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
      setOutput("An error occurred while submitting the code.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">CodeChallenger</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Problems
          </Button>
          <Button variant="outline" size="sm">
            Submissions
          </Button>

          {/* Settings Popover */}
          <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Theme</h4>
                  <div className="flex flex-wrap gap-2">
                    {themes.map((t) => (
                      <Button
                        key={t.value}
                        variant={theme === t.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme(t.value)}
                        className="flex-1"
                      >
                        {t.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Font</h4>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    style={{ fontFamily: selectedFont }}
                  >
                    {fonts.map((font) => (
                      <option
                        key={font.value}
                        value={font.value}
                        style={{ fontFamily: font.value }}
                      >
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium leading-none">
                      Editor Font Size: {fontSize}px
                    </h4>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          handleFontSizeChange(Math.max(8, fontSize - 1))
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          handleFontSizeChange(Math.min(24, fontSize + 1))
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Slider
                    value={[fontSize]}
                    min={8}
                    max={24}
                    step={1}
                    onValueChange={(value) => handleFontSizeChange(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium leading-none">
                      Console Font Size: {consoleFontSize}px
                    </h4>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          handleConsoleFontSizeChange(
                            Math.max(8, consoleFontSize - 1)
                          )
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          handleConsoleFontSizeChange(
                            Math.min(24, consoleFontSize + 1)
                          )
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Slider
                    value={[consoleFontSize]}
                    min={8}
                    max={24}
                    step={1}
                    onValueChange={(value) =>
                      handleConsoleFontSizeChange(value[0])
                    }
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Language</h4>
                  <div className="flex flex-wrap gap-2">
                    {["cpp", "python", "java", "javascript"].map((lang) => (
                      <Button
                        key={lang}
                        variant={language === lang ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleLanguageChange(lang)}
                        className="flex-1"
                      >
                        {lang === "cpp"
                          ? "C++"
                          : lang === "javascript"
                          ? "JS"
                          : lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="sm">
            Profile
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Problem Statement Panel */}
        <div className="w-2/5 border-r overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">1. Two Sum</h2>
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
            >
              Easy
            </Badge>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p>
              Given an array of integers <code>nums</code> and an integer{" "}
              <code>target</code>, return
              <em>
                {" "}
                indices of the two numbers such that they add up to target
              </em>
              .
            </p>
            <p>
              You may assume that each input would have{" "}
              <strong>exactly one solution</strong>, and you may not use the
              same element twice.
            </p>
            <p>You can return the answer in any order.</p>

            <h3>Example 1:</h3>
            <pre className="bg-muted p-4 rounded-md">
              <code>
                {`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}
              </code>
            </pre>

            <h3>Example 2:</h3>
            <pre className="bg-muted p-4 rounded-md">
              <code>
                {`Input: nums = [3,2,4], target = 6
Output: [1,2]`}
              </code>
            </pre>

            <h3>Example 3:</h3>
            <pre className="bg-muted p-4 rounded-md">
              <code>
                {`Input: nums = [3,3], target = 6
Output: [0,1]`}
              </code>
            </pre>

            <h3>Constraints:</h3>
            <ul>
              <li>
                2 ≤ nums.length ≤ 10<sup>4</sup>
              </li>
              <li>
                -10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup>
              </li>
              <li>
                -10<sup>9</sup> ≤ target ≤ 10<sup>9</sup>
              </li>
              <li>
                <strong>Only one valid answer exists.</strong>
              </li>
            </ul>

            <h3>Follow-up:</h3>
            <p>
              Can you come up with an algorithm that is less than O(n²) time
              complexity?
            </p>
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <Tabs defaultValue={language} value={language} className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger
                    value="cpp"
                    onClick={() => handleLanguageChange("cpp")}
                  >
                    C++
                  </TabsTrigger>
                  <TabsTrigger
                    value="python"
                    onClick={() => handleLanguageChange("python")}
                  >
                    Python
                  </TabsTrigger>
                  <TabsTrigger
                    value="java"
                    onClick={() => handleLanguageChange("java")}
                  >
                    Java
                  </TabsTrigger>
                  <TabsTrigger
                    value="javascript"
                    onClick={() => handleLanguageChange("javascript")}
                  >
                    JavaScript
                  </TabsTrigger>
                </TabsList>
                <Button
                  onClick={handleCodeSubmit}
                  disabled={isRunning}
                  className="gap-2"
                >
                  {isRunning ? "Running..." : "Run Code"}
                  <Play
                    size={16}
                    className={isRunning ? "animate-pulse" : ""}
                  />
                </Button>
              </div>

              {["cpp", "python", "java", "javascript"].map((lang) => (
                <TabsContent key={lang} value={lang} className="mt-0">
                  <div className="h-[calc(75vh-13rem)] border rounded-md overflow-hidden mt-4">
                    <Editor
                      height="100%"
                      defaultLanguage={
                        lang === "javascript" ? "javascript" : lang
                      }
                      language={lang === "javascript" ? "javascript" : lang}
                      value={code}
                      onChange={(value) => setCode(value || "")}
                      theme={editorTheme}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        fontFamily: selectedFont,
                        fontLigatures:
                          selectedFont.includes("Fira Code") ||
                          selectedFont.includes("JetBrains Mono"),
                      }}
                    />
                  </div>
                </TabsContent>
              ))}
              {/* output must be here */}
              {/* <div
                className={`${getConsoleBackground()} p-4 h-full overflow-auto font-mono text-sm rounded-md m-4 shadow-md transition-colors duration-200`}
                style={{ fontFamily: selectedFont }}
              >
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <ChevronRight size={16} />
                  <span>Console</span>
                  <Separator
                    orientation="vertical"
                    className="h-4 bg-current opacity-20"
                  />
                  {output.includes("Error") && (
                    <div className="flex items-center gap-1 text-red-400">
                      <AlertCircle size={14} />
                      <span>Error</span>
                    </div>
                  )}
                  {output.includes("Failed") && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Info size={14} />
                      <span>Test Failed</span>
                    </div>
                  )}
                  {output.includes("[0, 1]") && !output.includes("Failed") && (
                    <div className="flex items-center gap-1 text-green-400">
                      <Info size={14} />
                      <span>Success</span>
                    </div>
                  )}
                </div>
                <pre className="whitespace-pre-wrap">
                  {isRunning
                    ? "Running code..."
                    : `output || Click 'Run Code' to execute your ${language.toUpperCase()} solution}`}
                </pre>
              </div> */}
              <ScrollArea>
                <div
                  className={`${getConsoleBackground()} p-4 h-full overflow-auto font-mono text-sm rounded-md m-4 shadow-md transition-colors duration-200`}
                  style={{ fontFamily: selectedFont }}
                >
                  <div className="flex items-center gap-2 mb-2 opacity-80">
                    <ChevronRight size={16} />
                    <span>Console</span>
                    <Separator
                      orientation="vertical"
                      className="h-4 bg-current opacity-20"
                    />
                    {output.includes("Error") && (
                      <div className="flex items-center gap-1 text-red-400">
                        <AlertCircle size={14} />
                        <span>Error</span>
                      </div>
                    )}
                    {output.includes("Failed") && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Info size={14} />
                        <span>Test Failed</span>
                      </div>
                    )}
                    {output.includes("[0, 1]") &&
                      !output.includes("Failed") && (
                        <div className="flex items-center gap-1 text-green-400">
                          <Info size={14} />
                          <span>Success</span>
                        </div>
                      )}
                  </div>

                  {isRunning ? (
                    <div className="flex items-center justify-center p-4">
                      <span className="animate-pulse">Running code...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Error Message Section */}
                      {evaluation?.error_message && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                          <div className="font-semibold text-red-600 dark:text-red-400">
                            {evaluation.error_type}
                          </div>
                          <div className="text-red-700 dark:text-red-300">
                            {evaluation.error_message}
                          </div>
                        </div>
                      )}

                      {/* Test Cases Section */}
                      <div className="space-y-2">
                        <div className="font-semibold">Test Cases:</div>
                        {evaluation?.test_cases?.map((test, index) => (
                          <div
                            key={index}
                            className="border rounded-md p-2 bg-background/50"
                          >
                            <div className="flex justify-between items-center">
                              <span>Test {index + 1}</span>
                              {test.passed ? (
                                <span className="text-green-500">✓ Passed</span>
                              ) : (
                                <span className="text-red-500">✗ Failed</span>
                              )}
                            </div>
                            <div className="text-sm opacity-80">
                              <div>Input: {test.input}</div>
                              <div>Expected: {test.expected}</div>
                              <div>Actual: {test.actual ?? "null"}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Code Review Section */}
                      {evaluation?.code_review && (
                        <div className="space-y-2">
                          <div className="font-semibold">Code Review:</div>
                          {Object.entries(evaluation.code_review).map(
                            ([category, review]: [string, any]) => (
                              <div
                                key={category}
                                className="border rounded-md p-2"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="capitalize">{category}</span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${
                                      review.rating === "excellent"
                                        ? "bg-green-100 text-green-800"
                                        : review.rating === "good"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {review.rating
                                      .replace("_", " ")
                                      .toUpperCase()}
                                  </span>
                                </div>
                                <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                                  {review.comments.map(
                                    (comment: string, i: number) => (
                                      <li key={i} className="opacity-80">
                                        {comment}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {/* Suggestions Section */}
                      {evaluation?.suggestions?.length > 0 && (
                        <div className="space-y-2">
                          <div className="font-semibold">Suggestions:</div>
                          <ul className="list-disc list-inside space-y-1">
                            {evaluation.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-sm opacity-80">
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
