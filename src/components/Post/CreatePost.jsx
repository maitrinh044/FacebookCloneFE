export default function CreatePost() {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 mb-4">
        {/* Avatar + Input */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src="https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-6/458161522_2243394162660512_7913931544320209269_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFE4H0KfJHUauSeB90nsw9jIBJwHuSktOAgEnAe5KS04F5KUxSkb8DlPyoPUcf2mlb9fV6MzqCuAtSLoc7Ay6-A&_nc_ohc=kqOz0D6i-YsQ7kNvgE4uLAK&_nc_oc=AdjLbeTvbqDpEf3PqOnXcGRJiflSyeVdVRHl3wj4WjlTjjDT9UrOc2T8xm-qtT1jjpRruk1l4INGD5vQifX-sHr0&_nc_zt=23&_nc_ht=scontent.fsgn2-5.fna&_nc_gid=AYszchcaBEzZ-DAYZzyEWyT&oh=00_AYHAhvAo71MOCC2cgl3wW0W092jaDfz81AjX8y_Xvqipiw&oe=67D4B119"
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <input
            type="text"
            placeholder="Bạn đang nghĩ gì thế?"
            className="flex-1 bg-gray-100 p-3 rounded-full outline-none hover:bg-gray-200 transition"
          />
        </div>
  
        {/* Action buttons */}
        <div className="flex justify-between border-t pt-3 text-sm text-gray-600">
          <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition">
            <span role="img" aria-label="live" className="text-red-500 text-lg">📹</span>
            <span>Video trực tiếp</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition">
            <span role="img" aria-label="photo" className="text-green-500 text-lg">🖼️</span>
            <span>Ảnh/Video</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition">
            <span role="img" aria-label="feeling" className="text-yellow-500 text-lg">😊</span>
            <span>Cảm xúc/Hoạt động</span>
          </button>
        </div>
      </div>
    );
  }
  