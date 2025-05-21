import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaBirthdayCake, FaBook, FaFemale, FaMale, FaPhone, FaTimes, FaUserCircle } from "react-icons/fa";
import { controlActiveStatusUser, findUsersByKeyword, getUser } from "../../services/userService";
import { useFetchUser } from "../../utils/useFetchUser";
import { useRowStyle } from "antd/es/grid/style";
import { update } from "../../services/profileService";
import { uploadMedia } from "../../services/MediaService";

export default function ({}) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [listUser, setListUser] = useState([]);
    const [keyword, setKeyword] = useState('');
    useEffect(() => {
        const fetchData = async() => {
            try {
                const data = await getUser();
                setListUser(data);
            } catch (error) {
                console.error("Error when fetch listUser: ", error);
            }
        }
        fetchData();
    },[]);
    // console.log("listUser: ", listUser);

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
    const currentPosts = listUser.slice(indexOfFirstPost, indexOfLastPost);

    // Tính tổng số trang
    const totalPages = Math.ceil(listUser.length / postsPerPage);

    const onClose = () => {
        setSelectedUser(null);
    }

    const controlActive = async(id) => {
        try {
            const response = await controlActiveStatusUser(id);
            const data = await getUser();
            setListUser(data);
        } catch (error) {
            console.error("Lỗi khi điều chỉnh trạng thái bài viết! ", error);
        }
    }

    const updateUser = async(data) => {
        try {
            const response = await update(data);
            const tmp = await getUser();
            setListUser(tmp);
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin người dùng! ", error);
        }
    }

    const findByKeyword = async (keyword) => {
        try {
            const response = await findUsersByKeyword(keyword);
            setListUser(response);
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin người dùng! ", error);
        }
    }
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const [firstName, setFirstName] = useState(selectedUser != null ? selectedUser.firstName : '');
    const [lastName, setLastName] = useState(selectedUser != null ? selectedUser.lastName : '')
    const [bio, setBio] = useState(selectedUser != null ? selectedUser.biography : '');
    const [profilePicture, setProfilePicture] = useState(selectedUser != null ? selectedUser.profilePicture : '');
    const [coverPhoto, setCoverPhoto] = useState(selectedUser != null ? selectedUser.coverPhoto : '');
    const [birthday, setBirthDay] = useState(selectedUser != null ? selectedUser.birthday : '');
    const [gender, setGender] = useState(selectedUser != null ? selectedUser.gender : '')
    const [email, setEmail] = useState(selectedUser != null ? selectedUser.email : '');
    const [phone, setPhone] = useState(selectedUser != null ? selectedUser.phone : '');
    useEffect(() => {
        if (selectedUser) {
            setFirstName(selectedUser.firstName);
            setLastName(selectedUser.lastName);
            setBio(selectedUser.biography);
            setProfilePicture(selectedUser.profilePicture);
            setCoverPhoto(selectedUser.coverPhoto);
            setBirthDay(selectedUser.birthday);
            setGender(selectedUser.gender);
            setEmail(selectedUser.email);
            setPhone(selectedUser.phone);
        }
    }, [selectedUser]);

    const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
        try {
        setAvatarFile(file); // lưu file để upload sau
        const imageUrl = URL.createObjectURL(file);
        setProfilePicture(imageUrl); // dùng để preview
        } catch (error) {
        console.error("Lỗi khi upload ảnh đại diện:", error);
        // Hiển thị thông báo nếu cần
        }
    }
    };


    const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
        setCoverFile(file);
        const imageUrl = URL.createObjectURL(file);
        setCoverPhoto(imageUrl);
    }
    };
    
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    const handleSave = async () => {
        let uploadedAvatar = null;
        let uploadedCover = null;
    
        if (avatarFile) {
            uploadedAvatar = await uploadMedia(avatarFile, selectedUser.id);
            setProfilePicture(uploadedAvatar.url); // cập nhật URL thực
        }
    
        if (coverFile) {
            uploadedCover = await uploadMedia(coverFile, selectedUser.id);
            setCoverPhoto(uploadedCover.url); // cập nhật URL thực
        }
    
        const updatedUser = {
            id: selectedUser.id, // Sử dụng selectedUser.id
            firstName: firstName,
            lastName: lastName,
            birthday: birthday,
            gender: gender,
            biography: bio,
            profilePicture: uploadedAvatar?.url || profilePicture,
            coverPhoto: uploadedCover?.url || coverPhoto,
            email: email,
            phone: phone,
            password: selectedUser.password, // Giả sử bạn không thay đổi mật khẩu
            role: selectedUser.role, // Giả sử bạn không thay đổi vai trò
            createdAt: selectedUser.createdAt, // Giả sử bạn không thay đổi ngày tạo
            activeStatus: selectedUser.activeStatus, // Giả sử bạn không thay đổi trạng thái
            online: selectedUser.online // Giả sử bạn không thay đổi trạng thái online
        };
    
        await updateUser(updatedUser); // Gọi hàm cập nhật với đối tượng đã chỉnh sửa
        onClose();
    };
    return (
            <div className="flex flex-col gap-5">
                {/* <div>Hiển thị quản lí user</div> */}
                <div className="flex justify-start gap-10">
                    <div className="flex flex-row gap-2">
                        <input className="p-2 rounded w-[500px]" placeholder="Tìm kiếm người dùng" onChange={(e) => setKeyword(e.target.value)}/>
                        <button className="p-2 shadow rounded hover:bg-gray-500 w-[100px] text-lg font-semibold" onClick={() => findByKeyword(keyword)}>Tìm</button>
                    </div>
                    
                    
                </div>
                <div className="">
                    <table className="w-[1200px] rounded p-4 rounded-t-lg table-auto border-separate border-spacing-2 ">
                        <thead className="bg-gray-200 p-5 rounded-lg h-[50px]">
                            <tr className="rounded-lg">
                                <th>STT</th>
                                <th>Tên người dùng</th>
                                <th>Giới tính</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {currentPosts.length > 0 ? (
                                currentPosts.map((user, index) => (
                                    <tr key={user.id} className="">
                                        <td>{index + 1}</td>
                                        <td>{user.firstName} {user.lastName}</td>
                                        <td>{user.gender === 'MALE' ? 'Nam' : 'Nữ'}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.activeStatus === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}</td>
                                        <td className="flex flex-row gap-3">
                                            <button className="p-1 rounded bg-blue-500" onClick={e => setSelectedUser(user)}>Sửa</button>
                                            {user.activeStatus === 'ACTIVE' ? (
                                                <button className="bg-red-500 p-1 rounded" onClick={e => controlActive(user.id)}>Khóa</button>
                                            ) : (
                                                <button className="bg-green-500 p-1 rounded" onClick={e => controlActive(user.id)}>Mở</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">Không có người dùng nào.</td>
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
    
                {/* Modal chi tiết user */}
                {selectedUser&& (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
                        <div className="relative bg-white p-5 rounded-lg shadow-lg w-[800px] max-w-full flex flex-col max-h-[90vh] overflow-y-auto z-[1001]">
                            <div className="flex justify-between items-center border-b-2 border-gray-500 p-4">
                                <h1 className="text-xl font-bold mb-1 flex-1 text-center">Chỉnh sửa thông tin người dùng</h1>
                                <button className="text-gray-600 hover:text-red-500" onClick={onClose}>
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="overflow-y-auto p-2 flex-1 flex flex-col gap-10">
                                <div className="flex flex-col gap-5">
                                    <div className="flex justify-between">
                                        <h2 className="font-bold text-[20px]">Ảnh đại diện</h2>
                                        <button
                                        className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2"
                                        onClick={() => avatarInputRef.current.click()}
                                        >
                                        {profilePicture ? "Chỉnh sửa" : "Thêm"}
                                        </button>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="rounded-full object-cover">
                                        {profilePicture ? (
                                            <img src={profilePicture} alt="avatar" className="w-40 h-40 rounded-full object-cover" />
                                        ) : (
                                            <FaUserCircle className="rounded-full object-cover w-40 h-40 text-gray-300" />
                                        )}
                                        {/* input file ẩn */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={avatarInputRef}
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                        </div>
                                    </div>
                                    </div>
                        
                                    <div className="flex flex-col gap-5">
                                    <div className="flex justify-between">
                                        <h2 className="font-bold text-[20px]">Ảnh bìa</h2>
                                        <button
                                        className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2"
                                        onClick={() => coverInputRef.current.click()}
                                        >
                                        {coverPhoto ? "Chỉnh sửa" : "Thêm"}
                                        </button>
                                    </div>
                                    <div className="flex justify-center">
                                        {coverPhoto ? (
                                        <div className="w-full max-w-[500px] mx-auto">
                                            <img
                                            src={coverPhoto}
                                            alt="cover"
                                            className="rounded-md object-cover w-full h-40"
                                            />
                                        </div>
                                        ) : (
                                        <div className="rounded-md object-cover w-full h-40 bg-gray-300"></div>
                                        )}
                                        <input
                                        type="file"
                                        accept="image/*"
                                        ref={coverInputRef}
                                        className="hidden"
                                        onChange={handleCoverChange}
                                        />
                                    </div>
                                    </div>
                                    <div className="flex flex-col gap-5">
                                    <div className="flex justify-between">
                                        <h2 className="font-bold text-[20px]">Tiểu sử</h2>
                                    </div>
                                    <div className="flex justify-center">
                                        <textarea
                                        className="text-gray-800 w-full h-[100px] p-1 resize-none overflow-y-auto text-start"
                                        value={bio}
                                        placeholder="Nhập tiểu sử của bạn..."
                                        onChange={(e) => setBio(e.target.value)}
                                        />
                                    </div>
                                    </div>
                                    <div className="flex flex-col gap-5">
                                    <div className="flex justify-between">
                                        <h2 className="font-bold text-[20px]">Chỉnh sửa phần giới thiệu</h2>
                                        {/* <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Thêm</button>
                                        {user.biography != null ? (
                                        <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Chỉnh sửa</button>
                                        ) : (
                                        <button className="bg-white text-blue-500 hover:bg-gray-300 rounded-md p-2">Thêm</button>
                                        )} */}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-5 mb-2">
                                        <div className="relative -top-[3px] mt-2 text-gray-600">
                                            Họ
                                        </div>
                                        {/* <div className="text-sm">{user.firstName + " " + user.lastName}</div> */}
                                        <input className="rounded p-1 flex-1" value={firstName} onChange={(e) => setFirstName(e.target.value)}></input>
                                        </div>
                                        <div className="flex items-center gap-5 mb-2">
                                        <div className="relative -top-[3px] mt-2 text-gray-600">
                                            Tên
                                        </div>
                                        {/* <div className="text-sm">{user.firstName + " " + user.lastName}</div> */}
                                        <input className="rounded p-1 flex-1" value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
                                        </div>
                                        <div className="flex items-center gap-5 mb-2">
                                        <div className="relative -top-[3px] mt-2 text-gray-600">
                                            {gender == 'MALE' ? (
                                            <FaMale />
                                            ) : (
                                            <FaFemale />
                                            )}
                                        </div>
                                        {/* <div className="text-sm">{user.gender == 'MALE' ? "Nam" : "Nữ"}</div> */}
                                        {/* <input className="rounded p-1 flex-1" value={user.gender == 'MALE' ? "Nam" : "Nữ"}  onChange={(e) => setFirstName(e.target.value)}></input> */}
                                        <select className="rounded p-1 flex-1" value={gender} onChange={(e) => setGender(e.target.value)}>
                                            <option value='MALE'>Nam</option>
                                            <option value='FEMALE'>Nữ</option>
                                            <option value='UNDEFINED'>Khác</option>
                                        </select>
                                        </div>
                                        <div className="flex items-center gap-5 mb-2">
                                        <div className="relative -top-[3px] mt-2 text-gray-600">
                                            <FaBook />
                                        </div>
                                        {/* <div className="text-sm">{user.email}</div> */}
                                        <input className="rounded p-1 flex-1" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                                        </div>
                                        <div className="flex items-center gap-5 mb-2">
                                        <div className="relative -top-[3px] mt-2 text-gray-600">
                                            <FaPhone />
                                        </div>
                                        {/* <div className="text-sm">{user.phone}</div> */}
                                        <input className="rounded p-1 flex-1" value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                                        </div>
                                        <div className="flex items-center gap-5 mb-2">
                                        <div className="relative -top-[3px] mt-2 text-gray-600">
                                            <FaBirthdayCake />
                                        </div>
                                        {/* <div className="text-sm">{user.phone}</div> */}
                                        <input className="rounded p-1 flex-1" value={birthday} onChange={(e) => setBirthDay(e.target.value)}></input>
                                        </div>
                                    </div>
                                    </div>
                                    {/*  */}
                                    <button
                                    className="bg-blue-100 text-blue-700 font-semibold text-[17px] px-4 py-2 rounded-md hover:bg-blue-200"
                                    onClick={handleSave}
                                    >
                                    Cập nhật
                                    </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
}