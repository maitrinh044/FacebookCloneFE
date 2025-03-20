import Header from "../components/Header";
import SidebarLeft from "../components/SidebarLeft";
import SidebarRight from "../components/SidebarRight";
import PostList from "../components/Post/PostList";

export default function Home({ onOpenChat }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="flex pt-4">
        <SidebarLeft />
        <div className="flex-1 p-4 pt-0 text-gray-800">
          <h1 className="text-xl font-bold mb-4">Bảng tin</h1>
          <PostList />
        </div>
        <SidebarRight onOpenChat={onOpenChat} />
      </div>
    </div>
  );
}
