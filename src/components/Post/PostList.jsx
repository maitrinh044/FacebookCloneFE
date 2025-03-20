// src/components/PostList.jsx
import PostItem from "../Post/PostItem";

const samplePosts = [
  {
    id: 1,
    username: "An Nguyễn",
    userAvatar: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/458161522_2243394162660512_7913931544320209269_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFE4H0KfJHUauSeB90nsw9jIBJwHuSktOAgEnAe5KS04F5KUxSkb8DlPyoPUcf2mlb9fV6MzqCuAtSLoc7Ay6-A&_nc_ohc=CXoMMnzvULoQ7kNvgEh0ypF&_nc_oc=Adhd1HcZH8ihnu0nOpaHQL9P6zFJqIzADQy2tSGyfmQKeSJV_6Hkf7Xvt4OoxnzJG3Y&_nc_zt=23&_nc_ht=scontent.fsgn5-6.fna&_nc_gid=AQR7ZI_aDJOrecOKCXIigMN&oh=00_AYGQ7t7qCRDcZNQEIHRWgbCoYPYdNv04Mz2JyaDNxAK61w&oe=67D6AB59",
    time: "2 giờ trước",
    content: "Hôm nay trời đẹp quá!",
    image: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/458161522_2243394162660512_7913931544320209269_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFE4H0KfJHUauSeB90nsw9jIBJwHuSktOAgEnAe5KS04F5KUxSkb8DlPyoPUcf2mlb9fV6MzqCuAtSLoc7Ay6-A&_nc_ohc=CXoMMnzvULoQ7kNvgEh0ypF&_nc_oc=Adhd1HcZH8ihnu0nOpaHQL9P6zFJqIzADQy2tSGyfmQKeSJV_6Hkf7Xvt4OoxnzJG3Y&_nc_zt=23&_nc_ht=scontent.fsgn5-6.fna&_nc_gid=AQR7ZI_aDJOrecOKCXIigMN&oh=00_AYGQ7t7qCRDcZNQEIHRWgbCoYPYdNv04Mz2JyaDNxAK61w&oe=67D6AB59",
    likes: 3,
  },
  {
    id: 2,
    username: "Bảo Trân",
    userAvatar: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/458161522_2243394162660512_7913931544320209269_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFE4H0KfJHUauSeB90nsw9jIBJwHuSktOAgEnAe5KS04F5KUxSkb8DlPyoPUcf2mlb9fV6MzqCuAtSLoc7Ay6-A&_nc_ohc=CXoMMnzvULoQ7kNvgEh0ypF&_nc_oc=Adhd1HcZH8ihnu0nOpaHQL9P6zFJqIzADQy2tSGyfmQKeSJV_6Hkf7Xvt4OoxnzJG3Y&_nc_zt=23&_nc_ht=scontent.fsgn5-6.fna&_nc_gid=AQR7ZI_aDJOrecOKCXIigMN&oh=00_AYGQ7t7qCRDcZNQEIHRWgbCoYPYdNv04Mz2JyaDNxAK61w&oe=67D6AB59",
    time: "1 giờ trước",
    content: "Mọi người đã xem bộ phim mới chưa?",
    image: "",
    likes: 1,
  },
];

export default function PostList() {
  return (
    <div>
      {samplePosts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
