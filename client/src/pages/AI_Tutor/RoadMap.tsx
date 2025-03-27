import { fetchRoadmapByID, generateContent } from "@/api/aiTutorApi";
import { ILesson, IRoadMap } from "@/types/aitutor";
import { ErrorResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { ScrollArea } from "@/components/ui/scroll-area";

const RoadMap: React.FC = () => {
  const navigate = useNavigate();
  const { topicId } = useParams<{ topicId: string }>();
  const [roadmap, setRoadmap] = useState<IRoadMap>();

  useEffect(() => {
    const getRoadmap = async () => {
      const response = await fetchRoadmapByID(topicId);
      setRoadmap(response.data);
    };

    getRoadmap();
  }, [topicId]);

  const contentMutation = useMutation({
    mutationFn: generateContent,
    onSuccess: (res) => {
      console.log(res.data);
      navigate(`/placementprep/lesson/${res.data._id}`);
    },
    onError: (error: AxiosError) => {
      const errResponse = error.response?.data as ErrorResponse;
      console.log(errResponse);
    },
  });

  const handleSubmit = (roadmap: ILesson) => {
    console.log({ ...roadmap, roadmapId: topicId });
    contentMutation.mutate({ ...roadmap, roadMapId: topicId });
  };

  return (
    <>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-2xl font-bold">Road Map</legend>
        <ScrollArea className="w-full h-[650px] rounded-md border">
          {contentMutation.isPending ? (
            <div className="flex flex-col justify-center items-center gap-2 h-[70vh]">
              <HashLoader color="#36d7b7" />
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Generating Content...
              </p>
            </div>
          ) : (
            <div className="timeline">
              {roadmap?.RoadMap?.map((roadmap, index) => (
                <div
                  key={index}
                  className={`timeline__event  animated fadeInUp delay-3s timeline__event--type${
                    (index % 4) + 1
                  }`}
                >
                  <div className="timeline__event__icon "></div>
                  <div className="timeline__event__date ">
                    {roadmap.lessonNumber}
                  </div>
                  <div className="timeline__event__content ">
                    <div
                      className="timeline__event__title cursor-pointer"
                      onClick={() => handleSubmit(roadmap)}
                    >
                      {roadmap.lessonName}
                    </div>
                    <div className="timeline__event__description">
                      <p>{roadmap.objective}</p>
                      <ul className=" pl-5 pt-1 max-w-xl space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                        {roadmap.topic.map((topic) => (
                          <li>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </fieldset>
    </>
  );
};

export default RoadMap;
