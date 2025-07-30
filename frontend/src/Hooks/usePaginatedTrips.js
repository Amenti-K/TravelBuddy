import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyCreatedTrips, getDiscoverAndFilter } from "../Api/trips.api";

export const usePaginatedTrips = ({
  type = "myTrips",
  queryFilters = {},
  enabled = true,
  organizerId,
}) => {
  const fetchFunction = ({ pageParam = 1 }) => {
    if (type === "myTrips") {
      return getMyCreatedTrips({ pageParam });
    } else if (type === "discover") {
      return getDiscoverAndFilter({ pageParam, queryFilters });
    }
  };

  return useInfiniteQuery({
    queryKey: [type, organizerId, queryFilters],
    queryFn: fetchFunction,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
