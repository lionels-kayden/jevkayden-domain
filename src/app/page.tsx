"use client";

import React, { useState, useEffect } from "react";
import { TopSystemBar } from "@/components/TopSystemBar";
import { HeroTerminal } from "@/components/HeroTerminal";
import { TechMarquee } from "@/components/TechMarquee";
import { SubdomainGrid } from "@/components/SubdomainGrid";
import { PagerContact } from "@/components/PagerContact";
import { Language } from "@/data/siteConfig";
import initialHubData from "@/data/hubData.json";
import { HubData } from "@/types/hub";
import {
  readLiveClientCache,
  fetchFreshestData,
  subscribeToLiveSync,
} from "@/lib/liveClientSync";

export default function Home() {
  const [lang, setLang] = useState<Language>("en");
  const [isProductionRoute, setIsProductionRoute] = useState<boolean>(true);
  const [isStandbyModalOpen, setIsStandbyModalOpen] = useState<boolean>(false);
  const [hubData, setHubData] = useState<HubData>(initialHubData as HubData);

  // Instant 0ms live sync from localStorage + cache-busted /api/site fetch + BroadcastChannel listener
  useEffect(() => {
    const localSnapshot = readLiveClientCache<HubData>(
      "jev_live_hub_data",
      initialHubData as HubData
    );
    if (localSnapshot?.data?.hero) {
      setHubData(localSnapshot.data);
    }

    fetchFreshestData<HubData>(
      "/api/site",
      "jev_live_hub_data",
      initialHubData as HubData
    ).then((freshest) => {
      if (freshest && freshest.hero) {
        setHubData(freshest);
      }
    });

    return subscribeToLiveSync<HubData>(
      "jev_live_hub_data",
      "/api/site",
      initialHubData as HubData,
      (freshest) => {
        if (freshest && freshest.hero) {
          setHubData(freshest);
        }
      }
    );
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "vi" : "en"));
  };

  const toggleRoutingMode = () => {
    setIsProductionRoute((prev) => !prev);
  };

  const scrollToPortals = () => {
    const el = document.getElementById("subdomains-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById("contact-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen flex flex-col justify-between selection:bg-amber-300 selection:text-black">
      {/* MODULE 1: Retro OS Top System Bar */}
      <TopSystemBar
        lang={lang}
        onToggleLang={toggleLanguage}
        isProductionRoute={isProductionRoute}
        onToggleRouting={toggleRoutingMode}
      />

      {/* Main Content Modules */}
      <div className="flex-1 flex flex-col">
        {/* MODULE 2: Builder ID & TERMINAL.EXE */}
        <HeroTerminal
          lang={lang}
          hubData={hubData}
          onScrollToPortals={scrollToPortals}
          onScrollToContact={scrollToContact}
          onOpenStandbyModal={() => setIsStandbyModalOpen(true)}
        />

        {/* MODULE 4: Infinite Scrolling Mechanical Tech Marquee */}
        <TechMarquee hubData={hubData} />

        {/* MODULE 3: 3 Hardware Cartridges (blog, cv, app with STANDBY modal) */}
        <SubdomainGrid
          lang={lang}
          hubData={hubData}
          isProductionRoute={isProductionRoute}
          isStandbyModalOpen={isStandbyModalOpen}
          onOpenStandbyModal={() => setIsStandbyModalOpen(true)}
          onCloseStandbyModal={() => setIsStandbyModalOpen(false)}
        />
      </div>

      {/* MODULE 5: Retro Pager Footer & Contact Transmission */}
      <PagerContact
        lang={lang}
        hubData={hubData}
        onScrollToTop={scrollToTop}
        onOpenStandbyModal={() => setIsStandbyModalOpen(true)}
      />
    </main>
  );
}
