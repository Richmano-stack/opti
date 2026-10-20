"use client";

import { useState, type ReactNode } from "react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

type MobilePane = "inputs" | "preview";

function MobileStudioTabs({
  inputs,
  preview,
  previewReady,
}: {
  inputs: ReactNode;
  preview: ReactNode;
  previewReady: boolean;
}) {
  const [pane, setPane] = useState<MobilePane>("inputs");
  const [shownReady, setShownReady] = useState(previewReady);
  if (previewReady !== shownReady) {
    setShownReady(previewReady);
    if (previewReady) setPane("preview");
  }

  return (
    <Tabs
      value={pane}
      onValueChange={(value) => {
        if (value === "inputs" || value === "preview") setPane(value);
      }}
      className="min-h-0 flex-1 gap-0"
    >
      <div className="shrink-0 border-b p-3">
        <TabsList aria-label="Studio view" className="w-full">
          <TabsTrigger value="inputs">Input &amp; tailoring</TabsTrigger>
          <TabsTrigger value="preview">Live preview</TabsTrigger>
        </TabsList>
      </div>
      {/* Both panes stay mounted so the form keeps every field when the user switches. */}
      <TabsContent value="inputs" keepMounted className="flex min-h-0 flex-col">
        {inputs}
      </TabsContent>
      <TabsContent value="preview" keepMounted className="flex min-h-0 flex-col">
        {preview}
      </TabsContent>
    </Tabs>
  );
}

export function ResumeStudioPanels({
  inputs,
  preview,
  previewReady,
}: {
  inputs: ReactNode;
  preview: ReactNode;
  previewReady: boolean;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileStudioTabs inputs={inputs} preview={preview} previewReady={previewReady} />;
  }

  return (
    <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1">
      <ResizablePanel id="studio-inputs" defaultSize="40%" minSize="30%" maxSize="50%">
        {inputs}
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize panels" />
      <ResizablePanel id="studio-preview" defaultSize="60%">
        {preview}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
