import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

//Cấu hình axios gọi api thay cho fetch
const api = axios.create({//nếu chưa deploy thì xài url local,nếu đã deploy thì lấy link Backend từ Vercel
    baseURL: import.meta.env.MODE === 'development'
        ? 'http://localhost:5001/api'
        : import.meta.env.VITE_API_URL,
    withCredentials: true //gửi cookie lên server nếu ko có thì user bị log out liên tục
})

//gắn access token vào req header
api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();//lấy access token từ store

    if (accessToken) {
        //gắn token vào header
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
})

//Tự động gọi refresh api khi access token hết hạn
api.interceptors.response.use((res) => res, async (error) => {
    const originalResquest = error.config;//lấy cấu hình của request vừa lỗi

    //những APIs ko cần check
    if (originalResquest.url.includes('/auth/sign-in')
        || originalResquest.url.includes('/auth/sign-up')
        || originalResquest.url.includes('/auth/refresh')) {
        return Promise.reject(error);
    }

    //Giới hạn số lần thử 
    originalResquest._retryCount = originalResquest._retryCount || 0;

    if (error.response?.status === 403 && originalResquest._retryCount < 4) {
        //Tăng lần thử
        originalResquest._retryCount += 1
        try {
            //Lấy access token từ refresh
            const res = await api.post('/auth/refresh', { withCredentials: true })
            const newAccessToken = res.data.accessToken;

            //Gán vào store
            useAuthStore.getState().setAccessToken(newAccessToken);

            //Gắn access token mới vào req header cũ 
            originalResquest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalResquest);
        } catch (refreshError) {//Nếu lỗi
            useAuthStore.getState().clearState();//clear toàn bộ state
            return Promise.reject(refreshError)//reject lỗi
        }
    }

    return Promise.reject(error);
})

export default api;