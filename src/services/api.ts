import axios, { AxiosRequestConfig, AxiosError } from 'axios';

// Use environment variable or fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create Axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle global errors like 401
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('access_token');
            // Optional: Redirect to login or dispatch plain event
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

// Generic API methods to decouple usage from Axios
export const get = <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> =>
    api.get(url, config).then((res) => res.data);

export const post = <T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> =>
    api.post(url, data, config).then((res) => res.data);

export const put = <T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> =>
    api.put(url, data, config).then((res) => res.data);

export const patch = <T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> =>
    api.patch(url, data, config).then((res) => res.data);

export const del = <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> =>
    api.delete(url, config).then((res) => res.data);

// Utility for image URLs if needed
export const getImageUrl = (relativePath: string) =>
    `${API_BASE_URL.replace('/api', '')}/proxy-image?path=${encodeURIComponent(relativePath)}`;


// --- Service Layer ---
export const authService = {
    async login(email: string, password: string) {
        const response = await post<any>('/api/auth/login', { email, password });
        if (response.accessToken) {
            localStorage.setItem('access_token', response.accessToken);
        }
        return response;
    },

    async signup(name: string, email: string, password: string, role: string = 'buyer') {
        const response = await post<any>('/api/auth/signup', { name, email, password, role });

        if (response.accessToken) {
            localStorage.setItem('access_token', response.accessToken);
        }
        return response;
    },

    async logout() {
        try {
            await post('/api/auth/logout');
        } catch (e) {
            console.warn('Logout failed on server', e);
        } finally {
            localStorage.removeItem('access_token');
        }
    },

    async getMe() {
        return await get<any>('/api/users/profile/me');
    }
};

export const projectService = {
    async createProject(projectData: any) {
        // Wrap in 'data' key as backend parses it from req.body.data
        return await post<any>('/api/projects', { data: projectData });
    },

    async updateProject(id: string, projectData: any) {
        return await put<any>(`/api/projects/${id}`, { data: projectData });
    },

    async uploadMedia(id: string, files: File[]) {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('media', file);
        });

        return await axios.post(`${API_BASE_URL}/api/projects/${id}/media`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        }).then(res => res.data);
    },

    async submitProject(id: string) {
        return await post<any>(`/api/projects/${id}/submit`);
    },

    async getAllProjects() {
        return await get<any>('/api/projects');
    },

    async getProjectsByStatus(status: string, owner?: string) {
        const query = owner ? `?owner=${owner}` : '';
        return await get<any>(`/api/projects/status/${status.toLowerCase()}${query}`);
    }
};

export const marketplaceService = {
    async getMarketplaceProjects(page: number = 1, limit: number = 10) {
        return await get<any>(`/api/marketplace?page=${page}&limit=${limit}`);
    },

    async getProjectById(id: string) {
        return await get<any>(`/api/projects/${id}`);
    }
};

export const discoverService = {
    async getDiscoverItems(params: { limit?: number; page?: number; category?: string; search?: string } = {}) {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.category && params.category !== 'All') queryParams.append('category', params.category.toLowerCase().replace(/\s+/g, '-'));
        if (params.search) queryParams.append('search', params.search);

        return await get<any>(`/api/discover?${queryParams.toString()}`);
    },

    async getSuggestions() {
        return await get<any>('/api/discover/suggestions');
    },

    async updateInterests(interests: string[]) {
        return await put<any>('/api/users/profile/me', { interests });
    }
};

export default {
    get,
    post,
    put,
    patch,
    del,
    authService,
    projectService,
    marketplaceService,
    discoverService
};
