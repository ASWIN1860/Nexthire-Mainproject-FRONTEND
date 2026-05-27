import { Bell, Menu, Trash2 } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import socket from "../../socket";

let audioCtx = null;
let audioUnlocked = false;

// Modern browsers block audio until the user interacts with the page.
// This function unlocks the audio context on the first click/keypress.
const initAudio = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  audioUnlocked = true;
  
  document.removeEventListener('click', initAudio);
  document.removeEventListener('keydown', initAudio);
};

if (typeof document !== 'undefined') {
  document.addEventListener('click', initAudio);
  document.addEventListener('keydown', initAudio);
}

const playNotificationSound = () => {
  try {
    if (!audioCtx || !audioUnlocked) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const playNote = (frequency, startTime) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // Triangle wave with high frequency is very crisp and clear
      osc.type = 'triangle'; 
      osc.frequency.value = frequency;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
      
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    };

    const now = audioCtx.currentTime;
    // Higher frequency notes (C6 -> E6) for better audibility
    playNote(1046.50, now);       // C6
    playNote(1318.51, now + 0.15); // E6
  } catch (err) {
    console.log("Notification sound failed", err);
  }
};

const Navbar = ({ onMenuClick, isAdmin = false }) => {
  const [profile, setProfile] = useState("");

  // USER EMAIL FOR UNIQUE IDENTIFIER
  const userEmail = sessionStorage.getItem("email") || "guest";

  // USER SPECIFIC STORAGE KEY
  const notificationKey = `notifications_${userEmail}`;

  // LOAD NOTIFICATIONS FROM LOCAL STORAGE
  const [notifications, setNotifications] = useState(() => {
    const storedNotifications = localStorage.getItem(notificationKey);

    return storedNotifications ? JSON.parse(storedNotifications) : [];
  });

  const notificationCount = notifications.filter((n) => !n.isRead).length;

  const [showNotifications, setShowNotifications] = useState(false);
  const [popupNotification, setPopupNotification] = useState(null);

  const notificationRef = useRef();

  // LOAD PROFILE IMAGE
  useEffect(() => {
    const DP = sessionStorage.getItem("dp");

    if (DP) {
      setProfile(DP);
    }
  }, []);

  // SAVE TO LOCAL STORAGE WHEN NOTIFICATIONS CHANGE
  useEffect(() => {
    localStorage.setItem(notificationKey, JSON.stringify(notifications));
  }, [notifications]);

  // SOCKET CONNECTION
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket Connected :", socket.id);
    });

    socket.on("newNotification", (data) => {
      // Filter targeted notifications
      const currentRole = sessionStorage.getItem("role");
      let token = sessionStorage.getItem("token");
      let currentUserId = null;
      if (token) {
        try {
          const decoded = jwtDecode(token);
          currentUserId = decoded.id;
        } catch (e) {
          console.log(e);
        }
      }

      if (data.targetRole && (!currentRole || data.targetRole.toLowerCase() !== currentRole.toLowerCase())) {
        return; // Skip if role doesn't match
      }

      if (data.targetUserId && data.targetUserId !== currentUserId) {
        return; // Skip if userId doesn't match
      }

      console.log("Notification Received :", data);
      playNotificationSound();

      const newNotification = {
        ...data,
        time: new Date().toLocaleTimeString(),
        isRead: false,
      };

      setPopupNotification(newNotification);

      setTimeout(() => {
        setPopupNotification(null);
      }, 5000);

      setNotifications((prev) => {
        const updatedNotifications = [newNotification, ...prev].slice(0, 10);

        return updatedNotifications;
      });
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  // CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // CLEAR ALL NOTIFICATIONS
  const clearNotifications = () => {
    setNotifications([]);

    localStorage.removeItem(notificationKey);
  };

  // DELETE SINGLE NOTIFICATION
  const deleteSingleNotification = (indexToDelete) => {
    const updatedNotifications = notifications.filter(
      (_, index) => index !== indexToDelete,
    );

    setNotifications(updatedNotifications);

    localStorage.setItem(notificationKey, JSON.stringify(updatedNotifications));
  };

  return (
    <header className="h-16 lg:pl-64 glass-panel border-b border-slate-800/80 fixed top-0 w-full z-30 flex items-center justify-between px-4 sm:px-6">
      {/* LEFT SIDE */}

      <div className="flex items-center gap-2 flex-1 max-w-md">
        <button
          onClick={onMenuClick}
          className="
            lg:hidden
            p-2
            text-slate-400
            hover:text-slate-200
            hover:bg-slate-800/50
            rounded-lg
            transition-colors
          "
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center gap-4">
        {/* NOTIFICATION SECTION */}

        <div className="relative" ref={notificationRef}>
          {/* BELL BUTTON */}

          <button
            onClick={() => {
              setShowNotifications(!showNotifications);

              if (!showNotifications) {
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, isRead: true }))
                );
              }
            }}
            className="
              relative
              p-2
              text-slate-400
              hover:text-slate-200
              transition-colors
              rounded-full
              hover:bg-slate-800/50
            "
          >
            <Bell className="w-5 h-5" />

            {notificationCount > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1

                  bg-red-500
                  text-white

                  text-[10px]

                  h-5
                  w-5

                  flex
                  items-center
                  justify-center

                  rounded-full

                  animate-pulse
                "
              >
                {notificationCount}
              </span>
            )}
          </button>

          {/* NOTIFICATION DROPDOWN */}

          {showNotifications && (
            <div
              className="
                absolute
                right-0
                mt-3

                w-80

                glass-panel

                bg-slate-900/95

                border
                border-slate-700

                rounded-2xl

                shadow-2xl

                overflow-hidden

                z-50
              "
            >
              {/* HEADER */}

              <div
                className="
                  px-4
                  py-3

                  border-b
                  border-slate-700

                  flex
                  items-center
                  justify-between
                "
              >
                <h1 className="text-white font-bold">Notifications</h1>

                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="
                      text-red-400
                      hover:text-red-300

                      transition-all
                    "
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* NOTIFICATION LIST */}

              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((item, index) => (
                    <div
                      key={index}
                      className="
                        px-4
                        py-3

                        border-b
                        border-slate-800

                        hover:bg-slate-800/50

                        transition-all

                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >
                      <div>
                        <p className="text-sm text-slate-200 font-medium">
                          {item.message}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {item.time}
                        </p>
                      </div>

                      {/* DELETE SINGLE */}

                      <button
                        onClick={() => deleteSingleNotification(index)}
                        className="
                          text-slate-500
                          hover:text-red-400

                          transition-all
                        "
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <Bell className="w-10 h-10 text-slate-600 mx-auto mb-2" />

                    <p className="text-slate-400 text-sm">No Notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* POPUP FOR NEW NOTIFICATION ONLY */}
          {popupNotification && !showNotifications && (
            <div
              className="
                absolute
                right-0
                mt-3
                w-80
                glass-panel
                bg-slate-900/95
                border
                border-blue-500/50
                rounded-2xl
                shadow-2xl
                shadow-blue-500/10
                overflow-hidden
                z-50
              "
            >
              <div className="px-4 py-3 flex items-start justify-between gap-3 bg-slate-800/30">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 shrink-0">
                  <Bell className="w-4 h-4 animate-bounce" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-200 font-medium">
                    {popupNotification.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {popupNotification.time}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}

        <ProfileDropdown isAdmin={isAdmin} profile={profile} />
      </div>
    </header>
  );
};

export default Navbar;
