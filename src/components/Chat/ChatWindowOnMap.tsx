import { IonButton, IonIcon, isPlatform } from "@ionic/react";
import { motion } from "framer-motion";
import { newspaper } from "ionicons/icons";
import React, { useState } from "react";

import Chat from "~/components/Chat/index";

const ChatWindowOnMap = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleChatVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const marginBottom = isVisible
    ? isPlatform("mobile")
      ? "50px"
      : "57px"
    : isPlatform("mobile")
      ? "104px"
      : "97px";

  return (
    <motion.div
      initial={{ y: isVisible ? "100%" : 0 }}
      animate={{ y: isVisible ? 0 : "100%" }}
      transition={{ stiffness: 100 }}
      className={`absolute z-[1500] bottom-0`}
      style={{ marginBottom }}
    >
      <IonButton onClick={toggleChatVisibility}>
        {isVisible ? (
          <IonIcon icon={newspaper} />
        ) : (
          <IonIcon icon={newspaper} />
        )}
      </IonButton>
      {isVisible && (
        <div className="bg-gray-800 bg-opacity-40">
          <Chat />
        </div>
      )}
    </motion.div>
  );
};

export default ChatWindowOnMap;
