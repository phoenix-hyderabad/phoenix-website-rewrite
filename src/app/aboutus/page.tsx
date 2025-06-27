"use client";

import { Tabs, TabsContent, TabsList } from "~/components/ui/tabs";
import StyledTabTrigger from "~/components/aboutus_page/StyledTabTrigger";
import AboutTabContent from "~/components/aboutus_page/AboutTabContent";
import ProfsTabContent from "~/components/aboutus_page/ProfsTabContent";
import TeamTabContent from "~/components/aboutus_page/TeamTabContent";

const AboutUs = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 p-8 text-center">
      <Tabs defaultValue="about">
        <TabsList className="gap-2 bg-transparent">
          <StyledTabTrigger value="about">About Us</StyledTabTrigger>
          <StyledTabTrigger value="profs">Professors</StyledTabTrigger>
          <StyledTabTrigger value="team">Team</StyledTabTrigger>
        </TabsList>
        <TabsContent
          value="about"
          className="m-0 flex flex-col focus-visible:ring-transparent"
        >
          <AboutTabContent />
        </TabsContent>
        <TabsContent
          value="profs"
          className="m-0 flex flex-col focus-visible:ring-transparent"
        >
          <ProfsTabContent />
        </TabsContent>
        <TabsContent
          value="team"
          className="m-0 flex flex-col focus-visible:ring-transparent"
        >
          <TeamTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AboutUs;
