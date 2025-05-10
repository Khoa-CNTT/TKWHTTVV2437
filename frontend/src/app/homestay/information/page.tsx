import dynamic from "next/dynamic";

const HomestayInformationClient = dynamic(
  () => import("./HomestayInformationClient"),
  {
    ssr: false,
  }
);

const HomestayInformationPage = () => {
  return <HomestayInformationClient />;
};

export default HomestayInformationPage;
