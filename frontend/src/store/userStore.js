import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	register: async ({ name, email, password }) => {
		set({ loading: true });

		try {
			const res = await axios.post("/auth/register", { name, email, password });
			set({ user: res.data, loading: false });
			toast.success("Registration successful!");
		} catch (error) {
			set({ loading: false });
			console.log(error);
			toast.error(error.response.data.msg || "An error occurred");
		}
	},
	login: async (email, password) => {
		set({ loading: true });

		try {
			const res = await axios.post("/auth/login", { email, password });
			set({ user: res.data, loading: false });
        	toast.success("Login successful!");
		} catch (error) {
			console.log(error);
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
    googleLogin: async () => {
		set({ loading: true });

		try {
			window.location.href = "http://localhost:3000/api/auth/google";   
			       
			set({ loading: false });
		} catch (error) {
			set({ loading: false });
			console.log(error +  "An error occurred");
		}
	},

	logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

	checkAuth: async () => {
        set({ checkingAuth: true });
        try {

          const response = await axios.get("/auth/profile");
           console.log(response.data);
          set({ user: response.data.user });

        } catch (error) {
          console.log("Error in checkAuth:", error.message);
          set({ user: null });
        } finally {
          set({ checkingAuth: false }); // Ensures checkingAuth is set to false no matter what
        }
      },
	  setUser:async (user) =>{
		  set({user : user})
	  }

	
}));