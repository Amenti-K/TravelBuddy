import React, { useState, useEffect } from "react";
import { SimpleGrid } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { addInterests } from "../../store/slices/profileSlice";
import InterestsCheckBox from "../InterestsCheckBox";

// Mock data without icons for now
const interestOptions = [
  { title: "Beach Vacation", description: "Sun and sea", category: "beach" },
  { title: "City Trips", description: "Sightseeing", category: "cultural" },
  { title: "Hiking", description: "Mountains", category: "adventure" },
  { title: "Winter Sports", description: "Snow and ice", category: "snow" },
  {
    title: "Flying Adventures",
    description: "Air travel",
    category: "adventure",
  },
  {
    title: "Forest Trekking",
    description: "Nature lovers",
    category: "nature",
  },
  {
    title: "Travel Photography",
    description: "Photography",
    category: "photography",
  },
  { title: "Car Travel", description: "Road trips", category: "roadtrip" },
  { title: "Campfire Nights", description: "Camping", category: "camping" },
  { title: "Surfing", description: "Water sports", category: "adventure" },
  { title: "Running & Jogging", description: "Adventure", category: "sports" },
  { title: "Cruise Trips", description: "Ocean travel", category: "cruise" },
  {
    title: "Skiing & Snowboarding",
    description: "Skiing fun",
    category: "snow",
  },
  { title: "Music Festivals", description: "Festivals", category: "festival" },
  {
    title: "Sunny Destinations",
    description: "Summer travels",
    category: "relaxation",
  },
  {
    title: "Mountain Hiking",
    description: "Off-road adventure",
    category: "adventure",
  },
  {
    title: "Hot Air Balloon",
    description: "Unique experience",
    category: "adventure",
  },
  { title: "Kayaking", description: "Extreme sports", category: "extreme" },
  {
    title: "Sunbathing",
    description: "Relaxing on beaches",
    category: "relaxation",
  },
  { title: "Tent Camping", description: "Outdoor living", category: "camping" },
  {
    title: "Compass Navigation",
    description: "Exploration",
    category: "adventure",
  },
  {
    title: "Travel Around the World",
    description: "World tours",
    category: "luxury",
  },
  {
    title: "Jungle Safari",
    description: "Wildlife trips",
    category: "wildlife",
  },
  { title: "Parachute Jumps", description: "Skydiving", category: "extreme" },
];

const Interests = ({ setSelectedInterests }) => {
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleInterest = (optionTitle) => {
    setSelectedOptions((prev) =>
      prev.includes(optionTitle)
        ? prev.filter((t) => t !== optionTitle)
        : [...prev, optionTitle]
    );
  };

  useEffect(() => {
    const selectedObjs = interestOptions.filter((opt) =>
      selectedOptions.includes(opt.title)
    );
    const uniqueCategories = [
      ...new Set(selectedObjs.map((opt) => opt.category)),
    ];
    setSelectedInterests(uniqueCategories);
    dispatch(addInterests(uniqueCategories));
  }, [selectedOptions, setSelectedInterests, dispatch]);

  return (
    <div className="w-full max-w-screen-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Select Your Travel Interests
      </h1>
      <div className="overflow-x-auto">
        <SimpleGrid
          cols={4}
          spacing="lg"
          breakpoints={[
            { maxWidth: "md", cols: 2 },
            { maxWidth: "sm", cols: 1 },
          ]}
        >
          {interestOptions.map((item) => (
            <InterestsCheckBox
              key={item.title}
              {...item}
              defaultChecked={selectedOptions.includes(item.title)}
              onChange={toggleInterest}
            />
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
};

export default Interests;
