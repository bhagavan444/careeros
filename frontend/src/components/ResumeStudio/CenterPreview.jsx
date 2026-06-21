import React, { useEffect, useState } from "react";
import PageBreakEngine from "./engine/PageBreakEngine";
import DocumentRenderer from "./engine/DocumentRenderer";
import ZoomControls from "./ZoomControls";
import LivePageNavigator from "./LivePageNavigator";
import { resumeDocumentStore } from "../../services/ResumeDocumentStore";

export default function CenterPreview({ data, template }) {
  const [zoomMode, setZoomMode] = useState(resumeDocumentStore.state.zoomMode);

  // Sync props to store
  useEffect(() => {
    resumeDocumentStore.updateData(data);
  }, [data]);

  useEffect(() => {
    resumeDocumentStore.updateTemplate(template);
  }, [template]);

  useEffect(() => {
    const unsub = resumeDocumentStore.subscribe((state) => {
      setZoomMode(state.zoomMode);
    });
    return unsub;
  }, []);

  const getZoomStyles = () => {
    let scale = 1;
    let transformOrigin = "top center";
    let wrapperStyles = { display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" };

    switch (zoomMode) {
      case "50": scale = 0.5; break;
      case "75": scale = 0.75; break;
      case "100": scale = 1; break;
      case "125": scale = 1.25; break;
      case "150": scale = 1.5; break;
      case "fit-width": scale = 0.9; break; // Approximated
      case "fit-page": scale = 0.6; break;
      case "fit-all": 
        scale = 0.4; 
        wrapperStyles.flexDirection = "row";
        wrapperStyles.flexWrap = "wrap";
        wrapperStyles.alignItems = "flex-start";
        break;
      default: scale = 0.9;
    }

    return {
      transform: `scale(${scale})`,
      transformOrigin,
      width: zoomMode === 'fit-all' ? `${(100 / scale)}%` : "100%",
      ...wrapperStyles
    };
  };

  const zoomStyles = getZoomStyles();

  return (
    <div className="rs-panel rs-preview-panel" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PageBreakEngine />
      <ZoomControls />
      
      <div style={{ position: "relative", flexGrow: 1, overflow: "hidden" }}>
        <LivePageNavigator />
        
        <div className="rs-panel-content rs-preview-container">
          <div style={zoomStyles}>
            <DocumentRenderer />
          </div>
        </div>
      </div>
    </div>
  );
}
