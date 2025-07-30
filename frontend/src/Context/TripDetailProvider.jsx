import { useSelector } from "react-redux";
const TripDetailContext = createContext();
export const useTripDetail = () => useContext(TripDetailContext);
export const TripDetailProvider = ({ children }) => {
  const { user_type, user_id, agency_id } = useSelector(
    (state) => state.auth.userProfile
  );
  const userId = user_type === "agency" ? agency_id : user_id;

  return (
    <TripDetailContext.Provider value={{}}>
      {children}
    </TripDetailContext.Provider>
  );
};
