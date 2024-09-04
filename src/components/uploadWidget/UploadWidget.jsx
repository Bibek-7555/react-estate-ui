import { createContext, useEffect, useState, useCallback } from "react";

const CloudinaryScriptContext = createContext();

function UploadWidget({ uwConfig, setPublicId, setState }) {
  const [loaded, setLoaded] = useState(false);
  const [widget, setWidget] = useState(null);

  useEffect(() => {
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => {
          setLoaded(true);
        });
        document.body.appendChild(script);
      } else {
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = useCallback(() => {
    if (loaded && !widget && window.cloudinary) {
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            setState((prev) => [...prev, result.info.secure_url]);
          }
        }
      );
      setWidget(myWidget);
    }
  }, [loaded, widget, uwConfig, setState]);

  useEffect(() => {
    if (loaded) {
      const checkCloudinaryReady = setInterval(() => {
        if (window.cloudinary) {
          clearInterval(checkCloudinaryReady);
          initializeCloudinaryWidget();
        }
      }, 100);

      return () => clearInterval(checkCloudinaryReady);
    }
  }, [loaded, initializeCloudinaryWidget]);

  const handleOpenWidget = useCallback(() => {
    if (widget) {
      widget.open();
    }
  }, [widget]);

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        className="cloudinary-button"
        onClick={handleOpenWidget}
        disabled={!loaded || !widget}
      >
        {loaded && widget ? "Upload" : "Loading..."}
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };