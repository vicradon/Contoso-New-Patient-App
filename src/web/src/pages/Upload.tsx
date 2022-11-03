import useUserMedia from "../hooks/useUserMedia";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { Button } from "../components/Button";
import CameraFeed from "../components/CameraFeed";
import { DragDropZone } from "../components/DragDropZone";
import FileToUpload from "../components/FileToUpload";
import { useNavigate } from "react-router-dom";
import { buttonZone } from "./Upload.css";
import { FullPageSpinner } from "../components/FullPageSpinner";
// import * as dotenv from "dotenv";
// dotenv.config();

// const API_URL = process.env.REACT_APP_API_URL;

function Upload() {
  const [cameraActive, setCameraActive] = useState(false);
  const [mediaStream, videoDimensions] = useUserMedia(cameraActive);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (fileToUpload) {
      setCameraActive(false);
    }
  }, [fileToUpload]);

  const uploadFile = useCallback(async () => {
    if (fileToUpload) {
      setUploading(true);

      const formData = new FormData();
      formData.append("patient-registration-form", fileToUpload);

      const res = await fetch(`http://localhost:3001/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        // navigate(`/results`);
        console.log(res);
      } else {
        console.error("Upload failed");
        const resText = await res.text();
        console.error(resText);
      }
    }
  }, [fileToUpload]);

  return (
    <div style={{ opacity: uploading ? "50%" : "100%" }}>
      {uploading && <FullPageSpinner />}
      <DragDropZone
        cameraActive={cameraActive}
        setCameraActiveState={setCameraActive}
        fileSelected={setFileToUpload}
        disabled={uploading}
      />
      <CameraFeed mediaStream={mediaStream} captureImage={setFileToUpload} />
      {fileToUpload && (
        <>
          <FileToUpload
            file={fileToUpload}
            width={videoDimensions?.width}
            height={videoDimensions?.height}
          />
          <div className={buttonZone}>
            <Button onClick={uploadFile} disabled={uploading}>
              <Icon path={mdiUpload} size={1} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Upload;
