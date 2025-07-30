import { Button } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";

const messages = {
  404: {
    title: "Page Not Found",
    message: "The page you're looking for doesn't exist.",
  },
  server: {
    title: "Server Error",
    message: "Something went wrong on our side.",
  },
  default: {
    title: "Error",
    message: "An unexpected error occurred.",
  },
};

const ErrorPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const error = messages[type] || messages.default;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-2">{error.title}</h1>
      <p className="mb-4 text-gray-600">{error.message}</p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );
};

export default ErrorPage;
