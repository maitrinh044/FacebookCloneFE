import { FaEllipsisH, FaUserCircle } from "react-icons/fa";

export default function AboutProfileTabFriendContent({user, activeAbout_FriendTab, listFriends}) {
    switch(activeAbout_FriendTab) {
        case 'tatcabanbe':
            return (
                <div className="grid grid-cols-2 gap-5 p-4">
                    {listFriends.length > 0 ? (
                        listFriends.slice(0,7).map(e => (
                            <div className="p-3 shadow rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div className="flex justify-start gap-3">
                                        
                                        {e.imageUrl!=null?(
                                            <img
                                                src={e.imageUrl}
                                                alt="avatar"
                                                className="object-cover rounded-lg h-20 w-20"
                                            />
                                        ):(
                                            <FaUserCircle className="object-cover text-gray-300 rounded-lg h-20 w-20"/>
                                        )}
                                        <div className="flex flex-col justify-center">
                                            <p className="text-[15px]">{user.firstName + " " + user.lastName}</p>
                                            {/* <p className="text-xs text-gray-500">48 bạn chung</p> */}
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button className="flex items-center justify-center rounded-full hover:bg-gray-300 h-8 w-8">
                                            <FaEllipsisH className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p>Chưa có bạn bè</p>
                        </div>
                    )}
                    
                </div>
            );
        case 'dathemganday':
            return (
                <div className="grid grid-cols-2 gap-5 p-4">
                    <div className="p-3 shadow rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start gap-3">
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="object-cover rounded-lg h-20 w-20"
                                />
                                <div className="flex flex-col justify-center">
                                    <p className="text-[15px]">{user.name}</p>
                                    <p className="text-xs text-gray-500">48 bạn chung</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="flex items-center justify-center rounded-full hover:bg-gray-300 h-8 w-8">
                                    <FaEllipsisH className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 shadow rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start gap-3">
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="object-cover rounded-lg h-20 w-20"
                                />
                                <div className="flex flex-col justify-center">
                                    <p className="text-[15px]">{user.name}</p>
                                    <p className="text-xs text-gray-500">48 bạn chung</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="flex items-center justify-center rounded-full hover:bg-gray-300 h-8 w-8">
                                    <FaEllipsisH className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            );
        case 'sinhnhat':
            return (
                <div className="grid grid-cols-2 gap-5 p-4">
                    <div className="p-3 shadow rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start gap-3">
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="object-cover rounded-lg h-20 w-20"
                                />
                                <div className="flex flex-col justify-center">
                                    <p className="text-[15px]">{user.name}</p>
                                    <p className="text-xs text-gray-500">48 bạn chung</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="flex items-center justify-center rounded-full hover:bg-gray-300 h-8 w-8">
                                    <FaEllipsisH className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 shadow rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start gap-3">
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="object-cover rounded-lg h-20 w-20"
                                />
                                <div className="flex flex-col justify-center">
                                    <p className="text-[15px]">{user.name}</p>
                                    <p className="text-xs text-gray-500">48 bạn chung</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="flex items-center justify-center rounded-full hover:bg-gray-300 h-8 w-8">
                                    <FaEllipsisH className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            );
        case 'tinh':
            return (
                <div className="grid grid-cols-2 gap-5 p-4">
                    <div className="p-3 shadow rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start gap-3">
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="object-cover rounded-lg h-20 w-20"
                                />
                                <div className="flex flex-col justify-center">
                                    <p className="text-[15px]">{user.name}</p>
                                    <p className="text-xs text-gray-500">48 bạn chung</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="flex items-center justify-center rounded-full hover:bg-gray-300 h-8 w-8">
                                    <FaEllipsisH className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 shadow rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start gap-3">
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="object-cover rounded-lg h-20 w-20"
                                />
                                <div className="flex flex-col justify-center">
                                    <p className="text-[15px]">{user.name}</p>
                                    <p className="text-xs text-gray-500">48 bạn chung</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="flex items-center justify-center rounded-full hover:bg-gray-300 h-8 w-8">
                                    <FaEllipsisH className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            );
        case 'dangtheodoi':
            return (
                <div className="grid grid-cols-2 gap-5 p-4">
                    <div className="p-3 shadow rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start gap-3">
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="object-cover rounded-lg h-20 w-20"
                                />
                                <div className="flex flex-col justify-center">
                                    <p className="text-[15px]">{user.name}</p>
                                    <p className="text-xs text-gray-500">48 bạn chung</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="flex items-center justify-center rounded-full hover:bg-gray-300 h-8 w-8">
                                    <FaEllipsisH className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 shadow rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start gap-3">
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="object-cover rounded-lg h-20 w-20"
                                />
                                <div className="flex flex-col justify-center">
                                    <p className="text-[15px]">{user.name}</p>
                                    <p className="text-xs text-gray-500">48 bạn chung</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="flex items-center justify-center rounded-full hover:bg-gray-300 h-8 w-8">
                                    <FaEllipsisH className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            );
        default:
            return (
                <h1>Chưa có dữ liệu</h1>
            );
    }
}