import { Suspense, useEffect, useState } from "react";
import components from "./components";
import Loader from "../../common/Loader";
import axios from "axios";
import { Helmet } from "react-helmet";
import { MetaData } from "../../types";

const Home = () => {
  const [title, setTitle] = useState<string>("");
  const [metaDesc, setMetaDesc] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState<string>("");
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const res = await axios.post(
          "?rest_route=/api/v1/getSEOSettings",
          { page: "Home" },
          { headers: { Authorization: `Bearer ${VITE_TOKEN}` } }
        );
        const meta: MetaData = res.data.data[0];
        setTitle(meta.page_title);
        setMetaDesc(meta.meta_description);
        setMetaTitle(meta.meta_title);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMetaData();
  }, []);
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={metaDesc} />
        <meta name="title" content={metaTitle} />
      </Helmet>
      {components.map((component) => {
        const { name, component: Component } = component;
        return (
          <Suspense fallback={<Loader />} key={name}>
            <Component />
          </Suspense>
        );
      })}
    </div>
  );
};

export default Home;
