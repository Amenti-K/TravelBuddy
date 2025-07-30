import { Alert } from "@mantine/core";

const OfflineBanner = () => (
  <Alert color="red" title="Offline" className="fixed bottom-0 w-full z-50">
    You are offline. Some features may not work. Trying to reconnect...
  </Alert>
);

export default OfflineBanner;
