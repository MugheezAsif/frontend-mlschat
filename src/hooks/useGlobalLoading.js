// hooks/useGlobalLoading.js
import { useSelector } from 'react-redux';

export const useGlobalLoading = () => {
  const user = useSelector((s) => s.auth.user);
  const postsLoading = useSelector((s) => s.posts.loading);
  const groupsLoading = useSelector((s) => s.groups.loading);
  const chatLoading = useSelector((s) => s.chat.loading);
  const membersLoading = useSelector((s) => s.groups.membersLoading);

  return !user || postsLoading || groupsLoading || chatLoading || membersLoading;
};
export default useGlobalLoading;