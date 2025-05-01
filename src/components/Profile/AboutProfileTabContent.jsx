import { div } from "framer-motion/client";
import { FaBirthdayCake, FaEnvelope, FaFemale, FaLock, FaMale, FaPencilAlt, FaPhone, FaPhoneAlt, FaPlusCircle, FaRegStar } from "react-icons/fa";

export default function AboutProfileTabContent ({activeAboutTab, user})  {
    switch (activeAboutTab) {
        case 'tongquan':
            return (
                <div className="flex flex-col gap-5 p-4">
                    <div className="flex justify-between">
                    <div className="flex justify-start gap-3">
                        <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                        <p className="text-blue-500 text-semibold text-[18px]">Thêm nơi làm việc</p>
                    </div>
                    <div className="flex justify-end"></div>
                    </div>
                    <div className="flex justify-between">
                    <div className="flex justify-start gap-3">
                        <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                        <p className="text-blue-500 text-semibold text-[18px]">Thêm trường trung học</p>
                    </div>
                    <div className="flex justify-end"></div>
                    </div>
                    <div className="flex justify-between">
                    <div className="flex justify-start gap-3">
                        <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                        <p className="text-blue-500 text-semibold text-[18px]">Thêm trường cao đẳng/đại học</p>
                    </div>
                    <div className="flex justify-end"></div>
                    </div>
                    <div className="flex justify-between">
                    <div className="flex justify-start gap-3">
                        <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                        <p className="text-blue-500 text-semibold text-[18px]">Thêm địa chỉ nơi sống</p>
                    </div>
                    <div className="flex justify-end"></div>
                    </div>
                    <div className="flex justify-between">
                    <div className="flex justify-start gap-3">
                        <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                        <p className="text-blue-500 text-semibold text-[18px]">Thêm quê quán</p>
                    </div>
                    <div className="flex justify-end"></div>
                    </div>
                    <div className="flex justify-between">
                    <div className="flex justify-start gap-3">
                        <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                        <p className="text-blue-500 text-semibold text-[18px]">Thêm tình trạng hôn nhân</p>
                    </div>
                    <div className="flex justify-end"></div>
                    </div>
                    <div className="flex justify-between">
                    <div className="flex justify-start gap-3">
                        <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                        <div className="flex flex-col">
                        <p className="text-blue-500 text-semibold text-[18px]">{user.phone}</p>
                        <p className="text-blue-500 text-[13px]">Di động</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <FaLock className="text-gray-500 h-4 w-4"/>
                        <FaPencilAlt className="text-gray-500 h-4 w-4"/>
                    </div>
                    </div>
                    <div className="flex justify-between">
                    <div className="flex justify-start gap-3">
                        <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                        <div className="flex flex-col">
                        <p className="text-blue-500 text-semibold text-[18px]">{user.email}</p>
                        <p className="text-blue-500 text-[13px]">Email</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <FaLock className="text-gray-500 h-4 w-4"/>
                        <FaPencilAlt className="text-gray-500 h-4 w-4"/>
                    </div>
                    </div>
                </div>
            );
        case 'congviec':
            return (
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3 p-3">
                        <div className=" text-[18px]">Công việc</div>
                        <div className="flex justify-start items-center gap-3">
                            <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">Thêm nơi làm việc</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 p-3">
                        <div className=" text-[18px]">Đại học/cao đẳng</div>
                        <div className="flex justify-start items-center gap-3">
                            <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">Thêm trường đại học/cao đẳng</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 p-3">
                        <div className=" text-[18px]">Trung học</div>
                        <div className="flex justify-start items-center gap-3">
                            <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">Thêm trường trung học</p>
                        </div>
                    </div>
                </div>
            );
        case 'noitungsong':
            return (
                <div className="flex flex-col gap-5">
                    <div className="text-[18px] m-3">Nơi từng sống</div>
                    <div className="flex flex-col gap-3 p-3">
                        <div className="flex justify-start items-center gap-3">
                            <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">Thêm quê quán</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 p-3">
                        <div className="flex justify-start items-center gap-3">
                            <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">Thêm thành phố</p>
                        </div>
                    </div>
                </div>
            );
        case 'thongtinlienhe':
            return (
                <div className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col gap-3">
                        <div className="text-[18px]">Thông tin liên hệ</div>
                        <div className="flex justify-between">
                            <div className="flex justify-start gap-3">
                                <FaPhoneAlt className="text-gray-500 h-4 w-4 mt-1"/>
                                <div className="flex flex-col">
                                    <p className="text-gray-500 text-semibold text-[15px]">{user.phone}</p>
                                    <p className="text-gray-500 text-[13px]">Di động</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <FaLock className="text-gray-500 h-4 w-4"/>
                                <FaPencilAlt className="text-gray-500 h-4 w-4"/>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex justify-start gap-3">
                                <FaEnvelope className="text-gray-500 h-4 w-4 mt-1"/>
                                <div className="flex flex-col">
                                    <p className="text-gray-500 text-semibold text-[15px]">{user.email}</p>
                                    <p className="text-gray-500 text-[13px]">Email</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <FaLock className="text-gray-500 h-4 w-4"/>
                                <FaPencilAlt className="text-gray-500 h-4 w-4"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="text-[18px]">Các trang web và liên kết xã hội</div>
                        <div className="flex flex-col gap-3 ">
                            <div className="flex justify-start items-center gap-3">
                                <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                                <p className="text-blue-500 text-semibold">Thêm một trang web</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 ">
                        <div className="flex justify-start items-center gap-3">
                                <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                                <p className="text-blue-500 text-semibold">Thêm một trang web xã hội</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="text-[18px]">Thông tin cơ bản</div>
                        <div className="flex flex-col gap-3 ">
                            <div className="flex justify-start items-center gap-3">
                                <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                                <p className="text-blue-500 text-semibold">Thêm một ngôn ngữ</p>
                            </div>
                        </div>
                        
                        {user.gender!=null ? (
                            <div className="flex justify-between">
                                <div className="flex justify-start gap-3">
                                    {user.gender=='MALE' ? (
                                        <FaMale className="text-gray-500 h-4 w-4 mt-1"/>
                                    ) : (
                                        <FaFemale className="text-gray-500 h-4 w-4 mt-1"/>
                                    )}
                                    <div className="flex flex-col">
                                        <p className="text-gray-500 text-semibold text-[15px]">{user.gender == 'MALE' ? 'Nam' : 'Nữ'}</p>
                                        <p className="text-gray-500 text-[13px]">Giới tính</p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <FaLock className="text-gray-500 h-4 w-4"/>
                                    <FaPencilAlt className="text-gray-500 h-4 w-4"/>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 ">
                                <div className="flex justify-start items-center gap-3">
                                    <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                                    <p className="text-blue-500 text-semibold">Thêm giới tính</p>
                                </div>
                            </div>
                        )}
                        {user.birthday != null ? (
                            <div className="flex justify-between">
                                <div className="flex justify-start gap-3">
                                    <FaBirthdayCake className="text-gray-500 h-4 w-4 mt-1"/>
                                    <div className="flex flex-col">
                                        <p className="text-gray-500 text-semibold text-[15px]">{user.birthday}</p>
                                        <p className="text-gray-500 text-[13px]">Sinh nhật</p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <FaLock className="text-gray-500 h-4 w-4"/>
                                    <FaPencilAlt className="text-gray-500 h-4 w-4"/>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 ">
                                <div className="flex justify-start items-center gap-3">
                                    <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                                    <p className="text-blue-500 text-semibold">Thêm sinh nhật</p>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-start items-center gap-3">
                            <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">Thêm xưng hô</p>
                        </div>
                    </div>
                </div>  
            );
        case 'giadinh':
            return (
                <div className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col gap-3">
                        <div className="text-[18px]">Mối quan hệ</div>
                        <div className="flex justify-start items-center gap-3">
                            <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">Thêm mối quan hệ</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="text-[18px]">Thành viên gia đình</div>
                        <div className="flex justify-start items-center gap-3">
                            <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">Thêm người thân</p>
                        </div>
                    </div>
                </div>
            );
        case 'chitiet':
            return (
                <div className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col gap-3">
                        <div className="text-[18px]">Giới thiệu về bản thân</div>
                        <div className="flex justify-start items-center gap-3">
                            <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">Viết một số điều về chính bạn</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="text-[18px]">Cách đọc tên</div>
                        <div className="flex justify-start items-center gap-3">
                            <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">Thêm cách đọc tên</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="text-[18px]">Các tên khác</div>
                        <div className="flex justify-start items-center gap-3">
                            <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">Thêm biệt danh, tên thường gọi</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="text-[18px]">Trích dẫn yêu thích</div>
                        <div className="flex justify-start items-center gap-3">
                            <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">Thêm trích dẫn yêu thích của bạn</p>
                        </div>
                    </div>
                </div>
            );
        case 'sukientrongdoi':
            return (
                <div className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col gap-3">
                        <div className="text-[18px]">Sự kiện trong đời</div>
                        <div className="flex justify-start items-center gap-3">
                            <FaPlusCircle className="text-blue-500 h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">Thêm một sự kiện trong đời</p>
                        </div>
                        <div className="flex justify-start items-center gap-3">
                            <FaRegStar className=" h-6 w-6 mt-0.5"/>
                            <p className="text-blue-500 text-semibold">
                            Không có sự kiện trong đời để hiển thị</p>
                        </div>
                    </div>
                </div>
            );
        default:
            return <div>Chưa có dữ liệu</div>;
    }
}