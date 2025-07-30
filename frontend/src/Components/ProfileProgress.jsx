import { Stepper } from "@mantine/core";

const ProfileProgress = ({ step }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <Stepper
        active={step - 1}
        allowNextStepsSelect={false}
        size="xs" // Default small size, will scale up with CSS
        orientation="horizontal" // Always horizontal
        // className="flex flex-nowrap justify-between" // Ensures responsiveness
      >
        {[
          { label: "Create Account", description: "Authenticate user" },
          { label: "Personalize Profile", description: "Add personal details" },
          { label: "Add Interests", description: "Choose your preferences" },
        ].map((step, index) => (
          <Stepper.Step
            key={index}
            label={
              <span className="text-[10px] sm:text-xs md:text-sm">
                {step.label}
              </span>
            }
            description={
              <span className="hidden sm:inline text-xs">
                {step.description}
              </span>
            }
            iconSize={20} // Small default size
            className="flex flex-col items-center sm:flex-row"
          />
        ))}
        <Stepper.Completed>
          <span className="text-xs sm:text-sm">Profile setup completed!</span>
        </Stepper.Completed>
      </Stepper>
    </div>
  );
};

export default ProfileProgress;
