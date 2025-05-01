import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../Css/customSwiper.css"; // Import file CSS tùy chỉnh
import { div } from "framer-motion/client";
import { FaUserCircle } from "react-icons/fa";

const user = {
    workAt: "HoChiMinh City",
    graduatedAt: "Ba Gia High School",
    liveIn: "Quang Ngai",
    marritalStatus: "single",
    from: "SonTinh, QuangNgai",
};

// Danh sách ảnh Story
const images = [
    "https://via.placeholder.com/200x300?text=Story+1",
    "https://via.placeholder.com/200x300?text=Story+2",
    "https://via.placeholder.com/200x300?text=Story+3",
    "https://via.placeholder.com/200x300?text=Story+4",
    "https://via.placeholder.com/200x300?text=Story+5",
];

export default function PersonalInformation({ isOwnProfile, user, listFriends }) {
    const [hidePrev, setHidePrev] = useState(true);
    const [hideNext, setHideNext] = useState(false);
    
    // useEffect(() => {
    //     // Khi Swiper mount xong, kiểm tra trạng thái next/prev
    //     setTimeout(() => {
    //         const swiper = document.querySelector(".mySwiper").swiper;
    //         setHidePrev(swiper.isBeginning);
    //         setHideNext(swiper.isEnd);
    //     }, 100);
    // }, []);

    return (
        <div className="flex flex-col p-4 gap-5">
            <div className="flex flex-col gap-5 shadow-md bg-white p-5 rounded-md">
                <h2 className="font-bold text-2xl">Giới thiệu</h2>

                {isOwnProfile && (
                    <div className="flex flex-col gap-6">
                        {/* <button className="w-full px-10 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300">
                            Thêm tiểu sử
                        </button> */}
                        {user.biography != null ? (
                            <div className="w-full px-10 py-2 text-center text-black ">{user.biography}</div>
                        ) : (
                            <button className="w-full px-10 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300">
                                Thêm tiểu sử
                            </button>
                        )}

                        {/* Story Section */}
                        {/* <div className="w-full px-4 relative">
                            <Swiper
                                slidesPerView={3}
                                spaceBetween={10}
                                navigation={{
                                    nextEl: ".swiper-button-next",
                                    prevEl: ".swiper-button-prev",
                                }}
                                modules={[Navigation]}
                                className="mySwiper"
                                onSlideChange={(swiper) => {
                                    setHidePrev(swiper.isBeginning);
                                    setHideNext(swiper.isEnd);
                                }}
                            >
                                {images.map((src, index) => (
                                    <SwiperSlide key={index} className="rounded-lg overflow-hidden shadow-md">
                                        <img
                                            src={src}
                                            alt={`Story ${index + 1}`}
                                            className="w-full h-40 object-cover rounded-md border border-gray-300"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <div className={`swiper-button-prev custom-nav-btn ${hidePrev ? "hidden" : ""}`}></div>
                            <div className={`swiper-button-next custom-nav-btn ${hideNext ? "hidden" : ""}`}></div>
                        </div> */}
                    </div>
                )}
            </div>

            {/* 💡 TÁCH "ẢNH" THÀNH PHẦN RIÊNG BIỆT */}
            <div className="flex justify-between items-center gap-5 shadow-md bg-white p-5 rounded-md">
                <h2 className="font-bold text-2xl">Ảnh</h2>
                <p className="text-blue-500 cursor-pointer">Xem tất cả ảnh</p>
            </div>
            <div className="flex flex-col gap-1 shadow bg-white p-5 rounded-md">
                {/* Tiêu đề */}
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-2xl">Bạn bè</h2>
                    <p className="text-blue-500 cursor-pointer">Xem tất cả bạn bè</p>
                </div>
                <div>{listFriends.length} bạn bè</div>

                {/* Grid danh sách bạn bè */}
                <div className="grid grid-cols-3 gap-3">
                    {/* <div className="p-1 flex flex-col gap-1">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi5sTqyWXMuHWDzEI_BGr_0x3sFTA3TBG3SQ&s"
                            alt="bạn bè 1"
                            className="rounded-md object-cover"
                        />
                        <p className="text-xs font-bold">Nguyễn Văn A</p>
                    </div>
                    <div className="p-1 flex flex-col gap-1">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi5sTqyWXMuHWDzEI_BGr_0x3sFTA3TBG3SQ&s"
                            alt="bạn bè 1"
                            className="rounded-md object-cover"
                        />
                        <p className="text-xs font-bold">Nguyễn Văn A</p>
                    </div>
                    <div className="p-1 flex flex-col gap-1">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi5sTqyWXMuHWDzEI_BGr_0x3sFTA3TBG3SQ&s"
                            alt="bạn bè 1"
                            className="rounded-md object-cover"
                        />
                        <p className="text-xs font-bold">Nguyễn Văn A</p>
                    </div>
                    <div className="p-1 flex flex-col gap-1">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi5sTqyWXMuHWDzEI_BGr_0x3sFTA3TBG3SQ&s"
                            alt="bạn bè 1"
                            className="rounded-md object-cover"
                        />
                        <p className="text-xs font-bold">Nguyễn Văn A</p>
                    </div>
                    <div className="p-1 flex flex-col gap-1">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi5sTqyWXMuHWDzEI_BGr_0x3sFTA3TBG3SQ&s"
                            alt="bạn bè 1"
                            className="rounded-md object-cover"
                        />
                        <p className="text-xs font-bold">Nguyễn Văn A</p>
                    </div>
                    <div className="p-1 flex flex-col gap-1">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi5sTqyWXMuHWDzEI_BGr_0x3sFTA3TBG3SQ&s"
                            alt="bạn bè 1"
                            className="rounded-md object-cover"
                        />
                        <p className="text-xs font-bold">Nguyễn Văn A</p>
                    </div>
                    <div className="p-1 flex flex-col gap-1">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi5sTqyWXMuHWDzEI_BGr_0x3sFTA3TBG3SQ&s"
                            alt="bạn bè 1"
                            className="rounded-md object-cover"
                        />
                        <p className="text-xs font-bold">Nguyễn Văn A</p>
                    </div> */}
                    {listFriends.slice(0, 7).map(e => (
                        <div className="p-1 flex flex-col gap-1 shadow rounded">
                            {e.imageUrl!=null ? (
                                <img
                                    src={e.imageUrl}
                                    alt="bạn bè"
                                    className="rounded-md object-cover"
                                />
                            ) : (
                                <div className=" p-1">
                                    <FaUserCircle className="rounded-md w-full h-full text-gray-300 object-cover"/>
                                </div>
                            )}
                            <p className="text-xs font-bold ">{e.firstName + " " + e.lastName}</p>
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-[13px] color-gray-500">Quyền riêng tư  · Điều khoản  · Quảng cáo  · Lựa chọn quảng cáo   · Cookie  ·   · Meta © 2025</p>
        </div>
    );
}
