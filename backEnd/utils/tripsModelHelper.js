exports.fetchNormalTrips = async (
  model,
  projectionFields,
  filters,
  skip,
  limit,
  today
) => {
  const match = {};
  if (filters.organizer_id) match.organizer_id = filters.organizer_id;
  if (filters.trip_status) match.trip_status = filters.trip_status;

  const data = await model.aggregate([
    { $match: match },
    {
      $addFields: {
        sortDistance: {
          $min: [
            { $abs: { $subtract: ["$departure_date", today] } },
            { $abs: { $subtract: ["$returning_date", today] } },
          ],
        },
      },
    },
    { $sort: { sortDistance: 1 } },
    { $project: projectionFields },
    { $skip: skip },
    { $limit: limit + 1 },
  ]);

  return {
    trips: data.slice(0, limit),
    hasMore: data.length > limit,
  };
};

exports.fetchDiscoverTrips = async (
  model,
  projectionFields,
  userPreferences,
  skip,
  limit,
  today = new Date()
) => {
  // Define weights for scoring
  const preferenceWeights = {
    category: 5,
    destination: 4,
    starting_location: 3,
    path: 3,
    date_match: 4,
    estimated_per_person: 3,
    agency_fee: 2,
  };

  // Build flexible match conditions
  const orConditions = [];

  if (userPreferences.category?.length) {
    orConditions.push({ category: { $in: userPreferences.category } });
  }
  if (userPreferences.destination) {
    orConditions.push({ destination: userPreferences.destination });
  }
  if (userPreferences.starting_location) {
    orConditions.push({ starting_location: userPreferences.starting_location });
  }
  if (userPreferences.path?.length) {
    orConditions.push({ path: { $in: userPreferences.path } });
  }

  // If no preferences, match all
  const match = orConditions.length > 0 ? { $or: orConditions } : {};

  const pipeline = [
    { $match: match },
    {
      $addFields: {
        sortDistance: {
          $min: [
            { $abs: { $subtract: ["$departure_date", today] } },
            { $abs: { $subtract: ["$returning_date", today] } },
          ],
        },
        recommendation_score: {
          $add: [
            // Category Score
            {
              $multiply: [
                preferenceWeights.category,
                {
                  $size: {
                    $setIntersection: [
                      "$category",
                      userPreferences.category || [],
                    ],
                  },
                },
              ],
            },
            // Destination Score
            {
              $cond: [
                { $eq: ["$destination", userPreferences.destination || null] },
                preferenceWeights.destination,
                0,
              ],
            },
            // Starting Location Score
            {
              $cond: [
                {
                  $eq: [
                    "$starting_location",
                    userPreferences.starting_location || null,
                  ],
                },
                preferenceWeights.starting_location,
                0,
              ],
            },
            // Path Score
            {
              $cond: [
                {
                  $gt: [
                    {
                      $size: {
                        $setIntersection: ["$path", userPreferences.path || []],
                      },
                    },
                    0,
                  ],
                },
                preferenceWeights.path,
                0,
              ],
            },
            // Date Score (if user specified a date)
            {
              $cond: [
                { $ne: [userPreferences.departure_date || null, null] },
                preferenceWeights.date_match,
                0,
              ],
            },
            // Estimated Cost Score
            {
              $cond: [
                {
                  $lte: [
                    "$expenses.estimated_per_person",
                    userPreferences.expenses?.estimated_per_person || Infinity,
                  ],
                },
                preferenceWeights.estimated_per_person,
                0,
              ],
            },
            // Agency Fee Score
            {
              $cond: [
                {
                  $lte: [
                    "$agency_fee.cost",
                    userPreferences.agency_fee?.cost || Infinity,
                  ],
                },
                preferenceWeights.agency_fee,
                0,
              ],
            },
          ],
        },
      },
    },
    {
      $sort: {
        recommendation_score: -1,
        sortDistance: 1,
      },
    },
    {
      $project: {
        ...projectionFields,
        recommendation_score: 1,
      },
    },
    { $skip: skip },
    { $limit: limit + 1 },
  ];

  const data = await model.aggregate(pipeline).exec();

  return {
    trips: data.slice(0, limit),
    hasMore: data.length > limit,
  };
};
