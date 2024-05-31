import { lazy } from "react";

const Accessories = lazy(() => import("../../components/Home/Accessories"));
const BigGear = lazy(() => import("../../components/Home/Big-gear"));
const Carousel = lazy(() => import("../../common/Carousel"));
const DrawNext = lazy(() => import("../../components/Home/Draw-next"));
const Finished = lazy(() => import("../../components/Home/Finished"));
const InstantWins = lazy(() => import("../../components/Home/Instant-win"));
const Pricing = lazy(() => import("../../components/Home/Pricing"));
const Wrapper = lazy(() => import("../../components/Home/Wrapper"));

const components = [
  {
    name: "Carousel",
    component: Carousel,
  },
  {
    name: "Pricing",
    component: Pricing,
  },
  {
    name: "Instant-wins",
    component: InstantWins,
  },
  {
    name: "Draw-next",
    component: DrawNext,
  },
  {
    name: "Big-gear",
    component: BigGear,
  },
  {
    name: "Accessories",
    component: Accessories,
  },

  {
    name: "Finished",
    component: Finished,
  },
  {
    name: "Wrapper",
    component: Wrapper,
  },
];

export default components;
