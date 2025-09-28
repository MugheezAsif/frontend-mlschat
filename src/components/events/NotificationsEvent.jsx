import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addNewNotification } from '../../store/slices/notificationSlice';
import { useLocation, useSearchParams } from 'react-router-dom';

const NotificationsEvent = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentConvoId = searchParams.get("convo_id");

  useEffect(() => {
    if (!user || !token) return;

    const initializeEcho = () => {
      if (window.Echo) {
        const channelName = `notifications.${user.id}`;
        const channel = window.Echo.private(channelName);

        channel.listen('.notification.sent', (eventData) => {
          const notification = eventData?.notification;

          if (notification) {
            dispatch(addNewNotification(notification));

            // Suppress toast if user is viewing the relevant chat in the messenger page
            const isInMessenger = location.pathname === "/messenger";
            const isMessageNotif = notification.type === "message_received";
            const isSameConvo = notification?.data?.model?.id === Number(currentConvoId);

            const shouldSuppressToast = isInMessenger && isMessageNotif && isSameConvo;

            if (!shouldSuppressToast) {
              const plainText = (notification.message || '').replace(/<[^>]*>?/gm, '');
              toast.info(plainText || 'New notification!');
            }
          }
        });

        channel.error((error) => {
          console.error(`Error subscribing to ${channelName}:`, error);
        });

        window._notificationsEchoCleanup = { channel, channelName };
      } else {
        setTimeout(initializeEcho, 1000);
      }
    };

    initializeEcho();

    return () => {
      const cleanup = window._notificationsEchoCleanup;
      if (cleanup && cleanup.channel) {
        cleanup.channel.stopListening('.notification.sent');
        window.Echo.leaveChannel(cleanup.channelName);
        delete window._notificationsEchoCleanup;
      }
    };
  }, [user, token, location, currentConvoId, dispatch]);

  return null;
};

export default NotificationsEvent;
