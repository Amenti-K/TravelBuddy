import React from "react";
import { Skeleton } from "@mantine/core";

export const TripsCardSkeleton = () => {
  return (
    <div>
      <Skeleton
        height={150}
        width="100%"
        mb="sm"
        className="h-[30vw] max-h-[200px] min-h-[140px]"
      />
      <div className="flex justify-between w-full">
        <Skeleton height={20} width="50%" radius="sm" />
        <Skeleton height={20} width="25%" radius="sm" />
      </div>
      <Skeleton height={15} mt={6} radius="xl" />
      <Skeleton height={15} mt={6} width="75%" radius="xl" />
      <div className="flex justify-between w-full">
        <Skeleton height={10} mt={6} width="25%" radius="xl" />
        <Skeleton height={10} mt={6} width="25%" radius="xl" />
        <Skeleton height={10} mt={6} width="25%" radius="xl" />
      </div>
    </div>
  );
};

export const TripDetailSkeleton = () => {
  return (
    <div>
      <Skeleton
        height={250}
        width="50%"
        mb="sm"
        className="h-[50vw] max-h-[300px] min-h-[200px]"
      />
    </div>
  );
};

export const UserCardSkeleton = ({ type = "detailed" }) => {
  return (
    <Card
      withBorder
      radius="md"
      shadow="sm"
      className="w-full max-w-md bg-white dark:bg-gray-900 transition duration-300"
    >
      <Group
        align="flex-start"
        className={`gap-4 ${type === "compact" ? "items-center" : ""}`}
      >
        <Skeleton height={type === "compact" ? 40 : 60} circle />

        <Stack spacing={type === "compact" ? 4 : "xs"} className="flex-1">
          <Skeleton height={type === "compact" ? 14 : 18} width="70%" />
          {type !== "compact" && (
            <>
              <Skeleton height={12} width="40%" />
              <Skeleton height={12} width="90%" />
              <Group spacing={6}>
                <Skeleton height={20} width={60} radius="sm" />
                <Skeleton height={20} width={60} radius="sm" />
              </Group>
              <Skeleton height={8} width="100%" />
            </>
          )}
        </Stack>
      </Group>
    </Card>
  );
};

export const ChatCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between gap-4 p-2 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition duration-300">
      <Skeleton height={40} width={40} circle />
      <div className="flex flex-col flex-1 min-w-0 px-2">
        <Skeleton height={15} width="40%" radius="sm" />
        <Skeleton height={10} width="75%" radius="sm" mt={6} />
        <Skeleton height={10} width="50%" radius="sm" mt={6} />
      </div>
      <Skeleton height={25} width={25} radius="xl" />
    </div>
  );
};

export const ChatRoomSkeleton = () => {
  return (
    <div className="flex flex-col w-full justify-between mb-2">
      <div className="flex flex-col gap-y-2 items-start justify-start">
        <div className="flex flex-row items-start justify-start">
          <Skeleton height={30} mr="sm" circle />
          <Skeleton height={25} width={100} radius="md" />
        </div>
        <div className="flex flex-row items-start justify-start">
          <Skeleton height={30} mr="sm" circle />
          <Skeleton height={55} width={175} radius="md" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2 items-end">
        <Skeleton height={25} width={150} radius="md" />
        <Skeleton height={25} width={250} radius="md" />
      </div>
    </div>
  );
};
