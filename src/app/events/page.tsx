import type { Metadata } from "next";
import NavBar from "../../Components/NavBar/NavBar";
import EventsSection from "../../Components/EventsSection/EventsSection";
import Footer from "../../Components/Footer/Footer";

export const metadata: Metadata = {
  title: "Events | AWSCC-SRMIST",
  description:
    "Upcoming and past events by AWS Cloud Clubs - SRMIST. Workshops, bootcamps, and more.",
};

export default function Events() {
  return (
    <>
      <NavBar />
      <div style={{ paddingTop: "70px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1 }}>
          <EventsSection />
        </div>
        <Footer />
      </div>
    </>
  );
}
