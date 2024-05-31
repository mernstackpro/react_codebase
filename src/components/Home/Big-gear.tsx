import { useGetCompetitionMutation } from "../../redux/queries";
import { useEffect, useState } from "react";
import { CompetitionType, QunatityType } from "../../types";
import Loader from "../../common/Loader";
import SwiperSlideComponent from "./SwiperSlide";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  UPDATE_CART_KEY,
  cartError,
  handleAddToCart,
  navigateCompetition,
} from "../../utils";
import { toast } from "react-hot-toast";
import { RootState } from "../../redux/store";

const CACHE_KEY = "bigGear";
const CACHE_TIMEOUT = 60 * 1000; // 10 minutes in milliseconds

const BigGear = () => {
  const [mutate, { isLoading }] = useGetCompetitionMutation();
  const [quantities, setQuantities] = useState<QunatityType>({});
  const [competitions, setCompetitions] = useState<CompetitionType[]>([]);
  const [cartKeys, setCartKeys] = useState<{ [key: number]: { key: string } }>(
    {}
  );
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  useEffect(() => {
    const keys = localStorage.getItem(UPDATE_CART_KEY) as string;
    const parsedKeys = keys ? JSON.parse(keys) : {};
    setCartKeys(parsedKeys);
  }, [cartItems]);

  //* quanitity setter function
  const handleQuantitySetter = (competitions: CompetitionType[]) => {
    const initialQuantities: QunatityType = {};
    competitions.forEach((competition) => {
      initialQuantities[competition.id] = parseInt(competition.quantity);
      setQuantities(initialQuantities);
    });
  };

  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`);
    const currentTime = new Date().getTime();

    if (cachedData && cachedTimestamp) {
      const timeDiff = currentTime - parseInt(cachedTimestamp, 10);
      if (timeDiff < CACHE_TIMEOUT) {
        const parsedCompetitions: CompetitionType[] = JSON.parse(cachedData);
        setCompetitions(parsedCompetitions);
        handleQuantitySetter(parsedCompetitions);
        return;
      }
    }
    const fetchInstantWinCompetitons = async () => {
      try {
        const res: any = await mutate({
          limit: 5,
          category: "the_big_gear",
          order_by: "id",
          order: "desc",
          token: VITE_TOKEN,
          status: "Open",
        });
        if (!res.error) {
          setCompetitions(res.data.data);
          handleQuantitySetter(res.data.data);
          localStorage.setItem(CACHE_KEY, JSON.stringify(res.data.data));
          localStorage.setItem(
            `${CACHE_KEY}_timestamp`,
            currentTime.toString()
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchInstantWinCompetitons();
  }, []);

  //todo handle quantity change of a competition
  const handleQuantityChange = (
    id: number,
    newQuantity: number,
    toBeUpdated: string
  ) => {
    const competition = competitions.find((comp) => comp.id === id);
    if (
      Number(competition?.max_ticket_per_user) === quantities[id] &&
      toBeUpdated === "increment"
    ) {
      toast.error(cartError());
      return;
    }
    const currentQty = quantities[id];
    const newQty =
      toBeUpdated === "increment"
        ? currentQty + newQuantity
        : currentQty < 1
        ? currentQty
        : currentQty - newQuantity;
    setQuantities({ ...quantities, [id]: newQty });
  };

  const handleQuantityChangeInput = (id: number, value: number) => {
    let parsedValue: number;
    const competition = competitions.find(
      (item) => item.id === id
    ) as CompetitionType;
    if (value > parseInt(competition.max_ticket_per_user)) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: parseInt(competition.max_ticket_per_user),
      }));
      return;
    }
    if (isNaN(value)) return;
    if (!value) {
      parsedValue = 0;
    } else {
      parsedValue = value;
    }
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: parsedValue,
    }));
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="instant-all-opert">
        <div className="container">
          <div className="Instant-wins-two-heading">
            <div className="Instant-wins-two-center">
              <h2>the Big Gear</h2>
            </div>
          </div>

          <div className="instant-view-all">
            <Link to="/competitions/the_big_gear">View All</Link>
          </div>
          {competitions.length > 0 ? (
            <SwiperSlideComponent
              handleQuantityChange={handleQuantityChange}
              quantities={quantities}
              competitions={competitions}
              scrollbarId="big-gear"
              category="the_big_gear"
              navigateCompetition={navigateCompetition}
              handleAddToCart={handleAddToCart}
              handleQuantitiyChangeInput={handleQuantityChangeInput}
              cartKeys={cartKeys}
            />
          ) : (
            <div style={{ margin: "150px 0" }}>
              <h4
                style={{
                  color: "white",
                  textAlign: "center",
                }}
              >
                The Big Gear competitions are not available right now!
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BigGear;
