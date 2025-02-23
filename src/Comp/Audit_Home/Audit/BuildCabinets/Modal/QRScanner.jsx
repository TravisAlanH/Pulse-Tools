import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner({ setQRModal, setHoldItem, setHoldUserInputs }) {
  const [readerData, setReaderData] = React.useState("");

  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);

    function onScanSuccess(decodedText, decodedResult) {
      console.log(`Code matched = ${decodedText}`, decodedResult);
      setReaderData(decodedText);
      setHoldItem((prevState) => {
        return {
          ...prevState,
          [key]: newValue,
        };
      });
      if (!Questions.Items[key].required) {
        setHoldUserInputs((prevState) => {
          return {
            ...prevState,
            [key]: newValue,
          };
        });
      }
      setQRModal(false);
    }

    function onScanFailure(error) {
      console.warn(`Code scan error = ${error}`);
    }

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    // Cleanup function to stop the scanner when the component unmounts
    return () => {
      html5QrcodeScanner.clear();
    };
  }, []);

  return (
    <div id="AuditModal" className="MainModalClass">
      <div className="ModalContent flex flex-col w-full py-4">
        <div className="flex flex-row justify-between items-center gap-8 px-4 ">
          <h1 className="text-[1rem] font-bold">QR Scanner</h1>
          <span className="close" onClick={() => setQRModal(false)}>
            &times;
          </span>
        </div>
        <div className="flex flex-row overflow-auto h-full">{readerData}</div>
        <div id="reader" width="600px"></div>
      </div>
    </div>
  );
}
