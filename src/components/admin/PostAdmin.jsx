import { useEffect, useState } from "react";
import { controlActiveStatus, getAllPosts, getPostByKeyword, getPostByStartAndEnd } from "../../services/PostService";
import { p } from "framer-motion/client";
import { FaAlignLeft, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { func } from "prop-types";

export default function ({}) {
    const [listPost, setListPost] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [keyword, setKeyword] = useState('');
    const currentUserId = localStorage.getItem('userId');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    useEffect(() => {
    const fetchPosts = async () => {
        try {
        const data = await getAllPosts(); // Lấy dữ liệu từ API
        setListPost(data);
        } catch (err) {
        console.error("Error fetching posts:", err); 
        setError("Failed to fetch posts"); 
        setLoading(false); 
        }
    };
    fetchPosts();
    }, [currentUserId]);
    console.log('listPost: ', listPost);
    function formatDateString(dateString) {
        const date = new Date(dateString);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

    // Tính chỉ số bắt đầu và kết thúc của bài viết trong trang hiện tại
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = listPost.slice(indexOfFirstPost, indexOfLastPost);

    // Tính tổng số trang
    const totalPages = Math.ceil(listPost.length / postsPerPage);

    const controlActive = async (postId) => {
        try {
            const response = await controlActiveStatus(postId);
            const data = await getAllPosts(); // Lấy dữ liệu từ API
            setListPost(data);
        } catch (error) {
            console.error("Lỗi khi điều chỉnh trạng thái bài viết! ", error);
        }
    }

    const getByKeyword = async (keyword) => {
        try {
            const response = await getPostByKeyword(keyword);
            // const data = await getAllPosts(); // Lấy dữ liệu từ API
            setListPost(response);
        } catch (error) {
            console.error("Lỗi khi điều chỉnh trạng thái bài viết! ", error);
        }
    }

    const getByStartAndEnd = async (start, end) => {
        try {
            const response = await getPostByStartAndEnd(start, end);
            // const data = await getAllPosts(); // Lấy dữ liệu từ API
            setListPost(response);
        } catch (error) {
            console.error("Lỗi khi điều chỉnh trạng thái bài viết! ", error);
        }
    }

    /////////
    return (
        <div className="flex flex-col gap-5">
            {/* <div>Hiển thị quản lí bài viết</div> */}
            <div className="flex justify-start gap-10">
                <div className="flex flex-row gap-2">
                    <input className="p-2 rounded w-[500px]" onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm kiếm bài viết"/>
                    <button className="p-2 shadow rounded hover:bg-gray-500 w-[100px] text-lg font-semibold" onClick={() => getByKeyword(keyword)}>Tìm</button>
                </div>
                <div className="flex flex-row gap-3">
                    <div className="flex flex-col gap-2">
                        <label className="">Thời gian bắt đầu</label>
                        <input className="p-2 shadow rounded " onChange={(e) => setStartTime(e.target.value)} type="date"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Thời gian bắt đầu</label>
                        <input className="p-2 shadow rounded " onChange={(e) => setEndTime(e.target.value)} type="date"/>
                    </div>
                    <button className="p-2 shadow rounded hover:bg-gray-500 w-[100px] text-lg font-semibold" onClick={() => getByStartAndEnd(startTime, endTime)}>Tìm theo thời gian</button>
                </div>
                
            </div>
            <div className="">
                <table className="w-[1200px] rounded p-4 rounded-t-lg table-auto">
                    <thead className="bg-gray-200 p-5 rounded-lg h-[50px]">
                        <tr className="rounded-lg">
                            <th>STT</th>
                            <th>Nội dung bài viết</th>
                            <th>Hình ảnh</th>
                            <th>Người dùng</th>
                            <th>Thời gian tạo</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="">
                    {currentPosts.length > 0 ? (
                        currentPosts.map((post, index) => (
                        <tr key={post.id} className="h-[40px] p-2">
                            <td>{indexOfFirstPost + index + 1}</td>
                            <td>{post.content}</td>
                            <td>
                            {post.imageUrl != null ? (
                                <img src={post.imageUrl} alt="post" className="w-[100px] h-auto" />
                            ) : (
                                <p>Không có hình ảnh</p>
                            )}
                            </td>
                            <td>{post.userId.firstName} {post.userId.lastName}</td>
                            <td>{formatDateString(post.createdAt)}</td>
                            <td>{post.activeStatus === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}</td>
                            <td>
                                <button className="p-1 rounded bg-red-500" onClick={() => controlActive(post.id)}>Xóa</button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="6" className="text-center p-4">Không có bài viết nào.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <div className="flex justify-center mt-4 gap-2">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                >
                    <FaAngleLeft/>
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                    <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 border rounded ${
                        currentPage === idx + 1 ? "bg-blue-400 text-white" : "hover:bg-gray-100"
                    }`}
                    >
                    {idx + 1}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                >
                    <FaAngleRight/>
                </button>
                </div>
            </div>
        </div>
    );
}