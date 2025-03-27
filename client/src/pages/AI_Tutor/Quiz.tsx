import { fetchQuiz } from "@/api/aiTutorApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const Quiz: React.FC = () => {

  const [quiz, setQuiz] = useState([])

  useEffect(() => {
    const fetchLearnings = async () => {
      const response = await fetchQuiz();
      setQuiz(response.data);
      console.log(response.data);
    };
    fetchLearnings();
  }, []);

  return (
    <>
    {quiz.length === 0 ? <h1>You have not generated any quiz yet</h1> :<div>{
      quiz.map((quiz)=>(
        <Link
        key={quiz._id}
        to={`${quiz._id}`}
        className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
      >
        <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

        <div className="sm:flex sm:justify-between sm:gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
             {quiz.testName}
            </h3>

            <p className="mt-1 text-xs font-medium text-gray-600">
              Total Questions - {quiz.questions.length}
            </p>
          </div>

        </div>

        <div className="mt-4">
          <p className="text-pretty text-sm text-gray-500">
          {quiz.testDescription}
          </p>
        </div>

        <dl className="mt-6 flex gap-4 sm:gap-6 justify-between">
          <div className="flex gap-7">
            <div className="flex flex-col-reverse">
              <dt className="text-sm font-medium text-gray-600">
                Created At
              </dt>
              <dd className="text-xs text-gray-500">
              {moment(quiz.createdAt).format("DD MMM, YYYY")}
              </dd>
            </div>

            <div className="flex flex-col-reverse">
              <dt className="text-sm font-medium text-gray-600">
                Attempted
              </dt>
              <dd className="text-xs text-gray-500">False</dd>
            </div>
          </div>
        </dl>
      </Link>
      ))
     }</div>}
     
    </>
  );
};

export default Quiz;
