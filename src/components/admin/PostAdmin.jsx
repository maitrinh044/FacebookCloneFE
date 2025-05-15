import { useEffect, useState } from "react";
import { controlActiveStatus, getAllPosts, getPostByKeyword, getPostByStartAndEnd } from "../../services/PostService";
import { p } from "framer-motion/client";
import { FaAlignLeft, FaAngleLeft, FaAngleRight, FaTimes } from "react-icons/fa";
import { func } from "prop-types";
import { getCommentByPost } from "../../services/profileService";
import { controlActiveStatusComment } from "../../services/CommentService";

export default function ({}) {
    const [listPost, setListPost] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [keyword, setKeyword] = useState('');
    const currentUserId = localStorage.getItem('userId');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [modalCT, setModalCT] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentByPost, setCommentByPost] = useState([]);
    const onClose = () => {
        setSelectedPost(null);
    }
    useEffect(() => {
    const fetchPosts = async () => {
        try {
        const data = await getAllPosts(); // Lấy dữ liệu từ API
        setListPost(data);

        const commentPromises = data.map(post => {
            return getCommentByPost(post.id).then(comments => ({
                postId: post.id,
                comments
            }));
        });
        const tmp2 = await Promise.all(commentPromises);
        setCommentByPost(tmp2);
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

    const controlActiveComment = async(cmtId) => {
        try {
            const response = await controlActiveStatusComment(cmtId);
            // const data = await getAllPosts(); // Lấy dữ liệu từ API
            // setListPost(data);
            console.log('Control activeStatus success!');
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

    function getListCmtByPost(postid) {
        const post = commentByPost.find(e => e.postId == postid);
        return post || [];
    }

    console.log('commentByPost: ', commentByPost);
    console.log('commentByPost in 1: ', getListCmtByPost(1));

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
                            <td className="flex flex-row gap-3">
                                <button className="p-1 rounded bg-blue-500" onClick={() => setSelectedPost(post)}>Chi tiết</button>
                                {post.activeStatus == 'ACTIVE' ? (
                                    <button className="p-1 rounded bg-red-500" onClick={() => controlActive(post.id)}>Ẩn</button>
                                ) : (
                                    <button className="p-1 rounded bg-green-500" onClick={() => controlActive(post.id)}>Hiện</button>
                                )}
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

            {/* Modal chi tiết bài viết */}
            {selectedPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
                    <div className="relative bg-white p-5 rounded-lg shadow-lg w-[800px] max-w-full flex flex-col max-h-[90vh] overflow-y-auto z-[1001]">
                        <div className="flex justify-between items-center border-b-2 border-gray-500 p-4">
                            <h1 className="text-xl font-bold mb-1 flex-1 text-center">Chi tiết bài viết</h1>
                            <button className="text-gray-600 hover:text-red-500" onClick={onClose}>
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-2 flex-1">
                            <p>{selectedPost.content}</p>
                            {/* <p><strong>Người dùng:</strong> {selectedPost.userId.firstName} {selectedPost.userId.lastName}</p>
                            <p><strong>Thời gian tạo:</strong> {formatDateString(selectedPost.createdAt)}</p>
                            <p><strong>Trạng thái:</strong> {selectedPost.activeStatus}</p> */}
                            {selectedPost.imageUrl && (
                                <div>
                                    <p><strong>Hình ảnh:</strong></p>
                                    <img src={selectedPost.imageUrl} className="w-[100%] mt-2 rounded" />
                                </div>
                            )}
                            <hr/>
                            {getListCmtByPost(selectedPost.id).comments.length > 0 ? (
                                <div>
                                    {getListCmtByPost(selectedPost.id).comments.map((cmt, index)=> (
                                        <div>
                                            {cmt.activeStatus == 'ACTIVE' && (
                                                <div>
                                                <div key={index} className="border-b p-2 flex justify-between">
                                                    <div className="flex flex-col gap-2">
                                                        <p className="font-semibold text-gray-800">👤 {cmt.userId.firstName + " " + cmt.userId.lastName}</p>
                                                        <p className="text-gray-700">{cmt.content}</p>
                                                        <p className="text-xs text-gray-500">{formatDateString(cmt.createdAt)}</p>
                                                    </div>
                                                    <div>
                                                        {cmt.activeStatus == 'ACTIVE' ? (
                                                            <button className="bg-red-500 p-1 rounded" onClick={() => controlActiveComment(cmt.id)}>Ẩn</button>
                                                        ) : (
                                                            <button className="bg-green-500 p-1 rounded" onClick={() => controlActiveComment(cmt.id)}>Hiện</button>
                                                        )}
                                                    </div>
                                                </div>
                                                <hr/>
                                                </div>
                                            )}
                                        </div>
                                        
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    Chưa có bình luận nào.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}